import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { USER_CL, SYS_PARMS, SRCH_VIEW } from '../interfaces/structures';
import { ALL_ROWS } from '../core/consts';
import { Deferred } from '../core/pipe-utils';

@Injectable()
export class AppContext {
    /**
     * залогиненый пользователь
     */
    public CurrentUser: USER_CL;
    public SysParms: SYS_PARMS;
    /**
     * Настройки отображения
     */
    public UserViews: SRCH_VIEW[];

    /**
     * рабочие столы
     */
    public workBanches: any[];
    private _ready = new Deferred<any>();

    constructor(private pip: PipRX) { }

    ready(): Promise<any> {
        return this._ready.promise;
    }

    init(): Promise<any> {
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
                return p.read<SRCH_VIEW>({ SRCH_VIEW: isnViews, expand: 'SRCH_VIEW_DESC_List' })
                    .then((views) => ({ user: d, views: views }));
            });

        return Promise.all([oSysParams, oCurrentUser])
            .then(([sysParms, userWithViews]) => {
                this.SysParms = sysParms[0];
                this.CurrentUser = userWithViews.user;
                this.UserViews = userWithViews.views.map((userView) => this.pip.entityHelper.prepareForEdit(userView));
                this._ready.resolve('ready');
                return [this.CurrentUser, this.SysParms, this.UserViews];
            });
    }

    reInit() {
        this.init();
    }

}
