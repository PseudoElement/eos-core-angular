import { Injectable } from '@angular/core';
import { UserSelectNode } from '../../list-user-select/user-node-select';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { Subject, Observable } from 'rxjs';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DEPARTMENT } from 'eos-rest';

@Injectable()
export class RtUserSelectService {
    subject: Subject<any> = new Subject();
    subjectScan: Subject<any> = new Subject();
    subjectFlagBtnHeader: Subject<any> = new Subject();
    btnDisabled: boolean = false;
    hashUsers: Array<any> = [];
    ArraySystemHelper = {
        delo: {
            label: 'Дело',
            checked: false
        },
        delo_deloweb: {
            label: 'Дело+Дело-WEB',
            checked: false
        },
        delowebLGO: {
            label: 'Дело-WEB(ЛГО)',
            checked: false
        },
        delowebKL: {
            label: 'Дело-WEB(КЛ)',
            checked: false
        },
        APM: {
            label: 'АРМ руководителя',
            checked: false
        },
        EOS: {
            label: 'EOS Desktop Service',
            checked: false
        },
        SCAN: {
            label: 'Сканирование',
            checked: false
        },
        Pscan: {
            label: 'Поточное сканирование',
            checked: false
        },
        Shif: {
            label: 'ЭП и шифрование',
            checked: false
        },
        Scan_code: {
            label: 'Печать штрих-кода',
            checked: false
        },
        Notifer: {
            label: 'Оповещения и уведомления',
            checked: false
        },
        Search_code: {
            label: 'Поиск по штрих-коду',
            checked: false
        },
        MobNet: {
            label: 'Мобильный кабинет',
            checked: false
        },
        Informer: {
            label: 'Информер',
            checked: false
        }
    };
    scrollPosition: number = 0;
    flagDeleteScroll: boolean = true;
    flagDeleteSelectedUser: boolean = true;
    private _ChangeSelectUser: UserSelectNode;
    private UserCabinetInfo: Array<any>;
    constructor(private apiSrv: PipRX,
        private _msgSrv: EosMessageService
    ) {
        this.UserCabinetInfo = [];
    }
    get checkScanBtn() {
        return this.subjectScan.asObservable();
    }

    get changerUser(): Observable<any> {
        return this.subject.asObservable();
    }

    get setFlagBtnHeader() {
        return this.subjectFlagBtnHeader.asObservable();
    }
    changeSelectedUser(user: UserSelectNode) {
        if (user === null) {
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
    private _errorHandler(err): void {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: 'Ошибка приложения',
            msg: errMessage
        });
    }
}
