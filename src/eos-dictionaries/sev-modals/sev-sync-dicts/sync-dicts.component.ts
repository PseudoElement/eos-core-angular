import {Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {DEPARTMENT, ORGANIZ_CL, SEV_ASSOCIATION } from '../../../eos-rest';
import {PipRX} from 'eos-rest/services/pipRX.service';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { IInputParamControl } from '../../interfaces/sev.interface';
import { SevDescriptor } from './sev-descriptor';
import { InputControlService } from 'eos-common/services/input-control.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { IMessage } from 'eos-common/core/message.interface';
import { EosDictService } from '../../services/eos-dict.service';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { SEV_SYNCHRO_CHECK_CRYPT_SOME, SEV_SYNCHRO_CHECK_ADDRESSES_SOME } from 'app/consts/confirms.const';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';
import { merge } from 'lodash';

export const BASE_PARAM_INPUTS: IInputParamControl[] = [
    {
    controlType: E_FIELD_TYPE.select,
    key: 'ORG',
    label: 'Организация',
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
    orgs: any[] = [];
    isProgress: boolean = false;
    private _ngUnsubscribe: Subject<void> = new Subject<void>();
    private _mainOrgDue: string = '';
    private _mainOrgName: string = '';
    private _sevLinksCache: SEV_ASSOCIATION[];
    private _orgCryptsAndCerts: ORGANIZ_CL[] = [];
    // protected appctx: AppContext;

    constructor(
        public bsModalRef: BsModalRef,
        private _api: PipRX,
        private _inputCtrlSrv: InputControlService,
        private _msgSrv: EosMessageService,
        private _dictSrv: EosDictService,
        private _confirmSrv: ConfirmWindowService,
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

    // до PR убрать
    subscribe() {
        this.form.valueChanges.pipe(takeUntil(this._ngUnsubscribe)).subscribe(data => {   });
    }

    tryAddOrg(orgDue: string, name: string, mainOrg: boolean = false) {
        const dues = orgDue ? orgDue.split('|') : [''];
        const due = dues[0];
        this._api.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(due, 'ORGANIZ_CL')] })
            .then(rSevIndex => {
                if (mainOrg) {
                    this.form.controls['ORG'].patchValue(this._mainOrgDue);
                }
                if (rSevIndex && rSevIndex.length) {
                    this.orgs.push({label: name, value: orgDue});
                }
            });
    }

    getSelected(value) {
      return value === this._mainOrgDue;
    }

    isCrypt(ordDue: string): boolean {
        return this._dictSrv.getMarkedNodes().filter(x => ((x.data.rec.DUE === ordDue) && (x.data.rec.CRYPT))).length > 0;
    }

    handleClick() {
         const DUE_ORG = this.form.controls['ORG'].value;
         this._api.read<ORGANIZ_CL>({ ORGANIZ_CL: PipRX.criteries({ DUE: DUE_ORG } ) }).then(item => {
           const SELECT_DUE: string = item[0].DUE;
           this._checkSevDeparments(SELECT_DUE);
         }
       );
    }

    private _getSevDepartments() {
        this._api.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: PipRX.criteries({ OBJECT_NAME: 'DEPARTMENT' })}).then(sevLinks => {
                                                this._sevLinksCache = sevLinks.filter(item => item.OBJECT_NAME === 'DEPARTMENT');
                                        });
    }

    private _readMainOrg(): void {
      this._api.read<ORGANIZ_CL>({
          DELO_OWNER: -99
        }).then(resp => {
            const DUE = resp[0]['DUE_ORGANIZ'];
            const NAME = resp[0]['NAME'];
            this._mainOrgDue = DUE;
            this._mainOrgName = NAME;
            this.tryAddOrg(DUE, NAME, true);
            this._readSevOrgs();
        }).catch(err => { throw err; });
    }

    private _checkSevDeparments(ORG_DUE: string) {

        // чтение нужного подразделения
        this._api.read<DEPARTMENT>({ DEPARTMENT: PipRX.criteries({ DUE_LINK_ORGANIZ: ORG_DUE })}).then(items => {
            if (items && items.length > 0) { // есть подразделение слинкованное с организаций
                // чтение сотрудников подразделения
                   const ISN = items[0].ISN_NODE;
                    this._api.read<DEPARTMENT>({ DEPARTMENT: PipRX.criteries({ ISN_HIGH_NODE: ISN })}).then( employees => {
                        if (employees && (employees.length > 0)) {

                            // проверка сотрудника в таблице SEV_ASSOC
                            let foundSevLink: boolean = false;
                            for (let i: number = 0; i < employees.length; i++) {
                                foundSevLink = this._sevLinksCache.some(x => x.OBJECT_ID === employees[i].DUE );
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
        const MSG: IMessage = {
            type: 'info',
            title: `В организации ${this._mainOrgName} нет ДЛ с заполненным индексом СЭВ. Выполнение операции невозможно`,
            msg: ''
        };
        this._msgSrv.addNewMessage(MSG);
    }

    private _warnCheckCryptCertsAll() {
        const MSG: IMessage = {
            type: 'danger',
            title: 'У выбранных участников СЭВ не определен сертификат шифрования. Отправка сообщения невозможна',
            msg: ''
        };
        this._msgSrv.addNewMessage(MSG);
    }

    // кидаем модал
    // отмена - окно закрываем
    // продолжить - идем на проверку адресов (проверка 3)
    private _confirmCheckCryptCertsSome(sevs: string[]) {
        // показывать только первые 20 названий
        const CUTS: string[] = sevs.length > 20 ? sevs.slice(0, 19) : sevs;
        const MSG = merge({ bodyList: CUTS }, SEV_SYNCHRO_CHECK_CRYPT_SOME);
        this._confirmSrv.confirm2(MSG).then( button => {
          switch (button.result) {
            case 1: this._checkExistsAddresses();  break;
            case 2:  this.bsModalRef.hide();
            }
          }
        );
    }

    // тут должен нормальный вызов бэка для отправки сообщений
    private _sendDepartmentsSyncInfo(isAddressOrgs: any[]) {
        const changes = [];
        const ORGS_DUES_AR = isAddressOrgs.map(item => { const rec = item.data.rec; return rec.DUE_ORGANIZ; });
        const ORGS_DUES_STR = ORGS_DUES_AR.join('|');
        const DATA = {
          'ownerDue': this._mainOrgDue,
          'orgsDue': ORGS_DUES_STR
        };
        console.log(DATA);
        PipRX.invokeSop(changes, 'SendDepartmentsSyncInfo', DATA);
        this._api.batch(changes, '').then((response: any) => { console.log(response); });
        this.bsModalRef.hide();
    }

    private _getOptions() {
        this._readMainOrg();
    }

    private _checkCryptsAndCerts() {
        console.log('проверка крипты и сертификатов ...');
        this._orgCryptsAndCerts = [];
        const MARKED = this._dictSrv.getMarkedNodes();
        const SELECTED: any[] = MARKED.map(item => { const DATA = item.data.rec;
                                                      return { DUE_ORGANIZ: DATA.DUE_ORGANIZ, CRYPT: DATA.CRYPT };
                                                     });
        const isCrypt = (ordDue: string): boolean => {
          return SELECTED.some(x => ((x.DUE_ORGANIZ === ordDue) && (x.CRYPT === 1)));
        };
        const DUES = SELECTED.map(x => x.DUE_ORGANIZ).join('|');
        const CRIT = { ORGANIZ_CL: PipRX.criteries({ DUE: DUES }), expand: 'CONTACT_List' };
        this._api.read<ORGANIZ_CL>(CRIT).then(items => {
                                                          items.forEach(org => {
                                                          const isCerts: boolean = org.CONTACT_List.every(x => x.ID_CERTIFICATE !== null);
                                                          if (isCerts && isCrypt(org.DUE)) {
                                                             this._orgCryptsAndCerts.push(org);
                                                           }
                                                        });

                                                        console.log('массив = крипта = 1 и сертификатов = ', this._orgCryptsAndCerts);
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
        const MSG: IMessage = {
            type: 'danger',
            title: 'У выбранных участников СЭВ не заполнены параметры доставки сообщения. Отправка сообщения невозможна.',
            msg: ''
        };
        this._msgSrv.addNewMessage(MSG);
    }

    // кидаем модал
    // отмена - окно закрываем
    // продолжить - идем на проверку адресов (проверка 3)
    private _confirmCheckAddresses( names: string[], IS_ADDRESS_ITEMS ) {
        // показывать только первые 20 названий
        const CUTS: string[] = names.length > 20 ? names.slice(0, 19) : names;
        const MSG = merge({ bodyList: CUTS }, SEV_SYNCHRO_CHECK_ADDRESSES_SOME);
        this._confirmSrv.confirm2(MSG).then( button => {
          switch (button.result) {
            case 1: this._sendDepartmentsSyncInfo(IS_ADDRESS_ITEMS);  break;
            case 2: this.bsModalRef.hide();
            }
          }
        );
    }

    // проверка наличия адресов у участников СЭВ
    private _checkExistsAddresses() {
        console.log('проверка адресов ...');
        console.log('массив крипта и сертификат есть = ' , this._orgCryptsAndCerts);

        // сбор с криптой  = 0 и те где крипта 1 и есть сертификат (крипта 1 и нет сертификата не берем)
        const CHECK_ADDRESS_ITEMS = this._dictSrv.getMarkedNodes().filter( item => { const DATA = item.data.rec;
                                                                           console.log(DATA);
                                                                           if (DATA.CRYPT) {
                                                                            return this._orgCryptsAndCerts.some(x => x.DUE === DATA.DUE_ORGANIZ);
                                                                           } else {
                                                                            return true;
                                                                           }
                                                                        });
        console.log('массив проверки адресов = ', CHECK_ADDRESS_ITEMS);
        // проход проверки адресов
        const NO_ADDRESS_ITEMS: EosDictionaryNode[] = [];
        const IS_ADDRESS_ITEMS: EosDictionaryNode[] = [];
        CHECK_ADDRESS_ITEMS.forEach(item => {   const DATA = item.data.rec;
                                                if (DATA.ADDRESS !== null && DATA.ADDRESS !== undefined && DATA.ADDRESS !== '' ) {
                                                    IS_ADDRESS_ITEMS.push(item);
                                                } else {
                                                    NO_ADDRESS_ITEMS.push(item);
                                                }
                                                });

        console.log('массив пустых адресов = ', NO_ADDRESS_ITEMS);
        console.log('массив непустых адресов = ', IS_ADDRESS_ITEMS);
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

    private _readSevOrgs(): void {
        this._api.read<ORGANIZ_CL>({ ORGANIZ_CL: PipRX.criteries({ IS_NODE : '1' })}).then(items => {
            const ITEMS = items.filter(x => x['DUE'] !== this._mainOrgDue);
            ITEMS.forEach(org  => {
                const DUE = org['DUE'];
                const NAME = org['CLASSIF_NAME'];
                this.tryAddOrg(DUE, NAME);
                });

        }
      );
    }

}






