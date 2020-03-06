import { Injectable } from '@angular/core';
import { UserSelectNode } from '../../list-user-select/user-node-select';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { Subject, Observable } from 'rxjs';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DEPARTMENT } from 'eos-rest';
import { BtnActionFields } from '../interfaces/btn-action.interfase';

@Injectable()
export class RtUserSelectService {
    subject: Subject<any> = new Subject();
    _updateBtn: Subject<any> = new Subject();
    subjectFlagBtnHeader: Subject<any> = new Subject();
    btnDisabled: boolean = false;
    hashUsers = new Map();
    usersInfo: BtnActionFields;
    ArraySystemHelper = {
        delo: {
            label: 'Дело',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        delo_deloweb: {
            label: 'Дело+Дело-WEB',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        delowebLGO: {
            label: 'Дело-WEB(ЛГО)',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        delowebKL: {
            label: 'Дело-WEB(КЛ)',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        APM: {
            label: 'АРМ руководителя',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        EOS: {
            label: 'EOS Desktop Service',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        SCAN: {
            label: 'Сканирование',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Pscan: {
            label: 'Поточное сканирование',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Shif: {
            label: 'ЭП и шифрование',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Scan_code: {
            label: 'Печать штрих-кода',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Notifer: {
            label: 'Оповещения и уведомления',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Search_code: {
            label: 'Поиск по штрих-коду',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        MobNet: {
            label: 'Мобильный кабинет',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        Informer: {
            label: 'Информер',
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
            label: 'Сервер удалённо проверки ЭП',
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
        /* MEDO: {
            label: 'Модуль сопряжения с МЭДО',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        AC_OG: {
            label: 'Модуль взаимодействия с АС ОГ',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        webWork: {
            label: 'Модуль интеграции с интернет приёмной',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        work_OG: {
            label: 'Опубликования хода работ с ОГ',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        MEDO_2_7: {
            label: 'Модуль сопряжения работ с МЭДО 2.7',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        },
        PPO_SSTY: {
            label: 'Модуль взаимодействия с РРО ССТУ',
            checked: false,
            Users: 0,
            ActualUsers: 0,
            Expired: '-',
        }, */
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
    get_cb_print_info(isn_user, isnDeep?: number): Promise<any> {
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
                    return Promise.all([this.apiSrv.read(queryUserParams), Promise.resolve(deep[0]), this.apiSrv.read(query)]);
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
        return this.getUserCabinets(isn_cl).then(resultCabinet => {
            if (resultCabinet.length > 0) {
                const leng = resultCabinet.length;
                for (let i = 0; i < leng; i += 1) {
                    cab_list += (resultCabinet as any)[i].ISN_CABINET + '|';
                    // i === length - 1 ? cab_list += (resultCabinet as any)[i].ISN_CABINET
                    //     : cab_list += (resultCabinet as any)[i].ISN_CABINET + '||';
                }
                return this.getCabinetName(cab_list).then(resultCabName => {
                    const lengt = resultCabinet.length;
                    for (let i = 0; i < lengt; i += 1) {
                        this.UserCabinetInfo[i] = resultCabinet[i];
                        this.UserCabinetInfo[i].CABINET_LIST = resultCabName[i];
                        // ищем кабинет , вадельцем которого является пользователь
                        if (due) {
                            if (due === resultCabName[i]['ISN_CABINET']) {
                                this.UserCabinetInfo[i]['CUSTOM_FIELD_MAIN'] = true;
                            } else {
                                this.UserCabinetInfo[i]['CUSTOM_FIELD_MAIN'] = false;
                            }
                        }
                    }
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
