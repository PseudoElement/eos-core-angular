import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { USER_CL, SYS_PARMS, SRCH_VIEW } from '../interfaces/structures';
import { ALL_ROWS } from '../core/consts';
import { Deferred } from '../core/pipe-utils';
import { IUserParms } from 'eos-rest';

export const CB_FUNCTIONS = 'CB_FUNCTIONS';
@Injectable()
export class AppContext {

    /**
     * залогиненый пользователь
     */
    public CurrentUser: USER_CL;
    public SysParms: SYS_PARMS;
    /**
    * Ограничения картотеками пользователя
    */
    public limitCardsUser: any[];
    /**
     * Настройки отображения
     */
    public UserViews: SRCH_VIEW[];
    public User99Parms: any;

    /**
     * рабочие столы
     */
    public workBanches: any[];

    public cbBase: boolean;
    private _ready = new Deferred<any>();

    constructor(private pip: PipRX) { }

    static isIE(): boolean {
        const ua = window.navigator.userAgent;
        return /MSIE|Trident/.test(ua);
    }

    ready(): Promise<any> {
        return this._ready.promise;
    }

    init(): Promise<any> {
        this.User99Parms = {};
        const p = this.pip;
        // раз присоеденились сбрасываем подавление ругательства о потере соединения
        // @igiware: потенциальная ошибка, тк PipeRX - singleton, параллельный запрос данных пропустит ошибку,
        //           как и последующие дальнейшие запросы
        // p.errorService.LostConnectionAlerted = false;

        const oSysParams = p.read<SYS_PARMS>({
            SysParms: ALL_ROWS,
            _moreJSON: {
                DbDateTime: new Date(),
                licensed: null,
                ParamsDic: '-99'
            }
        });

        const oCurrentUser = p.read<USER_CL>({
            CurrentUser: ALL_ROWS,
            expand: 'USERDEP_List,USERSECUR_List,USER_VIEW_List,USER_TECH_List',
            _moreJSON: { ParamsDic: null }
        })
            .then(([d]) => {
                const isnViews = d.USER_VIEW_List.map((view) => view.ISN_VIEW);
                this.limitCardsUser = d.USER_TECH_List.filter(card => card.FUNC_NUM === 1);
                this.limitCardsUser = this.limitCardsUser.map(card => card.DUE);
                let res = Promise.resolve({user: d, views: []});
                if (isnViews.length) {
                    res = p.read<SRCH_VIEW>({SRCH_VIEW: isnViews, expand: 'SRCH_VIEW_DESC_List'})
                        .then((views) => ({user: d, views: views}));
                }
                return res;
            });

        return Promise.all([oSysParams, oCurrentUser])
            .then(([sysParms, userWithViews]) => {
                this.SysParms = sysParms[0];
                if (this.SysParms._more_json.ParamsDic['CB_FUNCTIONS'] === 'YES') {
                    this.cbBase = true;
                }
                this.CurrentUser = userWithViews.user;
                this.UserViews = userWithViews.views.map((userView) => this.pip.entityHelper.prepareForEdit(userView));
                this._ready.resolve('ready');
                return [this.CurrentUser, this.SysParms, this.UserViews];
            });
    }

    reInit() {
        this.init();
    }

    // --------------------------------------------------------------
    public getParams(key: string): string {

        if (this.SysParms._more_json && this.SysParms._more_json.ParamsDic) {
            return this.SysParms._more_json.ParamsDic[key];
        }
        return null;
    }

    public get99UserParms(key: string, forceRefresh = false): Promise<IUserParms> {
        return Promise.resolve(this.User99Parms[key]).then((cached) => {
            if (forceRefresh || !cached) {
                const req = {
                    USER_PARMS: {
                        criteries: {
                            ISN_USER_OWNER: '-99',
                            PARM_NAME: key
                        }}};

                return this.pip.read(req)
                .then((r) => {
                    if (r && r[0] && r[0]) {
                        this.User99Parms[key] = r[0];
                        return r[0];
                    } else {
                        return null;
                    }
                });

            } else {
                return cached;
            }
        });
    }



}
