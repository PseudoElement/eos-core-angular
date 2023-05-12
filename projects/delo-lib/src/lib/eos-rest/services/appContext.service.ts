import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { USER_CL, SYS_PARMS, SRCH_VIEW } from '../interfaces/structures';
import { ALL_ROWS } from '../core/consts';
import { Deferred } from '../core/pipe-utils';
import { IUserParms } from '../../eos-rest';
import { Subject } from 'rxjs';
import ctxstore from '../../eos-rest/core/cntxHepler';

export const CB_FUNCTIONS = 'CB_FUNCTIONS';
@Injectable()
export class AppContext {

    public nameCentralСabinet = 'Центральная картотека';
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

    public hasUnlimTech: any;

    public cbBase: boolean;
    public setHeader = new Subject<boolean>();
    public licenze: any;
    private _ready = new Deferred<any>();
    private _sreamScane: boolean = false;
    constructor(private pip: PipRX) { }
    get sreamScane(): boolean {
        return this._sreamScane;
    }
    static isIE(): boolean {
        const ua = window.navigator.userAgent;
        return /MSIE|Trident/.test(ua);
    }
    updateLimitCardsUser(newLimitCard: Array<string>) {
        this.limitCardsUser = newLimitCard;
    }

    ready(): Promise<any> {
        return this._ready.promise;
    }

    /**
     * @method hasAnyTech - фукция запроса на наличие в системе неограниченных в видах документах системных технологов,
     * в случае остутствия таковых, по даем текущему ограниченному системному технологу доступ к видам документов
     * */
     hasAnyTech() {
        const query: any = {
            USER_CL: PipRX.criteries({ 'USER_CL.HasNonUserTechForAll': 9 }),
            top: '2',
            skip: '0',
            orderby: `CLASSIF_NAME`,
        };

        return this.pip
            .read<USER_CL>(query)
            .then((data) => {
                return data.length > 1;
            })
            .catch((e) => {
                console.error(e);
            });
    }

    init(): Promise<any> {
        this.User99Parms = {};
        const p = this.pip;
        // раз присоеденились сбрасываем подавление ругательства о потере соединения
        // @igiware: потенциальная ошибка, тк PipeRX - singleton, параллельный запрос данных пропустит ошибку,
        //           как и последующие дальнейшие запросы
        // p.errorService.LostConnectionAlerted = false;
        const dlicens =  this.pip.read<any>({
            'LicenseInfo': ALL_ROWS
          })
          .then((licenz: any) => {
            let ans = licenz;
            if (typeof(ans) === 'string') {
                ans = JSON.parse(ans);
            }
            this.licenze = ans;
          });
        const oSysParams = p.read<SYS_PARMS>({
            SysParms: ALL_ROWS,
            _moreJSON: {
                DbDateTime: new Date(),
                licensed: null,
                ParamsDic: '-99'
            }
        });
        p.read<SYS_PARMS>({
            DEPARTMENT: {
                criteries: {
                    DUE: '0.'
                },
            },
        })
        .then((dep) => {
            this.nameCentralСabinet = dep[0]['CARD_NAME']; // имя центральной картотеки, может использоваться в разных местах, добавил тут чтобы не приходилось постоянно делать лишний запрос
        });
        const oCurrentUser = p.read<USER_CL>({
            CurrentUser: ALL_ROWS,
            expand: 'USERDEP_List,USERSECUR_List,USER_VIEW_List,USER_TECH_List,USER_PARMS_List',
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

        return Promise.all([oSysParams, oCurrentUser, this.hasAnyTech(), dlicens])
            .then(([sysParms, userWithViews, isUnlimTech]) => {
                this.SysParms = sysParms[0];
                if (this.SysParms._more_json.ParamsDic['CB_FUNCTIONS'] === 'YES') {
                    this.cbBase = true;
                    ctxstore.cbBase = true;
                }
                if (this.SysParms._more_json.ParamsDic['STREAMSCAN_FUNCTIONS'] === 'YES') {
                    this._sreamScane = true;
                }
                this.CurrentUser = userWithViews.user;
                this.hasUnlimTech = isUnlimTech;
                this.UserViews = userWithViews.views.map((userView) => this.pip.entityHelper.prepareForEdit(userView));
                this._ready.resolve('ready');
                return [this.CurrentUser, this.SysParms, this.UserViews];
            });
    }

    reInit(): Promise<any> {
        return  this.init();
    }
    /** getClickModeSettings - метода обновления настроек вызова справочника */
    getClickModeSettings(value: string) {
        const moreJson = this.CurrentUser._more_json;
        moreJson.ParamsDic['CLASSIF_WEB_SUGGESTION'] = value;
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
