import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { DEPARTMENT, ORGANIZ_CL, SEV_ASSOCIATION } from '../../../eos-rest';
import { PipRX } from '../../../eos-rest/services/pipRX.service';
import { E_FIELD_TYPE } from '../../../eos-dictionaries/interfaces';
import { IInputParamControl } from '../../interfaces/sev.interface';
import { SevDescriptor } from './sev-descriptor';
import { InputControlService } from '../../../eos-common/services/input-control.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { EosDictService } from '../../services/eos-dict.service';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
import { SEV_SYNCHRO_CHECK_CRYPT_SOME, SEV_SYNCHRO_CHECK_ADDRESSES_SOME } from '../../../app/consts/confirms.const';
import { EosDictionaryNode } from '../../../eos-dictionaries/core/eos-dictionary-node';
import { merge } from 'lodash';
import { ErrorHelperServices } from '../../../eos-user-params/shared/services/helper-error.services';
import { SEV_DANGER_CHECK_ADDRESS, SEV_SUCCESS_SEND, SEV_WARN_CHECK_CRYPT_CERTS_ALL, SEV_WARN_CHECK_SEV_DEPARTMENTS } from '../../../eos-dictionaries/consts/messages.consts';

export const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
        controlType: E_FIELD_TYPE.select,
        key: 'ORG',
        label: 'Отправитель',
        disabled: false,
        readonly: false,
        options: [],
        required: true,
    },
];
@Component({
    selector: 'eos-sev-sync-dicts',
    templateUrl: './sync-dicts.component.html',
})

