import { Injectable } from '@angular/core';
import { UserSelectNode } from '../../list-user-select/user-node-select';
import { PipRX } from 'eos-rest/services/pipRX.service';
import { Subject ,  Observable } from 'rxjs';
import { UserParamApiSrv } from '../../../eos-user-params/shared/services/user-params-api.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';

@Injectable()
export class RtUserSelectService {
    subject: Subject<any> = new Subject();
    subjectScan: Subject<any> = new Subject();
    subjectFlagBtnHeader: Subject<any> = new Subject();
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
        private _pipSrv: UserParamApiSrv,
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
        this._ChangeSelectUser = user;
        this.subject.next(this._ChangeSelectUser);
    }

    getDataIsDue(dueDep?: number): Promise<any> {
        const queryUser = {
            DEPARTMENT: {
                criteries: {
                    DUE: dueDep
                }
            }
        };
        return this.apiSrv.read(queryUser).then(res => {
            const query = {
                CB_PRINT_INFO: {
                    criteries: {
                        ISN_OWNER:  String(res[0]['ISN_LCLASSIF'])
                    }
                }
            };
            return this.apiSrv.read(query).then(fullname => {
                res[1] = fullname[0];
                return res;
            });
        });
    }

    getUserIsn(isn_cl, due?: number): Promise<any> {
        const queryUser = {
            USER_CL: {
                criteries: {
                    ISN_LCLASSIF: String(isn_cl)
                }
            },
            expand: 'USER_PARMS_List'
        };
        let DepartmentReq = null;
        const user = this._pipSrv.getData(queryUser).then(res => {
            return res[0];
        });

        if (due) {
            DepartmentReq = this.getDataIsDue(due);
        }
        return Promise.all([user, due ? DepartmentReq : Promise.resolve(5)]);
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
                    i === length - 1 ? cab_list += (resultCabinet as any)[i].ISN_CABINET
                     : cab_list += (resultCabinet as any)[i].ISN_CABINET + '||';
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
                            }   else {
                                this.UserCabinetInfo[i]['CUSTOM_FIELD_MAIN'] = false;
                            }
                        }
                    }

                    return this.UserCabinetInfo;
                }).catch(error => {
                    error.message = 'Внутренняя ошибка сервера';
                    this._errorHandler(error);
                    return false;
                });
            }
        }).catch(error => {
            error.message = 'Внутренняя ошибка сервера';
            this._errorHandler(error);
            return false;
        });
    }

    getSVGImage(photo: any): Promise<any> {
        const query = {DELO_BLOB: photo};
        return this.apiSrv.read(query);
    }
    private _errorHandler(err): void {
        const errMessage = err.message ? err.message : err;
        this._msgSrv.addNewMessage({
            type: 'danger',
            title: '',
            msg: errMessage
        });
    }
}
