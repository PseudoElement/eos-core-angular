import { Injectable } from '@angular/core';
import { UserSelectNode } from '../../list-user-select/user-node-select';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { Subject, Observable } from 'rxjs';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DEPARTMENT } from 'eos-rest';
import { BtnActionFields } from '../interfaces/btn-action.interfase';
import { AppContext } from 'eos-rest/services/appContext.service';

/**
 * флаг "withLicense" для опций, которые
 * должны отображаться в окне «Статистика»
 * только при наличии соответствующих лицензий.
 * В демо-версии не отображаются.
 */
@Injectable()
export class RtUserSelectService {
    subject: Subject<any> = new Subject();
    _updateBtn: Subject<any> = new Subject();
    subjectFlagBtnHeader: Subject<any> = new Subject();
    btnDisabled: boolean = false;
    hashUsers = new Map();
    usersInfo: BtnActionFields;
    updateSettings: boolean = false;
    ArraySystemHelper = {
        delo: {
            id: 1,
            label: 'Дело',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        delo_deloweb: {
            id: 0,
            label: 'Дело+Дело-WEB',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        delowebLGO: {
            id: 2,
            label: 'Дело-WEB(ЛГО)',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        delowebKL: {
            id: 28,
            label: 'Дело-WEB(КЛ)',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        APM: {
            id: 26,
            label: 'АРМ руководителя',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        EOS: {
            id: 22,
            label: 'EOS Desktop Service',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        SCAN: {
            id: 3,
            label: 'Сканирование',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Pscan: {
            id: 4,
            label: 'Поточное сканирование',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Shif: {
            id: 6,
            label: 'ЭП и шифрование',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Scan_code: {
            id: 16,
            label: 'Печать штрих-кода',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Notifer: {
            id: 17,
            label: 'Оповещения и уведомления',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Search_code: {
            id: 18,
            label: 'Поиск по штрих-коду',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        // MobNet: {
        //     label: 'Мобильный кабинет',
        //     checked: false
        // },
        Informer: {
            id: 27,
            label: 'Информер',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        EDITORMO: {
            id: 42,
            label: 'Редактор файлов МО',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        }
    };
    ArrayServerHelper = {
        server_web: {
            label: 'Сервер Дело-WEB',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        server_EP: {
            label: 'Сервер удалённой проверки ЭП',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        systemProces: {
            label: 'Подсистема управления процессами',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        SEW: {
            label: 'СЭВ',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        mail: {
            label: 'Партионная почта',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        MEDO: {
            label: 'Модуль сопряжения с МЭДО',
            checked: false,
            Trial: '-',
            Expired: '-',
            withLicense: true,
        },
        AC_OG: {
            label: 'Модуль взаимодействия с АС ОГ',
            checked: false,
            Trial: '-',
            Expired: '-',
            withLicense: true,
        },
        webWork: {
            label: 'Модуль интеграции с интернет приёмной',
            checked: false,
            Trial: '-',
            Expired: '-',
            withLicense: true,
        },
        work_OG: {
            label: 'Опубликования хода работ с ОГ',
            checked: false,
            Trial: '-',
            Expired: '-',
            withLicense: true,
        },
        MEDO_2_7: {
            label: 'Модуль взаимодействия с МЭДО. Расширенный',
            checked: false,
            Trial: '-',
            Expired: '-',
            withLicense: true,
        },
        PPO_SSTY: {
            label: 'Модуль взаимодействия с РРО ССТУ',
            checked: false,
            Trial: '-',
            Expired: '-',
            withLicense: true,
        },
        MRCHART: {
            label: 'Аналитические диаграммы',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        MTG: {
            label: 'Управление совещаниями',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        DEPREPL: {
            label: 'Замещение должностей',
            checked: false,
            Trial: '-',
            Expired: '-',
        },
        POSINTEGRATION: {
            label: 'Модуль интеграции с ПОС',
            checked: false,
            Trial: '-',
            Expired: '-',
        }
    };
    scrollPosition: number = 0;
    private _ChangeSelectUser: UserSelectNode;
    private UserCabinetInfo: Array<any>;
    constructor(private apiSrv: PipRX,
        private _msgSrv: EosMessageService
    ) {
        this.UserCabinetInfo = [];
    }
    get updateBtn() {
        return this._updateBtn.asObservable();
    }

    get changerUser(): Observable<any> {
        return this.subject.asObservable();
    }

    get setFlagBtnHeader() {
        return this.subjectFlagBtnHeader.asObservable();
    }
    changeSelectedUser(user: UserSelectNode) {
        if (user === null || user !== undefined) {
            this._ChangeSelectUser = user;
            this.subject.next(this._ChangeSelectUser);
        } else if (user.oracle_id !== null) {
            this._ChangeSelectUser = user;
            this.subject.next(this._ChangeSelectUser);
        }
    }

    getDepartMent(isnDeep): Promise<DEPARTMENT[]> {
        const query = {
            DEPARTMENT: {
                criteries: {
                    DUE: `${isnDeep}`
                }
            }
        };
        return this.apiSrv.read(query);
    }
    getCB_User_Role(isn_user, _appContext: AppContext): Promise<any> {
        if (_appContext.cbBase) {
            return this.apiSrv.read({
                CBR_USER_ROLE: {
                    criteries: { ISN_USER: isn_user }
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }
    get_cb_print_info(isn_user, isnDeep?: number, _appContext?: AppContext): Promise<any> {
        const queryUserParams = {
            USER_PARMS: {
                criteries: {
                    ISN_USER_OWNER: `${isn_user}`,
                    PARM_NAME: 'CATEGORY'
                }
            }
        };
        if (isnDeep) {
            return this.getDepartMent(isnDeep).then((deep: DEPARTMENT[]) => {
                if (deep && deep.length) {
                    const query = {
                        CB_PRINT_INFO: {
                            criteries: {
                                ISN_OWNER: `${deep[0].ISN_NODE}`
                            }
                        }
                    };
                    return Promise.all([this.apiSrv.read(queryUserParams), Promise.resolve(deep[0]), this.apiSrv.read(query), this.getCB_User_Role(isn_user, _appContext)]);
                }
            });
        } else {
            return Promise.all([this.apiSrv.read(queryUserParams), Promise.resolve(null)]);
        }

    }

    getUserCabinets(isn_cl): Promise<any> {
        const queryCabinet = {
            USER_CABINET: {
                criteries: {
                    ISN_LCLASSIF: String(isn_cl)
                }
            }
        };
        return this.apiSrv.read(queryCabinet)
            .then(result => {
                return result;
            });
    }

    getCabinetName(cabinet): Promise<any> {
        const queryCabinet = {
            CABINET: {
                criteries: {
                    ISN_CABINET: String(cabinet)
                }
            }
        };
        return this.apiSrv.read(queryCabinet)
            .then(result => {
                return result;
            });
    }


    getInfoCabinet(isn_cl, due?): Promise<any> {
        let cab_list = '';
        this.UserCabinetInfo = [];
        const arrayCabList = [];
        return this.getUserCabinets(isn_cl).then(resultCabinet => {
            if (resultCabinet.length > 0) {
                resultCabinet.forEach((elem) => {
                    cab_list +=  elem.ISN_CABINET + '|';
                    // i === length - 1 ? cab_list += (resultCabinet as any)[i].ISN_CABINET
                    //     : cab_list += (resultCabinet as any)[i].ISN_CABINET + '||';
                    if (cab_list.length > 1500) { // заполняем запрос, небольшим количеством символов, если их больше то разделяем на несколько запросов
                        arrayCabList.push(cab_list);
                        cab_list = '';
                    }
                });
                arrayCabList.push(cab_list); // если запрос был маленьким то добавляем его в массив и тем самым делаем всего один запрос
                const allQuery = [];
                arrayCabList.forEach((cabL) => {
                    allQuery.push(this.getCabinetName(cabL));
                });
                return Promise.all(allQuery)
                .then((resultCabName) => {
                    resultCabName.forEach((elem) => {
                        elem.forEach(element => {
                            const newUserCab = element;
                            newUserCab.CABINET_LIST = element;
                            if (due) {
                                if (due === element['ISN_CABINET']) {
                                    newUserCab['CUSTOM_FIELD_MAIN'] = true;
                                } else {
                                    newUserCab['CUSTOM_FIELD_MAIN'] = false;
                                }
                            }
                            this.UserCabinetInfo.push(newUserCab);
                        });
                    });
                    return this.UserCabinetInfo;
                });
            }
        }).catch(error => {
            error.message = 'Внутренняя ошибка сервера';
            this._errorHandler(error);
            return false;
        });
    }

    getSVGImage(photo: any): Promise<any> {
        const query = { DELO_BLOB: photo };
        return this.apiSrv.read(query);
    }
    clearHash() {
        this.hashUsers.clear();
    }
    private _errorHandler(err): void {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка приложения',
            msg: errMessage
        });
    }
}