export class SevSyncDictsComponent implements OnInit {
    _descSrv = new SevDescriptor();
    inputFields = this._descSrv.fillValueInputField(BASE_PARAM_INPUTS);
    inputs = this._inputCtrlSrv.generateInputs(this.inputFields);
    form = this._inputCtrlSrv.toFormGroup(this.inputs, false);
    selectOrgs: any[] = [];
    isProgress: boolean = false;
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    private _mainOrgDue: string = '';
    private _mainOrgName: string = '';
    private _sevLinksCache: SEV_ASSOCIATION[];
    private _orgCryptsAndCerts: ORGANIZ_CL[] = [];
    private _queryOrgs: any[] = [];
    constructor(
        public bsModalRef: BsModalRef,
        private _api: PipRX,
        private _inputCtrlSrv: InputControlService,
        private _msgSrv: EosMessageService,
        private _dictSrv: EosDictService,
        private _confirmSrv: ConfirmWindowService,
        private _errSrv: ErrorHelperServices
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.form.enable({ onlySelf: true, emitEvent: false });
            this.unSubscribe();
            this.subscribe();
            this._getOptions();
            this._getSevDepartments();
        });
    }

    unSubscribe() {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

    subscribe() {
        this.form.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(data => { });
    }
    // updateStrToQuery(stringDue: any[]): string[] {
    //     const queries: any[] = [];
    //     if (stringDue.length > MAX_QUERY_DUES) { // разбиваем на куски по 177 кодов и делаем массив
    //         const step: number = 0;
    //         let finish: number = 0;
    //         while (step * MAX_QUERY_DUES < stringDue.length) {
    //             const start = MAX_QUERY_DUES * step;
    //             finish = step * MAX_QUERY_DUES + MAX_QUERY_DUES;
    //             if (finish > stringDue.length) {
    //                 finish = step * MAX_QUERY_DUES + (stringDue.length - MAX_QUERY_DUES);
    //             }
    //             const SELECTED_DUES = stringDue.slice(start, finish);
    //             const DUES_STR = SELECTED_DUES.join('|');
    //             queries.push(DUES_STR);
    //         }
    //     } else {
    //         queries.push(stringDue.join('|'));
    //     }
    //     return queries;
    // }

    getSelected(value) {
        return value === this._mainOrgDue;
    }

    isCrypt(ordDue: string): boolean {
        return this._dictSrv.getMarkedNodes().filter(x => ((x.data.rec.DUE === ordDue) && (x.data.rec.CRYPT))).length > 0;
    }

    handleClick() {
        this._mainOrgDue = this.form.controls['ORG'].value;
        this._mainOrgName = (this.selectOrgs.filter(x => x.value === this._mainOrgDue))[0].label;
        this._api.read<ORGANIZ_CL>({ ORGANIZ_CL: PipRX.criteries({ DUE: this._mainOrgDue }) }).then(item => {
            const SELECT_DUE: string = item[0].DUE;
            this._checkSevDeparments(SELECT_DUE);
        }
        );
    }

    private _getSevDepartments() {
        this._api.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: PipRX.criteries({ OBJECT_NAME: 'DEPARTMENT' }) }).then(sevLinks => {
            this._sevLinksCache = sevLinks.filter(item => item.OBJECT_NAME === 'DEPARTMENT');
        });
    }

    private _readMainOrg(): void {
        this._api.read({
            DELO_OWNER: 1
        }).then(resp => {
            if (resp.length) {
                this._mainOrgDue = resp[0]['DUE_ORGANIZ'];
                this._mainOrgName = resp[0]['NAME'];
                this._queryOrgs.push({ due: resp[0]['DUE_ORGANIZ'], name: resp[0]['NAME'] });
                this._readSevOrgs();
            }

        }).catch(err => { throw err; });
    }

    // живая проверка на бэке, не оптимизируем  запросы на бэке
    private _checkSevDeparments(ORG_DUE: string) { // чтение нужного подразделения
        this._api.read<DEPARTMENT>({ DEPARTMENT: PipRX.criteries({ DUE_LINK_ORGANIZ: ORG_DUE }) }).then(items => {
            if (items && items.length > 0) { // есть подразделение слинкованное с организаций
                // const ISN = items[0].ISN_NODE;
                const due = items[0].DUE;
                this._api.read<DEPARTMENT>({ DEPARTMENT: PipRX.criteries({ DUE: due + '%', IS_NODE: 1 }) }).then(employees => { // чтение сотрудников подразделения
                    if (employees && (employees.length > 0)) {

                        // проверка сотрудника в таблице SEV_ASSOC
                        let foundSevLink: boolean = false;
                        for (let i: number = 0; i < employees.length; i++) {
                            foundSevLink = this._sevLinksCache.some(x => x.OBJECT_ID === employees[i].DUE);
                            if (foundSevLink) { // нашли связь СЭВ
                                break;
                            }
                        }
                        if (foundSevLink) {
                            this._checkCryptsAndCerts();
                        } else {
                            this._warnCheckSevDeparments();
                        }
                    } else {
                        this._warnCheckSevDeparments();
                    }
                });
            } else {
                this._warnCheckSevDeparments();
            }
        });
    }

    private _warnCheckSevDeparments() {
        const msg = { ...SEV_WARN_CHECK_SEV_DEPARTMENTS, ... { title: `В организации ${this._mainOrgName} нет ДЛ с заполненным индексом СЭВ. Выполнение операции невозможно` } };
        this._msgSrv.addNewMessage(msg);
    }

    private _warnCheckCryptCertsAll() {
        this._msgSrv.addNewMessage(SEV_WARN_CHECK_CRYPT_CERTS_ALL);
    }

    // кидаем модал
    // отмена - окно закрываем
    // продолжить - идем на проверку адресов (проверка 3)
    private _confirmCheckCryptCertsSome(sevs: string[]) {
        const CUTS: string[] = sevs.length > 20 ? sevs.slice(0, 19) : sevs; // показывать только первые 20 названий
        const MSG = merge({ bodyList: CUTS }, SEV_SYNCHRO_CHECK_CRYPT_SOME);
        this._confirmSrv.confirm2(MSG).then(button => {
            switch (button.result) {
                case 1: this._checkExistsAddresses(); break;
                case 2: this.bsModalRef.hide();
            }
        }
        );
    }

    // тут должен нормальный вызов бэка для отправки сообщений
    private _sendDepartmentsSyncInfo(isAddressOrgs: any[]) {
        this.bsModalRef.hide();
        const ORGS_DUES_AR = isAddressOrgs.map(item => { const rec = item.data.rec; return rec.DUE_ORGANIZ; });
        // const ORGS_DUES_STR = ORGS_DUES_AR.join('|');
        const body = {
            // 'ownerDue': this._mainOrgDue,
            'orgsDue': ORGS_DUES_AR
        };

        const urlSop = `../CoreHost/Sev/SendDepartmentsSyncInfo/${this._mainOrgDue}`;
        this._api.getHttp_client().post(urlSop, body,  { responseType: 'blob' }).toPromise().then((response: any) => {
            this._msgSrv.addNewMessage(SEV_SUCCESS_SEND);

        }).catch(err => this._errSrv.errorHandler(err));
    }

    private _getOptions() {
        this._readMainOrg();
    }

    private _checkCryptsAndCerts() {
        this._orgCryptsAndCerts = [];
        const MARKED = this._dictSrv.getMarkedNodes();
        const SELECTED: any[] = MARKED.map(item => {
            const DATA = item.data.rec;
            return { DUE_ORGANIZ: DATA.DUE_ORGANIZ, CRYPT: DATA.CRYPT };
        });
        const isCrypt = (ordDue: string): boolean => {
            return SELECTED.some(x => ((x.DUE_ORGANIZ === ordDue) && (x.CRYPT === 1)));
        };
        const DUES = SELECTED.map(x => x.DUE_ORGANIZ).join('|');
        const CRIT = {
            ORGANIZ_CL: PipRX.criteries({ DUE: DUES }),
            expand: 'CONTACT_List'
        };

        this._api.read<ORGANIZ_CL>(CRIT).then(items => {
            items.forEach(org => {
                const isCerts: boolean = org.CONTACT_List.every(x => x.ID_CERTIFICATE !== null);
                if (isCerts && isCrypt(org.DUE)) {
                    this._orgCryptsAndCerts.push(org);
                }
            });

            // смотрим сколько с крипто = 1 и пустыми сертификатами в контактах
            if (this._orgCryptsAndCerts.length > 0) {
                if (SELECTED.length === this._orgCryptsAndCerts.length) {
                    this._warnCheckCryptCertsAll();
                } else {
                    if (this._orgCryptsAndCerts.length < SELECTED.length) {
                        this._confirmCheckCryptCertsSome(this._orgCryptsAndCerts.map(x => x.FULLNAME));
                    }
                }
            } else {
                this._checkExistsAddresses();
            }
        });
    }

    private _dangerCheckAddresses() {
        this._msgSrv.addNewMessage(SEV_DANGER_CHECK_ADDRESS);
    }

    // кидаем модал
    // отмена - окно закрываем
    // продолжить - идем на проверку адресов (проверка 3)
    private _confirmCheckAddresses(names: string[], IS_ADDRESS_ITEMS) {
        // показывать только первые 20 названий
        const CUTS: string[] = names.length > 20 ? names.slice(0, 19) : names;
        const MSG = merge({ bodyList: CUTS }, SEV_SYNCHRO_CHECK_ADDRESSES_SOME);
        this._confirmSrv.confirm2(MSG).then(button => {
            switch (button.result) {
                case 1: this._sendDepartmentsSyncInfo(IS_ADDRESS_ITEMS); break;
                case 2: this.bsModalRef.hide();
            }
        }
        );
    }

    // проверка наличия адресов у участников СЭВ
    private _checkExistsAddresses() {

        // сбор с криптой  = 0 и те где крипта 1 и есть сертификат (крипта 1 и нет сертификата не берем)
        const CHECK_ADDRESS_ITEMS = this._dictSrv.getMarkedNodes().filter(item => {
            const DATA = item.data.rec;
            if (DATA.CRYPT) {
                return this._orgCryptsAndCerts.some(x => x.DUE === DATA.DUE_ORGANIZ);
            } else {
                return true;
            }
        });

        // проход проверки адресов
        const NO_ADDRESS_ITEMS: EosDictionaryNode[] = [];
        const IS_ADDRESS_ITEMS: EosDictionaryNode[] = [];
        CHECK_ADDRESS_ITEMS.forEach(item => {
            const DATA = item.data.rec;
            if (DATA.ADDRESS !== null && DATA.ADDRESS !== undefined && DATA.ADDRESS !== '') {
                IS_ADDRESS_ITEMS.push(item);
            } else {
                NO_ADDRESS_ITEMS.push(item);
            }
        });

        if (CHECK_ADDRESS_ITEMS.length === NO_ADDRESS_ITEMS.length) {
            this._dangerCheckAddresses();
        } else {
            if (IS_ADDRESS_ITEMS.length === CHECK_ADDRESS_ITEMS.length) {
                this._sendDepartmentsSyncInfo(IS_ADDRESS_ITEMS);
            } else {
                const NAMES: string[] = NO_ADDRESS_ITEMS.map(item => { const { CLASSIF_NAME } = item.data.rec; return CLASSIF_NAME; });
                this._confirmCheckAddresses(NAMES, IS_ADDRESS_ITEMS);
            }
        }
    }

    private async _readSevOrgs(): Promise<void> {
        const reqObj = {
            SEV_ASSOCIATION: {
                criteries: {
                    OBJECT_NAME: 'ORGANIZ_CL'
                },
            }
        };
        const ansSev = await this._api.read<SEV_ASSOCIATION>(reqObj);
        const arraSevDUE = [];
        ansSev.forEach((sev) => {
            arraSevDUE.push(sev['OBJECT_ID'])
        });
        const arrayQuery = this._api.splitStrQueryLength(arraSevDUE);
        const queryes = [];
        arrayQuery.forEach((q) => {
            queryes.push(
                this._api.read<ORGANIZ_CL>({ ORGANIZ_CL: PipRX.criteries({
                    DUE: q,
                    IS_NODE: '1',
                })})
            );
            
        });
        Promise.all(queryes)
        .then((ans) => {
            ans.forEach((arrayOrg: ORGANIZ_CL[]) =>{
                arrayOrg.forEach((org: ORGANIZ_CL) => {
                    this.selectOrgs.push({ label: org.CLASSIF_NAME, value: org.DUE });
                })
            });
            this._setOrgSender();
        })
    }

    private _setOrgSender() {
        if (this._mainOrgDue && this._mainOrgDue !== '') {
            const EXISTS = this.selectOrgs.some(item => item.value === this._mainOrgDue);
            if (EXISTS) {
                this.form.controls['ORG'].patchValue(this._mainOrgDue);
            }
        } else {
            this.form.controls['ORG'].patchValue(this.selectOrgs[0].due);
        }
    }

}
