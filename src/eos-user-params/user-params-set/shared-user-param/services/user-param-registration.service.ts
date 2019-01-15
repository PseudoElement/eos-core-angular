import { Injectable, Injector } from '@angular/core';
import { EosUtils } from 'eos-common/core/utils';
import { BaseUserSrv } from './base-user.service';
import { REGISTRATION_USER } from '../consts/registration.consts';
import { PARM_SUCCESS_SAVE } from '../consts/eos-user-params.const';
import { FormGroup } from '@angular/forms';
import { USER_PARAMS_LIST_REGISTRATION_EMAIL_NAV } from '../consts/registration.consts';
import { IParamAccordionList } from '../../../shared/intrfaces/user-params.interfaces';

@Injectable()
export class UserParamRegistrationSrv extends BaseUserSrv {
    readonly fieldGroupsForRegistration: string[] = ['Доп. операции', 'Корр./адресаты',
    'Эл. почта', 'Сканирование', 'Автопоиск', 'СЭВ', 'РКПД'];
    readonly fieldsKeysForSearchCitizensInTheDirectoryByFields: string[] = ['DEF_SEARCH_CITIZEN_SURNAME',
'DEF_SEARCH_CITIZEN_SURNAME_RADIO', 'DEF_SEARCH_CITIZEN_CITY', 'DEF_SEARCH_CITIZEN_CITY_RADIO',
'DEF_SEARCH_CITIZEN_INDEX', 'DEF_SEARCH_CITIZEN_INDEX_RADIO', 'DEF_SEARCH_CITIZEN_ADDRESS',
'DEF_SEARCH_CITIZEN_ADDRESS_RADIO', 'DEF_SEARCH_CITIZEN_REGION', 'DEF_SEARCH_CITIZEN_REGION_RADIO',
'DEF_SEARCH_CITIZEN_OTHER', 'DEF_SEARCH_CITIZEN_OTHER_RADIO'];
    objectDataRcsend = {
        RCSEND_HIDE_OPERATION_SEND_EMAIL: 0,
        RCSEND_ENCRYPTION: 1,
        RCSEND_ELECTRONIC_SIGNATURE: 2,
        RCSEND_COMPRESS_ATTACHED_FILES: 3,
        RCSEND_CONSIDER_THE_TYPE_OF_DISPATCH: 4,
        RCSEND_REPORT_THE_DELIVERY_OF_THIS_MESSAGE: 5,
        RCSEND_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT: 6,
        RCSEND_RESOLUTIONS: 9,
        RCSEND_ADDRESSEES: 168,
        RCSEND_GROUP_OF_DOCUMENTS: 12,
        RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT: 13,
        RCSEND_SUMMARY: 14,
        RCSEND_SIGN_OF_COLLECTIVITY: 15,
        RCSEND_REGISTRATION_NUMBER: 16,
        RCSEND_REGISTRATION_NUMBER_SUBSET: 17,
        RCSEND_DATE_OF_REGISTRATION: 18,
        RCSEND_ACCESS_NECK: 19,
        RCSEND_HEADINGS: 162,
        RCSEND_ACCOMPANYING_DOCUMENTS: 166,
        RCSEND_NOTE_TO_THE_RK: 163,
        RCSEND_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE: 164,
        RCSEND_DOCUMENT_AUTHOR: 22,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION: 23,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE: 24,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION: 25,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE: 26,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN: 27,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS: 28,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY: 29,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION: 30,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE: 31,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET: 32,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL: 33,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED: 34,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME: 35,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION: 37,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION: 38,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING: 39,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER: 40,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER: 41,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION: 42,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN: 43,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME: 44,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS: 45,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS: 46,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS: 47,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY: 48,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION: 49,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE: 50,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET: 51,
        RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE: 52,
        RCSEND_VISAS: 53,
        RCSEND_VISAS_ORGANIZATION: 54,
        RCSEND_VISAS_ORGANIZATION_FULL_TITLE: 55,
        RCSEND_VISAS_ORGANIZATION_ABBREVIATION: 56,
        RCSEND_VISAS_ORGANIZATION_OGRN_CODE: 57,
        RCSEND_VISAS_ORGANIZATION_INN: 58,
        RCSEND_VISAS_ORGANIZATION_ADDRESS: 59,
        RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY: 60,
        RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION: 61,
        RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE: 62,
        RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET: 63,
        RCSEND_VISAS_ORGANIZATION_EMAIL: 64,
        RCSEND_VISAS_ORGANIZATION_EXECUTIVE: 65,
        RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME: 66,
        RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION: 68,
        RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION: 69,
        RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING: 70,
        RCSEND_ADDRESSES: 71,
        RCSEND_ADDRESSES_ORGANIZATION: 72,
        RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE: 73,
        RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION: 74,
        RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE: 75,
        RCSEND_ADDRESSES_ORGANIZATION_INN: 76,
        RCSEND_ADDRESSES_ORGANIZATION_ADDRESS: 77,
        RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY: 78,
        RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION: 79,
        RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE: 80,
        RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET: 81,
        RCSEND_ADDRESSES_ORGANIZATION_EMAIL: 82,
        RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED: 83,
        RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME: 84,
        RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION: 86,
        RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION: 87,
        RCSEND_ADDRESSES_CITIZEN: 88,
        RCSEND_ADDRESSES_CITIZEN_FULL_NAME: 89,
        RCSEND_ADDRESSES_CITIZEN_INN_SNILS: 90,
        RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS: 91,
        RCSEND_ADDRESSES_CITIZEN_ADDRESS: 92,
        RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY: 93,
        RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION: 94,
        RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE: 95,
        RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET: 96,
        RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE: 97,
        RCSEND_DOCUMENT_PERFORMER: 98,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION: 99,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE: 100,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION: 101,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE: 102,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN: 103,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS: 104,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY: 105,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION: 106,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE: 107,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET: 108,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL: 109,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED: 110,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME: 111,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION: 113,
        RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION: 114,
        RCSEND_ORDERS: 115,
        RCSEND_ORDERS_SYSTEM_NUMBER: 116,
        RCSEND_ORDERS_POINT_RESOLUTION: 117,
        RCSEND_ORDERS_ORDER_TEXT: 118,
        RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE: 119,
        RCSEND_ORDERS_RESOLUTION_CREATION_DATE: 120,
        RCSEND_ORDERS_ITEM_NUMBER: 121,
        RCSEND_ORDERS_PRIVACY_FEATURE: 122,
        RCSEND_ORDERS_RESOLUTION_AUTHOR: 123,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION: 124,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE: 125,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION: 126,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE: 127,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN: 128,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS: 129,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY: 130,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION: 131,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE: 132,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET: 133,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL: 134,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED: 135,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME: 136,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION: 139,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION: 140,
        RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING: 141,
        RCSEND_EXECUTOR: 142,
        RCSEND_EXECUTOR_ORGANIZATION: 143,
        RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE: 144,
        RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION: 145,
        RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE: 146,
        RCSEND_EXECUTOR_ORGANIZATION_INN: 147,
        RCSEND_EXECUTOR_ORGANIZATION_ADDRESS: 148,
        RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY: 149,
        RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION: 150,
        RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE: 151,
        RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET: 152,
        RCSEND_EXECUTOR_ORGANIZATION_EMAIL: 153,
        RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED: 154,
        RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME: 155,
        RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION: 156,
        RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION: 157,
        RCSEND_OREDER_FILES: 167,
        RCSEND_ADDITIONAL_DETAILS: 165
    };
    objectDataMailreceive = {
        MAILRECEIVE_DELETE_POST_AFTER_REGISTRATION: 0,
        MAILRECEIVE_DELETE_POST_AFTER_CANCELING_REGISTRATION: 10,
        MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT: 1,
        MAILRECEIVE_ATTACH_DOCUMENT_PASSPORT_TO_RK: 4,
        MAILRECEIVE_TAKE_RUBRICS_RK: 5,
        MAILRECEIVE_ACCOMPANYING_DOCUMENTS: 15,
        MAILRECEIVE_AUTOMATICALLY_ADD_ORGANIZATIONS_AND_REPRESENTATIVES: 9,
        MAILRECEIVE_CHECK_EMAIL_MESSAGES: 11,
        MAILRECEIVE_CHECK_EMAIL_FILE_ATTACHMENTS: 12,
        MAILRECEIVE_CHECK_EMAIL_RESOLUTION: 16,
        MAILRECEIVE_NOTIFY_SENDER_IF_EMAIL_IS_NOT_VALID: 13,
        MAILRECEIVE_NOTIFY_SENDER_IF_EMAIL_IS_VALID: 14
    };
    arrayOfIndexesRcsend = [];
    arrayOfIndexesMailReceive = [];
    oldStringRcsend;
    oldStringMailreceive;
    accordionListForEmail: IParamAccordionList[] = USER_PARAMS_LIST_REGISTRATION_EMAIL_NAV;
    pageId: 'send-options' | 'registration-options';
    newDataAttach;
    flagDisabledRcsendResolutions = false;
    flagDisabledRcsendAddressees = false;
    flagDisabledMailreceiveNotifyAboutRegistrationOrRefusalFromIt = false;
    flagDisabledMailreceiveTakeRubricsRk = false;
    inputAttach;
    prepInputsAttach;
    currTab = 0;
    formReadonliEmail: boolean;
    formAttach: FormGroup;
    _currentFormStatus;
    prepDataAttach = {rec: {}};
    constructor( injector: Injector ) {
        super(injector, REGISTRATION_USER);
        this.init();
        this.prepInputsAttach = this.getObjectInputFields(REGISTRATION_USER.fieldsChild);
        this.afterInit();
        this.getListOrgGroup().then(list => {
          if (list) {
            this.form.controls['rec.ORGGROUP_NAME'].patchValue( list[0]['CLASSIF_NAME'], {
                emitEvent: false,
            });
          }
        });
    }
    setTab(i: number) {
        this.currTab = i;
    }
    afterInit() {
        const allData = this._userParamsSetSrv.hashUserContext;
        this.openAccordion();
        this.formReadonliEmail = true;
        this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
        this.prepareData = this.convData(this.sortedData);
        this.prepDataAttachField(this.prepareData.rec);
        this.inputAttach = this.getInputAttach();
        this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
        this.oldStringRcsend = this.prepareData.rec.RCSEND;
        this.oldStringMailreceive = this.prepareData.rec.MAILRECEIVE;
        if (this.flagDisabledRcsendResolutions) {
            this.formAttach.controls['rec.RCSEND_RESOLUTIONS_RADIO'].enable();
        } else {
            this.formAttach.controls['rec.RCSEND_RESOLUTIONS_RADIO'].disable();
        }

        if (this.flagDisabledRcsendAddressees) {
            this.formAttach.controls['rec.RCSEND_ADDRESSEES_RADIO'].enable();
        } else {
            this.formAttach.controls['rec.RCSEND_ADDRESSEES_RADIO'].disable();
        }

        if (this.flagDisabledMailreceiveNotifyAboutRegistrationOrRefusalFromIt) {
            this.formAttach.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].enable();
        } else {
            this.formAttach.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].disable();
        }

        if (this.flagDisabledMailreceiveTakeRubricsRk) {
            this.formAttach.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].enable();
        } else {
            this.formAttach.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].disable();
        }

        for (let i = 0; i < this.constUserParam.disabledFields.length; i++) {
            this.formAttach.controls['rec.' + this.constUserParam.disabledFields[i]].disable();
        }
        this.subscriptions.push(
            this.formAttach.valueChanges
                .debounceTime(200)
                .subscribe(newVal => {
                    let changed = false;
                    Object.keys(newVal).forEach(path => {
                        if (this.changeByPathAttach(path, newVal[path])) {
                            changed = true;
                        }
                    });
                    this.formChanged.emit(changed);
                    this.isChangeForm = changed;
            })
        );
        this.subscriptions.push(
            this.formAttach.statusChanges.subscribe(status => {
                if (this._currentFormStatus !== status) {
                    this.formInvalid.emit(status === 'INVALID');
                }
                this._currentFormStatus = status;
            })
        );
    }
    checkLokfile_SSCAN() {
        if (this.newData.rec['LOCKFILE_SSCAN'] === 'YES' || 'NO') {
            this.newData.rec['LOCKFILE_SSCAN'] === 'YES' ?  this.newData.rec['LOCKFILE_SSCAN']  = '1' :  this.newData.rec['LOCKFILE_SSCAN'] = '0';
        }
    }
    prepDataAttachField(data) {
        for (const key of Object.keys(data)) {
            if (key === 'DEF_SEARCH_CITIZEN') {
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_SURNAME'] = data[key].charAt(5) === '1' ? '1' : '0';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_SURNAME_RADIO'] =
                data[key].charAt(0) === '1' ? '1' : data[key].charAt(0) === '2' ? '2' : '3';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_CITY'] = data[key].charAt(6) === '1' ? '1' : '0';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_CITY_RADIO'] =
                data[key].charAt(1) === '1' ? '1' : data[key].charAt(1) === '2' ? '2' : '3';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_INDEX'] = data[key].charAt(7) === '1' ? '1' : '0';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_INDEX_RADIO'] =
                data[key].charAt(2) === '1' ? '1' : data[key].charAt(2) === '2' ? '2' : '3';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_ADDRESS'] = data[key].charAt(8) === '1' ? '1' : '0';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_ADDRESS_RADIO'] =
                data[key].charAt(3) === '1' ? '1' : data[key].charAt(3) === '2' ? '2' : '3';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_REGION'] = data[key].charAt(9) === '1' ? '1' : '0';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_REGION_RADIO'] =
                data[key].charAt(4) === '1' ? '1' : '2';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_OTHER'] = data[key].charAt(11) === '1' ? '1' : '0';
                this.prepDataAttach.rec['DEF_SEARCH_CITIZEN_OTHER_RADIO'] =
                data[key].charAt(10) === '1' ? '1' : data[key].charAt(10) === '2' ? '2' : '3';
            } else if (key === 'RCSEND') {
                this.prepDataAttach.rec['RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO'] = data[key].charAt(7) === '0' &&
                // последняя проверка на случай если в базе для строки в позиции 7,8 хранятся одинаковые значения ...
                data[key].charAt(8) === '1' ? '1' : data[key].charAt(7) === '1' && data[key].charAt(8) === '0' ? '0' : data[key].charAt(7) === '1' &&
                data[key].charAt(8) === '1' ?  '1' : '0';
                this.prepDataAttach.rec['RCSEND_RESOLUTIONS'] = data[key].charAt(9) === '1' ?
                this.flagDisabledRcsendResolutions = true : false;
                this.prepDataAttach.rec['RCSEND_RESOLUTIONS_RADIO'] = data[key].charAt(10) === '0' &&
                data[key].charAt(11) === '1' ? '1' : data[key].charAt(10) === '1' && data[key].charAt(11) === '0' ? '0' : null;
                this.prepDataAttach.rec['RCSEND_ADDRESSEES'] = data[key].charAt(168) === '1' ?
                this.flagDisabledRcsendAddressees = true : false;
                this.prepDataAttach.rec['RCSEND_ADDRESSEES_RADIO'] = data[key].charAt(169) === '0' &&
                data[key].charAt(170) === '1' ? '1' : data[key].charAt(169) === '1' && data[key].charAt(170) === '0' ? '0' : null;
                for (const k of Object.keys(this.objectDataRcsend)) {
                    this.prepDataAttach.rec[k] = data[key].charAt(this.objectDataRcsend[k]) === '1' ? '1' : '0';
                }
            } else if (key === 'MAILRECEIVE') {
                for (const k of Object.keys(this.objectDataMailreceive)) {
                    this.prepDataAttach.rec[k] = data[key].charAt(this.objectDataMailreceive[k]) === '1' ? '1' : '0';
                }

                if (data[key].charAt(1) === '1') {
                    this.prepDataAttach.rec['MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT'] = '1';
                    this.flagDisabledMailreceiveNotifyAboutRegistrationOrRefusalFromIt = true;
                } else if (data[key].charAt(1) === '0') {
                    this.prepDataAttach.rec['MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT'] = '0';
                    this.flagDisabledMailreceiveNotifyAboutRegistrationOrRefusalFromIt = false;
                }
                this.prepDataAttach.rec['MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'] = data[key].charAt(2) === '1' ?
                '0' : data[key].charAt(3) === '1' ? '1' : null;

                if (data[key].charAt(5) === '1') {
                    this.prepDataAttach.rec['MAILRECEIVE_TAKE_RUBRICS_RK'] = '1';
                    this.flagDisabledMailreceiveTakeRubricsRk = true;
                } else if (data[key].charAt(5) === '0') {
                    this.prepDataAttach.rec['MAILRECEIVE_TAKE_RUBRICS_RK'] = '0';
                    this.flagDisabledMailreceiveTakeRubricsRk = false;
                }
                this.prepDataAttach.rec['MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'] = data[key].charAt(6) === '1' ? '1' :
                data[key].charAt(7) === '1' ? '0' : data[key].charAt(8) === '1' ? '-1' : null;
            }
        }
    }
    getInputAttach() {
        const dataInput = {rec: {}};
       // const valueForDisabled = true;
        Object.keys(this.prepDataAttach.rec).forEach(key => {
            if (key.substr(key.length - 5) !== 'RADIO') {
                if (this.prepDataAttach.rec[key] === '1') {
                    dataInput.rec[key] = true;
                } else if (this.prepDataAttach.rec[key] === '0') {
                    dataInput.rec[key] = false;
                }
            } else {
                dataInput.rec[key] = this.prepDataAttach.rec[key];
            }
              //  dataInput.rec[key] = this.prepDataAttach.rec[key];
        });
       // dataInput.rec['DEF_SEARCH_CITIZEN_SURNAME'] = true;
        return this.dataSrv.getInputs(this.prepInputsAttach, dataInput);
    }
    saveToSubmit(keyName) {
            if (keyName.indexOf('RCSEND') === 0) {
                if (Number(this.arrayOfIndexesRcsend.indexOf(this.objectDataRcsend[keyName])) === -1) {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyName]);
                }
                this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyName]);
            } else if (keyName.indexOf('MAILRECEIVE') === 0 && keyName !== 'MAILRECEIVE_TAKE_RUBRICS_RK_RADIO' && keyName !== 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO') {
                if (Number(this.arrayOfIndexesMailReceive.indexOf(this.objectDataMailreceive[keyName])) === -1) {
                    this.arrayOfIndexesMailReceive.push(this.objectDataMailreceive[keyName]);
                }
            }
    }
    toggleAllMarksThisCheckbox(event, keyName) {
        const arrayKeysSubsetsForAuthorOrganization = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForAuthorOrganizationAddress = [
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForAuthorOrganizationHasSigned = [
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING'];
        const arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION'];
        const arrayKeysSubsetsForAuthorCitizen = ['RCSEND_DOCUMENT_AUTHOR', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE'];
        const arrayKeysSubsetsForAuthorCitizenAddres = ['RCSEND_DOCUMENT_AUTHOR_CITIZEN', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET'];
        const arrayKeysSubsetsForVisas = ['RCSEND_VISAS_ORGANIZATION_FULL_TITLE', 'RCSEND_VISAS_ORGANIZATION_ABBREVIATION',
        'RCSEND_VISAS_ORGANIZATION_OGRN_CODE', 'RCSEND_VISAS_ORGANIZATION_INN', 'RCSEND_VISAS_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForVisasAddress = ['RCSEND_VISAS_ORGANIZATION_ADDRESS',
        'RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE',
        'RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForVisasExecutive = ['RCSEND_VISAS_ORGANIZATION_EXECUTIVE',
        'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION',
        'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING'];
        const arrayKeysSubsetsForAddressesOrganization = ['RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE',
        'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION', 'RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE',
        'RCSEND_ADDRESSES_ORGANIZATION_INN', 'RCSEND_ADDRESSES_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForAddressesOrganizationAddress = ['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS',
        'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed = ['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED',
        'RCSEND_ADDRESSES_ORGANIZATION', 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
        'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION',
        'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION'];
        const arrayKeysSubsetsForAddressesCitizen = ['RCSEND_ADDRESSES', 'RCSEND_ADDRESSES_CITIZEN', 'RCSEND_ADDRESSES_CITIZEN_FULL_NAME',
        'RCSEND_ADDRESSES_CITIZEN_INN_SNILS', 'RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS', 'RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE'];
        const arrayKeysSubsetsForAddressesCitizenAddress = ['RCSEND_ADDRESSES_CITIZEN_ADDRESS', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY',
        'RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET'];
        const arrayKeysSubsetsForPerformerOrganization = [
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForPerformerOrganizationAddress = [
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForPerformerOrganizationExecutive = ['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION'];
        const arrayKeysSubsetsForResolution = ['RCSEND_ORDERS_RESOLUTION_AUTHOR', 'RCSEND_EXECUTOR', 'RCSEND_ORDERS_SYSTEM_NUMBER',
        'RCSEND_ORDERS_POINT_RESOLUTION', 'RCSEND_ORDERS_ORDER_TEXT', 'RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE',
        'RCSEND_ORDERS_RESOLUTION_CREATION_DATE', 'RCSEND_ORDERS_ITEM_NUMBER', 'RCSEND_ORDERS_PRIVACY_FEATURE'];
        const arrayKeysSubsetsForResolutionAuthorOrganization = ['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'];
        const arrayKeysSubsetsForResolutionAuthorOrganizationAddress = ['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForResolutionAuthorOrganizationExecutive = [
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING'];
        const arrayKeysSubsetsForResolutionExecutorOrganization = [
        'RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE', 'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION', 'RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE',
        'RCSEND_EXECUTOR_ORGANIZATION_INN', 'RCSEND_EXECUTOR_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForResolutionExecutorOrganizationAddres = ['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS',
        'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForResolutionExecutorOrganizationExecutive = ['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED',
        'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME', 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
        'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION'];
        const arrayKeyForRadioButton = ['RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO', 'RCSEND_RESOLUTIONS_RADIO', 'RCSEND_ADDRESSEES_RADIO'];
        if (event.target.checked) {
            this.prepDataAttach.rec[keyName] = '1';
            this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyName]);
            // --------------------------Автор документа------------------------------------------------------------
            // Автор документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION') {
                arrayKeysSubsetsForAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Организация -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAuthorOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                   // if (this.arrayOfIndexesRcsend.indexOf(this.objectDataRcsend[elem]) === -1) {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                  //  }
                });
            }
            // Автор документа -> Организация -> Подписал
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAuthorOrganizationHasSigned.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Организация -> Номер автора документа
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Гражданин
            if (arrayKeysSubsetsForAuthorCitizen.some(elem => elem === keyName)) {
               // this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
            } else if (arrayKeysSubsetsForAuthorCitizenAddres.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = '1';
              //  this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
            }
            // Автор документа -> Гражданин -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = '1';
                arrayKeysSubsetsForAuthorCitizenAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
             }
             if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                arrayKeysSubsetsForAuthorCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            if (arrayKeysSubsetsForAuthorOrganization.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR']);
                    }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
            } else if (arrayKeysSubsetsForAuthorOrganizationAddress.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR']);
                }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
            } else if (arrayKeysSubsetsForAuthorOrganizationHasSigned.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED']);
                this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION']);
                this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR']);
                }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
            } else if (arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR']);
                }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1';
            }
            // --------------------------Визы------------------------------------------------------------
            // Визы -> Организация
            if (keyName === 'RCSEND_VISAS' || keyName === 'RCSEND_VISAS_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                arrayKeysSubsetsForVisas.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Визы -> Организация -> Адрес
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = '1';
                arrayKeysSubsetsForVisasAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Визы -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = '1';
                arrayKeysSubsetsForVisasExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            if (arrayKeysSubsetsForVisas.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS']);
                }
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS'] = '1';
            } else if (arrayKeysSubsetsForVisasAddress.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS_ORGANIZATION_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS']);
                }
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS'] = '1';
            } else if (arrayKeysSubsetsForVisasExecutive.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS_ORGANIZATION_EXECUTIVE']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_VISAS']);
                }
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS'] = '1';
            }
            // --------------------------Адресаты------------------------------------------------------------
            // Адресаты -> Организация
            if (keyName === 'RCSEND_ADDRESSES' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION') {
                arrayKeysSubsetsForAddressesOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Адресаты -> Организация -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' ||
            keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'] = '1';
                arrayKeysSubsetsForAddressesOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Адресаты -> Организация -> Кому адресован
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
            || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Адресаты -> Гражданин
            if (arrayKeysSubsetsForAddressesCitizen.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
            } else if (arrayKeysSubsetsForAddressesCitizenAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
            }
            // Адресаты -> Гражданин -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '1';
                arrayKeysSubsetsForAddressesCitizenAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
             }
             if (keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                arrayKeysSubsetsForAddressesCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
             if (arrayKeysSubsetsForAddressesOrganization.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES']);
                }
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
            } else if (arrayKeysSubsetsForAddressesOrganizationAddress.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES']);
                }
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
            } else if (arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES']);
                }
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
            } else if (arrayKeysSubsetsForAddressesCitizenAddress.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_CITIZEN_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ADDRESSES']);
                }
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1';
            }
            // --------------------------Исполнитель документа------------------------------------------------------------
            // Исполнитель документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION') {
                arrayKeysSubsetsForPerformerOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Исполнитель документа -> Организация -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = '1';
                arrayKeysSubsetsForPerformerOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Исполнитель документа -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '1';
                arrayKeysSubsetsForPerformerOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            if (arrayKeysSubsetsForPerformerOrganization.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER']);
                }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = '1';
            } else if (arrayKeysSubsetsForPerformerOrganizationAddress.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER']);
                }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = '1';
            } else if (arrayKeysSubsetsForPerformerOrganizationExecutive.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_PERFORMER']);
                }
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = '1';
            }
            // --------------------------Поручения------------------------------------------------------------
            // Поручения
            if (keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                arrayKeysSubsetsForResolution.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Автор резолюции -> Организация
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForResolutionAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Исполнитель -> Организация
            if (keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForResolutionExecutorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Адрес
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' ||
            keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' ||
            keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Исполнитель -> Организация -> Адрес
            if (keyName === 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Исполнитель -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            if (arrayKeysSubsetsForResolution.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ORDERS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            } else if (arrayKeysSubsetsForResolutionAuthorOrganization.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            } else if (arrayKeysSubsetsForResolutionExecutorOrganization.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            } else if (arrayKeysSubsetsForResolutionAuthorOrganizationAddress.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            } else if (arrayKeysSubsetsForResolutionAuthorOrganizationExecutive.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'] !== '1') {
                this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS_RESOLUTION_AUTHOR']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            } else if (arrayKeysSubsetsForResolutionExecutorOrganizationAddres.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            } else if (arrayKeysSubsetsForResolutionExecutorOrganizationExecutive.some(elem => elem === keyName)) {
                if (this.prepDataAttach.rec['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'] !== '1') {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR_ORGANIZATION']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_EXECUTOR']);
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_ORDERS']);
                }
                this.prepDataAttach.rec['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1';
            }
        } else {
            this.prepDataAttach.rec[keyName] = '0';
            this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyName]);
            // --------------------------Автор документа------------------------------------------------------------
            // Автор документа
            // Автор документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '0';
                this.arrayOfIndexesRcsend.push(this.objectDataRcsend['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION']);
                arrayKeysSubsetsForAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Организация -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                arrayKeysSubsetsForAuthorOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                  //  if (this.arrayOfIndexesRcsend.indexOf(this.objectDataRcsend[elem]) === -1) {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                  //  }
                });
            }
            // Автор документа -> Организация -> Подписал
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                arrayKeysSubsetsForAuthorOrganizationHasSigned.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Организация -> Номер автора документа
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Гражданин
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '0';
                arrayKeysSubsetsForAuthorCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Гражданин -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = '0';
                arrayKeysSubsetsForAuthorCitizenAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
             }
             // --------------------------Визы------------------------------------------------------------
             // Визы -> Организация
            if (keyName === 'RCSEND_VISAS' || keyName === 'RCSEND_VISAS_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '0';
                arrayKeysSubsetsForVisas.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Визы -> Организация -> Адрес
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = '0';
                arrayKeysSubsetsForVisasAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Визы -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = '0';
                arrayKeysSubsetsForVisasExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // --------------------------Адресаты------------------------------------------------------------
             // Адресаты -> Организация
             if (keyName === 'RCSEND_ADDRESSES' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '0';
                arrayKeysSubsetsForAddressesOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Адресаты -> Организация -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' ||
            keyName === 'RCSEND_ADDRESSES') {
                arrayKeysSubsetsForAddressesOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Адресаты -> Организация -> Кому адресован
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' ||
            keyName === 'RCSEND_ADDRESSES') {
                arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Адресаты -> Гражданин
            if (keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '0';
                arrayKeysSubsetsForAddressesCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Автор документа -> Гражданин -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '0';
                arrayKeysSubsetsForAddressesCitizenAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
             }
             // --------------------------Исполнитель документа------------------------------------------------------------
             // Исполнитель документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '0';
                arrayKeysSubsetsForPerformerOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
             // Исполнитель документа -> Организация -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = '0';
                arrayKeysSubsetsForPerformerOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // Исполнитель документа -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '0';
                arrayKeysSubsetsForPerformerOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
            // --------------------------Поручения------------------------------------------------------------
            // Поручения
            if (keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '0';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '0';
                arrayKeysSubsetsForResolution.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Автор резолюции -> Организация
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '0';
                arrayKeysSubsetsForResolutionAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Исполнитель -> Организация
            if (keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' ||  keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '0';
                arrayKeysSubsetsForResolutionExecutorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Адрес
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR'
            ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR'
            ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Исполнитель -> Организация -> Адрес
            if (keyName === 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }

            // Поручения -> Исполнитель -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[elem]);
                });
            }
    }
    arrayKeyForRadioButton.forEach( key => {
        this.prepDataAttach.rec[key] = this.formAttach.controls['rec.' + key].value;
      });

       this.inputAttach = this.getInputAttach();
       this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
    }


    changeByPathAttach(path: string, value: any) {
        let _value = null;
        _value = value;
        this.newDataAttach = EosUtils.setValueByPath(this.newDataAttach, path, _value);
        const oldValue = EosUtils.getValueByPath(this.prepDataAttach, path, false);
        if (oldValue !== _value) {
            // console.log('changed', path, oldValue, 'to', _value, this.prepDataAttach.rec);
        }
        return _value !== oldValue;
    }
    submit() {
        if (this.newData || this.newDataAttach || this.prepareData) {
            const userId = '' + this._userParamsSetSrv.userContextId;
           // console.log(userId);
            this.formChanged.emit(false);
            this.isChangeForm = false;
          //   this._userParamsSetSrv.getUserIsn(userId);
            if (this.newData && this.newDataAttach) {
                this.userParamApiSrv
                .setData(this.createObjRequestForAll())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newData) {
                this.checkLokfile_SSCAN();
                this.checkFieldOrgName();
            this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newDataAttach) {
                this.userParamApiSrv
                .setData(this.createObjRequestForAttach())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
                } else if (this.prepareData) {
                    this.userParamApiSrv
                    .setData(this.createObjRequestForDefaultValues())
                    .then(data => {
                        this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                        this._userParamsSetSrv.getUserIsn(userId);
                    })
                    // tslint:disable-next-line:no-console
                    .catch(data => console.log(data));
                }
               // const userId = '' + this._userParamsSetSrv.userContextId;
               // console.log(userId);
              //  this._userParamsSetSrv.getUserIsn(userId);
            }
        }
        createObjRequestForAttach(): any[] {
            let replacementItem, newValueStringForRcsend, newValueStringForMailReceive;
            let valueDefSearchCitizen = '';
            const arrayOfKeysInTheCorrectOrder = ['DEF_SEARCH_CITIZEN_SURNAME_RADIO', 'DEF_SEARCH_CITIZEN_CITY_RADIO',
           'DEF_SEARCH_CITIZEN_INDEX_RADIO', 'DEF_SEARCH_CITIZEN_ADDRESS_RADIO', 'DEF_SEARCH_CITIZEN_REGION_RADIO',
           'DEF_SEARCH_CITIZEN_SURNAME', 'DEF_SEARCH_CITIZEN_CITY', 'DEF_SEARCH_CITIZEN_INDEX', 'DEF_SEARCH_CITIZEN_ADDRESS',
           'DEF_SEARCH_CITIZEN_REGION', 'DEF_SEARCH_CITIZEN_OTHER_RADIO', 'DEF_SEARCH_CITIZEN_OTHER'];
            const req = [];
            const keyForSearchCitizensInTheDirectoryByFields = ['DEF_SEARCH_CITIZEN', 'RCSEND', 'MAILRECEIVE'];
            const userId = this._userParamsSetSrv.userContextId;
            // tslint:disable-next-line:forin
            for (let key = 0; key < keyForSearchCitizensInTheDirectoryByFields.length; key++) {
              if (keyForSearchCitizensInTheDirectoryByFields[key] === 'DEF_SEARCH_CITIZEN') {
                for (let i = 0; i < arrayOfKeysInTheCorrectOrder.length; i++) {
                    if (typeof this.newDataAttach.rec[arrayOfKeysInTheCorrectOrder[i]] === 'boolean') {
                        if (this.newDataAttach.rec[arrayOfKeysInTheCorrectOrder[i]] === true) {
                            valueDefSearchCitizen += '1';
                        } else {
                            valueDefSearchCitizen += '0';
                        }
                    } else {
                        valueDefSearchCitizen += this.newDataAttach.rec[arrayOfKeysInTheCorrectOrder[i]];
                    }
                }
            } else if (keyForSearchCitizensInTheDirectoryByFields[key] === 'RCSEND') {
                newValueStringForRcsend = this.oldStringRcsend;
                for (let i = 0; i < this.arrayOfIndexesRcsend.length; i++) {
                    replacementItem = this.oldStringRcsend.charAt(this.arrayOfIndexesRcsend[i]) === '1' ? '0' : '1';
                    newValueStringForRcsend = this.replaceAt(newValueStringForRcsend, this.arrayOfIndexesRcsend[i], replacementItem);
                }
                valueDefSearchCitizen = this.updateForSaveRadio('RCSEND', newValueStringForRcsend);
            } else if (keyForSearchCitizensInTheDirectoryByFields[key] === 'MAILRECEIVE') {
                newValueStringForMailReceive = this.oldStringMailreceive;
                for (let i = 0; i < this.arrayOfIndexesMailReceive.length; i++) {
                    replacementItem = this.oldStringMailreceive.charAt(this.arrayOfIndexesMailReceive[i]) === '1' ? '0' : '1';
                    newValueStringForMailReceive = this.replaceAt(newValueStringForMailReceive, this.arrayOfIndexesMailReceive[i], replacementItem);
                }
                // добавил для сохранения radio button
                valueDefSearchCitizen = this.updateForSaveRadio('MAILRECEIVE', newValueStringForMailReceive);
            }
            req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${keyForSearchCitizensInTheDirectoryByFields[key]}\')`,
                data: {
                    PARM_VALUE: `${valueDefSearchCitizen}`
                }
            });
        }
            return req;
        }
        replaceAt(str, index, replacement) {
            return str.substring(0, index) + replacement + str.substring(index + replacement.length);
        }

        updateForSaveRadio(key: string, newStringAll: string): string {
            switch (key) {
                case 'MAILRECEIVE':
                const newStringMAIL = this.updateStringFroRadioButton(newStringAll);
                return this.updateStringFroRadioAlert(newStringMAIL);
                case 'RCSEND':
                const newStringRESENT = this.udateStringForResentRadio('rec.RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO', newStringAll, 7, 9, '01', '10' );
                const newStringRESENTUP =  this.udateStringForResentRadio( 'rec.RCSEND_RESOLUTIONS_RADIO', newStringRESENT, 10, 12, '01', '10');
                return  this.udateStringForResentRadio('rec.RCSEND_ADDRESSEES_RADIO', newStringRESENTUP, 169, 171, '01', '10');
            }
        }
        updateStringFroRadioButton(newStringForMail: string) {
            const value = this.formAttach.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].value;
            switch (value) {
                case '1':
                return newStringForMail.substr(0, 6) + '100' + newStringForMail.substr(9);
                case '0':
                return newStringForMail.substr(0, 6) + '010' + newStringForMail.substr(9);
                case '-1':
                return newStringForMail.substr(0, 6) + '001' + newStringForMail.substr(9);
                default:
                return newStringForMail;
            }
        }

        updateStringFroRadioAlert(newStringForMail: string) {
            const value = this.formAttach.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].value;
            switch (value) {
                case '1':
                return newStringForMail.substr(0, 2) + '01' + newStringForMail.substr(4);
                case '0':
                return newStringForMail.substr(0, 2) + '10' + newStringForMail.substr(4);
                default:
                return newStringForMail;
            }
        }

        udateStringForResentRadio(nameInput: string, newStringForResend: string, start: number, end: number, from: string, to: string) {
            const value = this.formAttach.controls[nameInput].value;
            switch (value) {
                case '1':
                return newStringForResend.substr(0, start) + from + newStringForResend.substr(end);
                case '0':
                return newStringForResend.substr(0, start) + to + newStringForResend.substr(end);
                default:
                return newStringForResend;
            }
        }

        createObjRequestForAll() {
            const req = this.createObjRequest();
            const reqAttach = this.createObjRequestForAttach();
            const newReq = req.concat(reqAttach[0]);
            return newReq;
        }
        default() {
            const changed = true;
            const arrayListForDefault = [];
            this.prepInputs._list.forEach(elem => {
                if (elem === 'RCSEND' || elem.indexOf('RCSEND') !== 0 ) {
                    arrayListForDefault.push(elem);
                }
            });
            this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(arrayListForDefault);
            return this.getData(this.queryObjForDefault).then(data => {
                    this.prepareData = this.convDataForDefault(data);
                    this.prepDataAttachField(this.prepareData.rec);
                    this.inputAttach = this.getInputAttach();
                    this.inputs = this.getInputs();
                    this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                    this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
                    this.formChanged.emit(changed);
                    this.isChangeForm = changed;
                    this.subscribeChangeForm();
                })
                .catch(err => {
                    throw err;
                });
        }
        checkDataToDisabled(keyField, value) {
            if (keyField.indexOf('RCSEND') === 0) {
                if (Number(this.arrayOfIndexesRcsend.indexOf(this.objectDataRcsend[keyField])) === -1) {
                    this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyField]);
                }
            } else if (keyField.indexOf('MAILRECEIVE') === 0 && keyField !== 'MAILRECEIVE_TAKE_RUBRICS_RK_RADIO') {
                if (Number(this.arrayOfIndexesMailReceive.indexOf(this.objectDataMailreceive[keyField])) === -1) {
                    this.arrayOfIndexesMailReceive.push(this.objectDataMailreceive[keyField]);
                }
            }
            const keyFieldDisabled = keyField === 'RCSEND_RESOLUTIONS' ?
            'RCSEND_RESOLUTIONS_RADIO' : keyField === 'RCSEND_ADDRESSEES' ?
            'RCSEND_ADDRESSEES_RADIO' : keyField === 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT' ?
            'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO' :
            keyField === 'MAILRECEIVE_TAKE_RUBRICS_RK' ? 'MAILRECEIVE_TAKE_RUBRICS_RK_RADIO' : null;
            // по умолчанию если чекбокс не отмечен выбираем первый.
            if (this.formAttach.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].value === null) {
                this.formAttach.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].patchValue('1');
            }
            if (this.formAttach.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].value === null) {
                this.formAttach.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].patchValue('0');
            }
                // - //
            if (this.formAttach.controls['rec.' + keyField].value === value) {
                this.disabledField = true;
                this.formAttach.controls['rec.' + keyFieldDisabled].disable();
            } else {
                this.disabledField = false;
                this.formAttach.controls['rec.' + keyFieldDisabled].enable();
        }
    }
        cancel() {
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this.init();
            this.afterInit();
    }
    protected getListOrgGroup(node?: string, classfi?: boolean): Promise<any> {
        if (classfi) {
            this.form.controls['rec.ORGGROUP'].patchValue(node);
            node = this.form.controls['rec.ORGGROUP'].value;
        } else {
             !node ?   node = this.form.controls['rec.ORGGROUP'].value : node = node;
        }
        if (String(node) !== 'null') {
            const query = {
                ORGANIZ_CL: {
                    criteries: {
                        ISN_NODE: node
                    }
                }
            };
           return this.userParamApiSrv.getData(query);
        }
        return Promise.resolve(false);
    }
    protected checkFieldOrgName() {
        const name = this.form.controls['rec.ORGGROUP_NAME'].value;
        if (name === '') {
            this.newData.rec['ORGGROUP'] = '';
            this.form.controls['rec.ORGGROUP'].patchValue( '', {
                emitEvent: false,
            });
        }
    }
        private openAccordion() {
            this.accordionListForEmail.forEach((item: IParamAccordionList) => {
                if (item.url === this.pageId) {
                    item.isOpen = true;
                }
            });
        }
}
