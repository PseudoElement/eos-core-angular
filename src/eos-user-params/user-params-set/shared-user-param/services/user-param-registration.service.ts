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
 /*arrayOfKeysInTheCorrectOrderForRcsend = ['RCSEND_HIDE_OPERATION_SEND_EMAIL', 'RCSEND_ENCRYPTION',
        'RCSEND_ELECTRONIC_SIGNATURE', 'RCSEND_COMPRESS_ATTACHED_FILES', 'RCSEND_CONSIDER_THE_TYPE_OF_DISPATCH',
    'RCSEND_REPORT_THE_DELIVERY_OF_THIS_MESSAGE', 'RCSEND_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT',
    'RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND', 'RCSEND_RESOLUTIONS', 'RCSEND_RESOLUTIONS_RADIO', 'RCSEND_ADDRESSEES',
    'RCSEND_ADDRESSEES_RADIO', 'RCSEND_GROUP_OF_DOCUMENTS', 'RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT',
    'RCSEND_REGISTRATION_NUMBER', 'RCSEND_REGISTRATION_NUMBER_SUBSET', 'RCSEND_DATE_OF_REGISTRATION',
'RCSEND_SUMMARY', 'RCSEND_SIGN_OF_COLLECTIVITY', 'RCSEND_ACCESS_NECK', 'RCSEND_HEADINGS', 'RCSEND_ACCOMPANYING_DOCUMENTS',
'RCSEND_NOTE_TO_THE_RK', 'RCSEND_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE', 'RCSEND_DOCUMENT_AUTHOR', 'RCSEND_VISAS',
'RCSEND_ADDRESSES', 'RCSEND_DOCUMENT_PERFORMER', 'RCSEND_ORDERS', 'RCSEND_ADDITIONAL_DETAILS', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE', 'RCSEND_VISAS_ORGANIZATION', 'RCSEND_VISAS_ORGANIZATION_FULL_TITLE',
'RCSEND_VISAS_ORGANIZATION_ABBREVIATION', 'RCSEND_VISAS_ORGANIZATION_OGRN_CODE', 'RCSEND_VISAS_ORGANIZATION_INN',
'RCSEND_VISAS_ORGANIZATION_ADDRESS', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION',
'RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET', 'RCSEND_VISAS_ORGANIZATION_EMAIL',
'RCSEND_VISAS_ORGANIZATION_EXECUTIVE', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION',
'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING', 'RCSEND_ADDRESSES_ORGANIZATION', 'RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE',
'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION', 'RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE', 'RCSEND_ADDRESSES_ORGANIZATION_INN',
'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET', 'RCSEND_ADDRESSES_ORGANIZATION_EMAIL',
'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED', 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION', 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION',
'RCSEND_ADDRESSES_CITIZEN', 'RCSEND_ADDRESSES_CITIZEN_FULL_NAME', 'RCSEND_ADDRESSES_CITIZEN_INN_SNILS',
'RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY',
'RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET',
'RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION', 'RCSEND_ORDERS_SYSTEM_NUMBER', 'RCSEND_ORDERS_POINT_RESOLUTION',
'RCSEND_ORDERS_ORDER_TEXT', 'RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE', 'RCSEND_ORDERS_RESOLUTION_CREATION_DATE',
'RCSEND_ORDERS_ITEM_NUMBER', 'RCSEND_ORDERS_PRIVACY_FEATURE', 'RCSEND_ORDERS_RESOLUTION_AUTHOR',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING', 'RCSEND_EXECUTOR', 'RCSEND_EXECUTOR_ORGANIZATION',
'RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE', 'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION', 'RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE',
'RCSEND_EXECUTOR_ORGANIZATION_INN', 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS', 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY',
'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION', 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE',
'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET', 'RCSEND_EXECUTOR_ORGANIZATION_EMAIL', 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED',
'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME', 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION', 'RCSEND_OREDER_FILES'];
 ttttt = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'];*/
// ttttt = 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION';
    objectDataRcsend = {
        RCSEND_GROUP_OF_DOCUMENTS: 12,
        RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT: 13,
        RCSEND_SUMMARY: 14,
        RCSEND_SIGN_OF_COLLECTIVITY: 15,
        RCSEND_REGISTRATION_NUMBER: 16,
        RCSEND_REGISTRATION_NUMBER_SUBSET: 17,
        RCSEND_DATE_OF_REGISTRATION: 18,
        RCSEND_ACCESS_NECK: 19,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS: 28,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY: 29,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION: 30,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE: 31,
        RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET: 32
    };
    arrayOfIndexesRcsend = [];
    oldStringRcsend;
    accordionListForEmail: IParamAccordionList[] = USER_PARAMS_LIST_REGISTRATION_EMAIL_NAV;
    pageId: 'send-options' | 'registration-options';
    newDataAttach;
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
                this.prepDataAttach.rec['RCSEND_HIDE_OPERATION_SEND_EMAIL'] = data[key].charAt(0) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ENCRYPTION'] = data[key].charAt(1) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ELECTRONIC_SIGNATURE'] = data[key].charAt(2) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_COMPRESS_ATTACHED_FILES'] = data[key].charAt(3) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_CONSIDER_THE_TYPE_OF_DISPATCH'] = data[key].charAt(4) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_REPORT_THE_DELIVERY_OF_THIS_MESSAGE'] = data[key].charAt(5) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT'] = data[key].charAt(6) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO'] = data[key].charAt(7) === '0' &&
                data[key].charAt(8) === '1' ? '1' : data[key].charAt(7) === '1' && data[key].charAt(8) === '0' ? '0' : null;
                this.prepDataAttach.rec['RCSEND_RESOLUTIONS'] = data[key].charAt(9) === '1' ?
                this.prepInputsAttach.rec['RCSEND_RESOLUTIONS_RADIO'].readonly = false && '1' :
                this.prepInputsAttach.rec['RCSEND_RESOLUTIONS_RADIO'].readonly = true && '0';
                this.prepDataAttach.rec['RCSEND_RESOLUTIONS_RADIO'] = data[key].charAt(10) === '0' &&
                data[key].charAt(11) === '1' ? '1' : data[key].charAt(10) === '1' && data[key].charAt(11) === '0' ? '0' : null;
                this.prepDataAttach.rec['RCSEND_ADDRESSEES'] = data[key].charAt(168) === '1' ?
                this.prepInputsAttach.rec['RCSEND_ADDRESSEES_RADIO'].readonly = false && '1' :
                this.prepInputsAttach.rec['RCSEND_ADDRESSEES_RADIO'].readonly = true && '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSEES_RADIO'] = data[key].charAt(169) === '0' &&
                data[key].charAt(170) === '1' ? '1' : data[key].charAt(169) === '1' && data[key].charAt(170) === '0' ? '0' : null;
                this.prepDataAttach.rec['RCSEND_GROUP_OF_DOCUMENTS'] = data[key].charAt(12) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT'] = data[key].charAt(13) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_SUMMARY'] = data[key].charAt(14) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_SIGN_OF_COLLECTIVITY'] = data[key].charAt(15) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_REGISTRATION_NUMBER'] = data[key].charAt(16) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_REGISTRATION_NUMBER_SUBSET'] = data[key].charAt(17) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DATE_OF_REGISTRATION'] = data[key].charAt(18) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ACCESS_NECK'] = data[key].charAt(19) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_HEADINGS'] = data[key].charAt(162) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ACCOMPANYING_DOCUMENTS'] = data[key].charAt(166) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_NOTE_TO_THE_RK'] = data[key].charAt(163) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE'] = data[key].charAt(164) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = data[key].charAt(22) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS'] = data[key].charAt(53) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = data[key].charAt(71) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = data[key].charAt(98) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = data[key].charAt(115) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDITIONAL_DETAILS'] = data[key].charAt(165) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = data[key].charAt(23) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE'] = data[key].charAt(24) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION'] = data[key].charAt(25) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE'] = data[key].charAt(26) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN'] = data[key].charAt(27) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'] = data[key].charAt(28) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY'] = data[key].charAt(29) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION'] = data[key].charAt(30) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE'] = data[key].charAt(31) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET'] = data[key].charAt(32) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL'] = data[key].charAt(33) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'] = data[key].charAt(34) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME'] = data[key].charAt(35) === '1' ? '1' : '0';
   this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION'] = data[key].charAt(37) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION'] = data[key].charAt(38) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING'] = data[key].charAt(39) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'] = data[key].charAt(40) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER'] =
                data[key].charAt(41) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION'] =
                data[key].charAt(42) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = data[key].charAt(43) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME'] = data[key].charAt(44) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS'] = data[key].charAt(45) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS'] = data[key].charAt(46) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = data[key].charAt(47) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY'] = data[key].charAt(48) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION'] = data[key].charAt(49) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE'] = data[key].charAt(50) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET'] = data[key].charAt(51) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE'] = data[key].charAt(52) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = data[key].charAt(54) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_FULL_TITLE'] = data[key].charAt(55) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ABBREVIATION'] = data[key].charAt(56) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_OGRN_CODE'] = data[key].charAt(57) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_INN'] = data[key].charAt(58) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = data[key].charAt(59) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY'] = data[key].charAt(60) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION'] = data[key].charAt(61) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE'] = data[key].charAt(62) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET'] = data[key].charAt(63) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EMAIL'] = data[key].charAt(64) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = data[key].charAt(65) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME'] = data[key].charAt(66) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION'] = data[key].charAt(68) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION'] = data[key].charAt(69) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING'] = data[key].charAt(70) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = data[key].charAt(72) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE'] = data[key].charAt(73) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION'] = data[key].charAt(74) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE'] = data[key].charAt(75) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_INN'] = data[key].charAt(76) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'] = data[key].charAt(77) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY'] = data[key].charAt(78) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION'] = data[key].charAt(79) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE'] = data[key].charAt(80) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET'] = data[key].charAt(81) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_EMAIL'] = data[key].charAt(82) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'] = data[key].charAt(83) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME'] = data[key].charAt(84) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION'] = data[key].charAt(86) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION'] = data[key].charAt(87) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = data[key].charAt(88) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_FULL_NAME'] = data[key].charAt(89) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_INN_SNILS'] = data[key].charAt(90) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS'] = data[key].charAt(91) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = data[key].charAt(92) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY'] = data[key].charAt(93) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION'] = data[key].charAt(94) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE'] = data[key].charAt(95) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET'] = data[key].charAt(96) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE'] = data[key].charAt(97) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = data[key].charAt(99) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE'] = data[key].charAt(100) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION'] = data[key].charAt(101) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE'] = data[key].charAt(102) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN'] = data[key].charAt(103) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = data[key].charAt(104) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY'] = data[key].charAt(105) === '1' ? '1' : '0';
            this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION'] = data[key].charAt(106) === '1' ? '1' : '0';
            this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE'] = data[key].charAt(107) === '1' ? '1' : '0';
            this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET'] = data[key].charAt(108) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL'] = data[key].charAt(109) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] = data[key].charAt(110) === '1' ? '1' : '0';
this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME'] =
 data[key].charAt(111) === '1' ? '1' : '0';
this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION'] =
 data[key].charAt(113) === '1' ? '1' : '0';
this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION'] =
 data[key].charAt(114) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_SYSTEM_NUMBER'] = data[key].charAt(116) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_POINT_RESOLUTION'] = data[key].charAt(117) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_ORDER_TEXT'] = data[key].charAt(118) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE'] = data[key].charAt(119) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_CREATION_DATE'] = data[key].charAt(120) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_ITEM_NUMBER'] = data[key].charAt(121) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_PRIVACY_FEATURE'] = data[key].charAt(122) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = data[key].charAt(123) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = data[key].charAt(124) === '1' ? '1' : '0';
            this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE'] = data[key].charAt(125) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION'] = data[key].charAt(126) === '1' ? '1' : '0';
            this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE'] = data[key].charAt(127) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN'] = data[key].charAt(128) === '1' ? '1' : '0';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'] = data[key].charAt(129) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY'] = data[key].charAt(130) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION'] = data[key].charAt(131) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE'] = data[key].charAt(132) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET'] = data[key].charAt(133) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL'] = data[key].charAt(134) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'] = data[key].charAt(135) === '1' ? '1' : '0';
this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME'] =
 data[key].charAt(136) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION'] =
         data[key].charAt(139) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION'] = data[key].charAt(140) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING']
     = data[key].charAt(139) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_EXECUTOR'] = data[key].charAt(140) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = data[key].charAt(141) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE'] = data[key].charAt(142) === '1' ? '1' : '0';
    this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION'] = data[key].charAt(143) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE'] = data[key].charAt(144) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_INN'] = data[key].charAt(145) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'] = data[key].charAt(146) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY'] = data[key].charAt(147) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION'] = data[key].charAt(148) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE'] = data[key].charAt(149) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET'] = data[key].charAt(150) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_EMAIL'] = data[key].charAt(151) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'] = data[key].charAt(152) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME'] = data[key].charAt(153) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION'] = data[key].charAt(154) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION'] = data[key].charAt(155) === '1' ? '1' : '0';
        this.prepDataAttach.rec['RCSEND_OREDER_FILES'] = data[key].charAt(167) === '1' ? '1' : '0';
            }
        }
    }
    getInputAttach() {
        const dataInput = {rec: {}};
       // const valueForDisabled = true;
        console.log(this.prepDataAttach);
        Object.keys(this.prepDataAttach.rec).forEach(key => {
            console.log(dataInput.rec[key]);
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
    toggleAllMarksThisCheckbox(event, keyName) {
        const arrayKeysSubsetsForAuthorOrganization = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForAuthorOrganizationAddress = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForAuthorOrganizationHasSigned = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING'];
        const arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
        'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION'];
        const arrayKeysSubsetsForAuthorCitizen = ['RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE'];
        const arrayKeysSubsetsForAuthorCitizenAddres = ['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
        'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET'];
        const arrayKeysSubsetsForVisas = ['RCSEND_VISAS_ORGANIZATION_FULL_TITLE', 'RCSEND_VISAS_ORGANIZATION_ABBREVIATION',
        'RCSEND_VISAS_ORGANIZATION_OGRN_CODE', 'RCSEND_VISAS_ORGANIZATION_INN', 'RCSEND_VISAS_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForVisasAddress = ['RCSEND_VISAS_ORGANIZATION_ADDRESS', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY',
        'RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE',
        'RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForVisasExecutive = ['RCSEND_VISAS_ORGANIZATION_EXECUTIVE', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
        'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION',
        'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING'];
        const arrayKeysSubsetsForAddressesOrganization = ['RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE',
        'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION', 'RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE',
        'RCSEND_ADDRESSES_ORGANIZATION_INN', 'RCSEND_ADDRESSES_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForAddressesOrganizationAddress = ['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS',
        'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed = ['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED',
        'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
        'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION',
        'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION'];
        const arrayKeysSubsetsForAddressesCitizen = ['RCSEND_ADDRESSES_CITIZEN', 'RCSEND_ADDRESSES_CITIZEN_FULL_NAME',
        'RCSEND_ADDRESSES_CITIZEN_INN_SNILS', 'RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS', 'RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE'];
        const arrayKeysSubsetsForAddressesCitizenAddress = ['RCSEND_ADDRESSES_CITIZEN_ADDRESS', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY',
        'RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET'];
        const arrayKeysSubsetsForPerformerOrganization = ['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForPerformerOrganizationAddress = ['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForPerformerOrganizationExecutive = ['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
        'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION'];
        const arrayKeysSubsetsForResolution = ['RCSEND_ORDERS_SYSTEM_NUMBER', 'RCSEND_ORDERS_POINT_RESOLUTION',
        'RCSEND_ORDERS_ORDER_TEXT', 'RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE', 'RCSEND_ORDERS_RESOLUTION_CREATION_DATE',
        'RCSEND_ORDERS_ITEM_NUMBER', 'RCSEND_ORDERS_PRIVACY_FEATURE'];
        const arrayKeysSubsetsForResolutionAuthorOrganization = ['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForResolutionAuthorOrganizationAddress = ['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForResolutionAuthorOrganizationExecutive = [
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
        'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING'];
        const arrayKeysSubsetsForResolutionExecutorOrganization = ['RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE',
        'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION', 'RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE',
        'RCSEND_EXECUTOR_ORGANIZATION_INN', 'RCSEND_EXECUTOR_ORGANIZATION_EMAIL'];
        const arrayKeysSubsetsForResolutionExecutorOrganizationAddres = ['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS',
        'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION',
        'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET'];
        const arrayKeysSubsetsForResolutionExecutorOrganizationExecutive = ['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED',
        'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME', 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
        'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION'];
        console.log(keyName);
        if (event.target.checked) {
            this.prepDataAttach.rec[keyName] = '1';
            this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyName]);
            // --------------------------Автор документа------------------------------------------------------------
            // Автор документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION') {
                arrayKeysSubsetsForAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
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
            console.log(this.arrayOfIndexesRcsend);
            // Автор документа -> Организация -> Подписал
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAuthorOrganizationHasSigned.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Автор документа -> Организация -> Номер автора документа
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Автор документа -> Гражданин
            if (arrayKeysSubsetsForAuthorCitizen.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
            } else if (arrayKeysSubsetsForAuthorCitizenAddres.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
            }
            // Автор документа -> Гражданин -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = '1';
                arrayKeysSubsetsForAuthorCitizenAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
             }
             if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '1';
                arrayKeysSubsetsForAuthorCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            if (arrayKeysSubsetsForAuthorOrganization.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
            } else if (arrayKeysSubsetsForAuthorOrganizationAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
            } else if (arrayKeysSubsetsForAuthorOrganizationHasSigned.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
            } else if (arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR'] = '1'; // !
            }
            // --------------------------Визы------------------------------------------------------------
            // Визы -> Организация
            if (keyName === 'RCSEND_VISAS' || keyName === 'RCSEND_VISAS_ORGANIZATION') {
                arrayKeysSubsetsForVisas.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Визы -> Организация -> Адрес
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = '1';
                arrayKeysSubsetsForVisasAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Визы -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = '1';
                arrayKeysSubsetsForVisasExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            if (arrayKeysSubsetsForVisas.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS'] = '1'; // !
            } else if (arrayKeysSubsetsForVisasAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS'] = '1'; // !
            } else if (arrayKeysSubsetsForVisasExecutive.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_VISAS'] = '1'; // !
            }
            // --------------------------Адресаты------------------------------------------------------------
            // Адресаты -> Организация
            if (keyName === 'RCSEND_ADDRESSES' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION') {
                arrayKeysSubsetsForAddressesOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Адресаты -> Организация -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' ||
            keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'] = '1';
                arrayKeysSubsetsForAddressesOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Адресаты -> Организация -> Кому адресован
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'
            || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Адресаты -> Гражданин
            if (arrayKeysSubsetsForAddressesCitizen.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
            } else if (arrayKeysSubsetsForAddressesCitizenAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
            }
            // Адресаты -> Гражданин -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '1';
                arrayKeysSubsetsForAddressesCitizenAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
             }
             if (keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '1';
                arrayKeysSubsetsForAddressesCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
             if (arrayKeysSubsetsForAddressesOrganization.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
            } else if (arrayKeysSubsetsForAddressesOrganizationAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
            } else if (arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
            } else if (arrayKeysSubsetsForAddressesCitizenAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ADDRESSES'] = '1'; // !
            }
            // --------------------------Исполнитель документа------------------------------------------------------------
            // Исполнитель документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION') {
                arrayKeysSubsetsForPerformerOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }
            // Исполнитель документа -> Организация -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = '1';
                arrayKeysSubsetsForPerformerOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
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
                });
            }
            if (arrayKeysSubsetsForPerformerOrganization.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = '1'; // !
            } else if (arrayKeysSubsetsForPerformerOrganizationAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = '1'; // !
            } else if (arrayKeysSubsetsForPerformerOrganizationExecutive.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER'] = '1'; // !
            }
            // --------------------------Поручения------------------------------------------------------------
            // Поручения
            if (keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                arrayKeysSubsetsForResolution.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            // Поручения -> Автор резолюции -> Организация
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForResolutionAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            // Поручения -> Исполнитель -> Организация
            if (keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                arrayKeysSubsetsForResolutionExecutorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Адрес
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' ||
            keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' ||
            keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            // Поручения -> Исполнитель -> Организация -> Адрес
            if (keyName === 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            // Поручения -> Исполнитель -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '1';
                });
            }

            if (arrayKeysSubsetsForResolution.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            } else if (arrayKeysSubsetsForResolutionAuthorOrganization.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            } else if (arrayKeysSubsetsForResolutionExecutorOrganization.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            } else if (arrayKeysSubsetsForResolutionAuthorOrganizationAddress.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            } else if (arrayKeysSubsetsForResolutionAuthorOrganizationExecutive.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            } else if (arrayKeysSubsetsForResolutionExecutorOrganizationAddres.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            } else if (arrayKeysSubsetsForResolutionExecutorOrganizationExecutive.some(elem => elem === keyName)) {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '1';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '1';
                this.prepDataAttach.rec['RCSEND_ORDERS'] = '1'; // !
            }
        } else {
            this.prepDataAttach.rec[keyName] = '0';
            this.arrayOfIndexesRcsend.push(this.objectDataRcsend[keyName]);
            // --------------------------Автор документа------------------------------------------------------------
            // Автор документа
            // Автор документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR' || keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION') {
                arrayKeysSubsetsForAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
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
                });
            }
            // Автор документа -> Организация -> Номер автора документа
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                arrayKeysSubsetsForAuthorOrganizationDocumentAuthotNumber.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Автор документа -> Гражданин
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN'] = '0';
                arrayKeysSubsetsForAuthorCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Автор документа -> Гражданин -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_DOCUMENT_AUTHOR_CITIZEN' || keyName === 'RCSEND_DOCUMENT_AUTHOR') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS'] = '0';
                arrayKeysSubsetsForAuthorCitizenAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
             }
             // --------------------------Визы------------------------------------------------------------
             // Визы -> Организация
            if (keyName === 'RCSEND_VISAS' || keyName === 'RCSEND_VISAS_ORGANIZATION') {
                arrayKeysSubsetsForVisas.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Визы -> Организация -> Адрес
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_ADDRESS'] = '0';
                arrayKeysSubsetsForVisasAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Визы -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE' || keyName === 'RCSEND_VISAS_ORGANIZATION' ||
            keyName === 'RCSEND_VISAS') {
                this.prepDataAttach.rec['RCSEND_VISAS_ORGANIZATION_EXECUTIVE'] = '0';
                arrayKeysSubsetsForVisasExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // --------------------------Адресаты------------------------------------------------------------
             // Адресаты -> Организация
             if (keyName === 'RCSEND_ADDRESSES' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_ORGANIZATION'] = '0';
                arrayKeysSubsetsForAddressesOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Адресаты -> Организация -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' ||
            keyName === 'RCSEND_ADDRESSES') {
                arrayKeysSubsetsForAddressesOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Адресаты -> Организация -> Кому адресован
            if (keyName === 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED' || keyName === 'RCSEND_ADDRESSES_ORGANIZATION' ||
            keyName === 'RCSEND_ADDRESSES') {
                arrayKeysSubsetsForAddressesOrganizationToWhomeIsItAddressed.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Адресаты -> Гражданин
            if (keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN'] = '0';
                arrayKeysSubsetsForAddressesCitizen.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Автор документа -> Гражданин -> Адрес
            if (keyName === 'RCSEND_ADDRESSES_CITIZEN_ADDRESS' ||
             keyName === 'RCSEND_ADDRESSES_CITIZEN' || keyName === 'RCSEND_ADDRESSES') {
                this.prepDataAttach.rec['RCSEND_ADDRESSES_CITIZEN_ADDRESS'] = '0';
                arrayKeysSubsetsForAddressesCitizenAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
             }
             // --------------------------Исполнитель документа------------------------------------------------------------
             // Исполнитель документа -> Организация
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION'] = '0';
                arrayKeysSubsetsForPerformerOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
             // Исполнитель документа -> Организация -> Адрес
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS' || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS'] = '0';
                arrayKeysSubsetsForPerformerOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // Исполнитель документа -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION' ||
            keyName === 'RCSEND_DOCUMENT_PERFORMER') {
                this.prepDataAttach.rec['RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED'] = '0';
                arrayKeysSubsetsForPerformerOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
            // --------------------------Поручения------------------------------------------------------------
            // Поручения
            if (keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR'] = '0';
                this.prepDataAttach.rec['RCSEND_EXECUTOR'] = '0';
                arrayKeysSubsetsForResolution.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }

            // Поручения -> Автор резолюции -> Организация
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' ||
            keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION'] = '0';
                arrayKeysSubsetsForResolutionAuthorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }

            // Поручения -> Исполнитель -> Организация
            if (keyName === 'RCSEND_EXECUTOR' || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' ||  keyName === 'RCSEND_ORDERS') {
                this.prepDataAttach.rec['RCSEND_EXECUTOR_ORGANIZATION'] = '0';
                arrayKeysSubsetsForResolutionExecutorOrganization.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Адрес
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR'
            ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationAddress.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }

            // Поручения -> Автор резолюции -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION' || keyName === 'RCSEND_ORDERS_RESOLUTION_AUTHOR'
            ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionAuthorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }

            // Поручения -> Исполнитель -> Организация -> Адрес
            if (keyName === 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationAddres.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }

            // Поручения -> Исполнитель -> Организация -> Должностное лицо
            if (keyName === 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED'
            || keyName === 'RCSEND_EXECUTOR_ORGANIZATION' || keyName === 'RCSEND_EXECUTOR' ||  keyName === 'RCSEND_ORDERS') {
                arrayKeysSubsetsForResolutionExecutorOrganizationExecutive.forEach(elem => {
                    this.prepDataAttach.rec[elem] = '0';
                });
            }
    }
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
            console.log(this.newData);
            console.log(this.newDataAttach);
            console.log(this.prepareData);
            this.formChanged.emit(false);
            this.isChangeForm = false;
            this._userParamsSetSrv.getUserIsn();
            if (this.newData && this.newDataAttach) {
                this.userParamApiSrv
                .setData(this.createObjRequestForAll())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newData) {
            this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                  //  this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else if (this.newDataAttach) {
                this.userParamApiSrv
                .setData(this.createObjRequestForAttach())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
                } else if (this.prepareData) {
                    this.userParamApiSrv
                    .setData(this.createObjRequestForDefaultValues())
                    .then(data => {
                        this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    })
                    // tslint:disable-next-line:no-console
                    .catch(data => console.log(data));
                }
            }
        }
        createObjRequestForAttach(): any[] {
            let replacementItem, newValueStringForRcsend;
            let valueDefSearchCitizen = '';
            const arrayOfKeysInTheCorrectOrder = ['DEF_SEARCH_CITIZEN_SURNAME_RADIO', 'DEF_SEARCH_CITIZEN_CITY_RADIO',
        'DEF_SEARCH_CITIZEN_INDEX_RADIO', 'DEF_SEARCH_CITIZEN_ADDRESS_RADIO', 'DEF_SEARCH_CITIZEN_REGION_RADIO',
    'DEF_SEARCH_CITIZEN_SURNAME', 'DEF_SEARCH_CITIZEN_CITY', 'DEF_SEARCH_CITIZEN_INDEX', 'DEF_SEARCH_CITIZEN_ADDRESS',
'DEF_SEARCH_CITIZEN_REGION', 'DEF_SEARCH_CITIZEN_OTHER_RADIO', 'DEF_SEARCH_CITIZEN_OTHER'];
/*fieldsKeysForSearchCitizensInTheDirectoryByFields: string[] = ['DEF_SEARCH_CITIZEN_SURNAME',
'DEF_SEARCH_CITIZEN_SURNAME_RADIO', 'DEF_SEARCH_CITIZEN_CITY', 'DEF_SEARCH_CITIZEN_CITY_RADIO',
'DEF_SEARCH_CITIZEN_INDEX', 'DEF_SEARCH_CITIZEN_INDEX_RADIO', 'DEF_SEARCH_CITIZEN_ADDRESS',
'DEF_SEARCH_CITIZEN_ADDRESS_RADIO', 'DEF_SEARCH_CITIZEN_REGION', 'DEF_SEARCH_CITIZEN_REGION_RADIO',
'DEF_SEARCH_CITIZEN_OTHER', 'DEF_SEARCH_CITIZEN_OTHER_RADIO'];*/
/*const arrayOfKeysInTheCorrectOrderForRcsend = ['RCSEND_HIDE_OPERATION_SEND_EMAIL', 'RCSEND_ENCRYPTION',
        'RCSEND_ELECTRONIC_SIGNATURE', 'RCSEND_COMPRESS_ATTACHED_FILES', 'RCSEND_CONSIDER_THE_TYPE_OF_DISPATCH',
    'RCSEND_REPORT_THE_DELIVERY_OF_THIS_MESSAGE', 'RCSEND_REQUIRES_REGISTRATION_NOTICE_OR_OPT_OUT',
    'RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND', 'RCSEND_RESOLUTIONS', 'RCSEND_RESOLUTIONS_RADIO', 'RCSEND_ADDRESSEES',
    'RCSEND_ADDRESSEES_RADIO', 'RCSEND_GROUP_OF_DOCUMENTS', 'RCSEND_THE_COMPOSITION_OF_THE_DOCUMENT',
    'RCSEND_REGISTRATION_NUMBER', 'RCSEND_REGISTRATION_NUMBER_SUBSET', 'RCSEND_DATE_OF_REGISTRATION',
'RCSEND_SUMMARY', 'RCSEND_SIGN_OF_COLLECTIVITY', 'RCSEND_ACCESS_NECK', 'RCSEND_HEADINGS', 'RCSEND_ACCOMPANYING_DOCUMENTS',
'RCSEND_NOTE_TO_THE_RK', 'RCSEND_NOTE_TO_THE_ADDRESSEE_OF_THE_MESSAGE', 'RCSEND_DOCUMENT_AUTHOR', 'RCSEND_VISAS',
'RCSEND_ADDRESSES', 'RCSEND_DOCUMENT_PERFORMER', 'RCSEND_ORDERS', 'RCSEND_ADDITIONAL_DETAILS', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_FULL_TITLE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ABBREVIATION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_OGRN_CODE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_INN', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_REGION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_ADDRESS_STREET',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_EMAIL', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_FULL_NAME', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_SUBDIVISION',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_POSITION', 'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_HAS_SIGNED_DATE_OF_SIGNING',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_REGISTRATION_NUMBER',
'RCSEND_DOCUMENT_AUTHOR_ORGANIZATION_DOCUMENT_AUTHOR_NUMBER_DATE_OF_REGISTRATION', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_FULL_NAME', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_INN_SNILS',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_PASSPORT_DETAILS', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_CITY', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_REGION',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN_ADDRESS_STREET',
'RCSEND_DOCUMENT_AUTHOR_CITIZEN_EMAIL_PHONE', 'RCSEND_VISAS_ORGANIZATION', 'RCSEND_VISAS_ORGANIZATION_FULL_TITLE',
'RCSEND_VISAS_ORGANIZATION_ABBREVIATION', 'RCSEND_VISAS_ORGANIZATION_OGRN_CODE', 'RCSEND_VISAS_ORGANIZATION_INN',
'RCSEND_VISAS_ORGANIZATION_ADDRESS', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_CITY', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_REGION',
'RCSEND_VISAS_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_VISAS_ORGANIZATION_ADDRESS_STREET', 'RCSEND_VISAS_ORGANIZATION_EMAIL',
'RCSEND_VISAS_ORGANIZATION_EXECUTIVE', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_FULL_NAME',
'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_SUBDIVISION', 'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_POSITION',
'RCSEND_VISAS_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING', 'RCSEND_ADDRESSES_ORGANIZATION', 'RCSEND_ADDRESSES_ORGANIZATION_FULL_TITLE',
'RCSEND_ADDRESSES_ORGANIZATION_ABBREVIATION', 'RCSEND_ADDRESSES_ORGANIZATION_OGRN_CODE', 'RCSEND_ADDRESSES_ORGANIZATION_INN',
'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_REGION',
'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_ORGANIZATION_ADDRESS_STREET', 'RCSEND_ADDRESSES_ORGANIZATION_EMAIL',
'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED', 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_FULL_NAME',
'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_SUBDIVISION', 'RCSEND_ADDRESSES_ORGANIZATION_TO_WHOM_IS_IT_ADDRESSED_POSITION',
'RCSEND_ADDRESSES_CITIZEN', 'RCSEND_ADDRESSES_CITIZEN_FULL_NAME', 'RCSEND_ADDRESSES_CITIZEN_INN_SNILS',
'RCSEND_ADDRESSES_CITIZEN_PASSPORT_DETAILS', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_CITY',
'RCSEND_ADDRESSES_CITIZEN_ADDRESS_REGION', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_POSTCODE', 'RCSEND_ADDRESSES_CITIZEN_ADDRESS_STREET',
'RCSEND_ADDRESSES_CITIZEN_EMAIL_PHONE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_FULL_TITLE',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ABBREVIATION', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_OGRN_CODE',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_INN', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_CITY', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_REGION',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_ADDRESS_STREET',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EMAIL', 'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
'RCSEND_DOCUMENT_PERFORMER_ORGANIZATION_EXECUTIVE_ADDRESSED_POSITION', 'RCSEND_ORDERS_SYSTEM_NUMBER', 'RCSEND_ORDERS_POINT_RESOLUTION',
'RCSEND_ORDERS_ORDER_TEXT', 'RCSEND_ORDERS_PLANNED_DATE_OF_PERFORMANCE', 'RCSEND_ORDERS_RESOLUTION_CREATION_DATE',
'RCSEND_ORDERS_ITEM_NUMBER', 'RCSEND_ORDERS_PRIVACY_FEATURE', 'RCSEND_ORDERS_RESOLUTION_AUTHOR',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_FULL_TITLE',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ABBREVIATION', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_OGRN_CODE',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_INN', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_CITY', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_REGION',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_POSTCODE', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_ADDRESS_STREET',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EMAIL', 'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_FULL_NAME',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_POSITION',
'RCSEND_ORDERS_RESOLUTION_AUTHOR_ORGANIZATION_EXECUTIVE_DATE_OF_SIGNING', 'RCSEND_EXECUTOR', 'RCSEND_EXECUTOR_ORGANIZATION',
'RCSEND_EXECUTOR_ORGANIZATION_FULL_TITLE', 'RCSEND_EXECUTOR_ORGANIZATION_ABBREVIATION', 'RCSEND_EXECUTOR_ORGANIZATION_OGRN_CODE',
'RCSEND_EXECUTOR_ORGANIZATION_INN', 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS', 'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_CITY',
'RCSEND_ORDERS_EXECUTOR_ORGANIZATION_ADDRESS_REGION', 'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_POSTCODE',
'RCSEND_EXECUTOR_ORGANIZATION_ADDRESS_STREET', 'RCSEND_EXECUTOR_ORGANIZATION_EMAIL', 'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED',
'RCSEND_EXECUTOR_EXECUTIVE_ADDRESSED_FULL_NAME', 'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_ADDRESSED_SUBDIVISION',
'RCSEND_EXECUTOR_ORGANIZATION_EXECUTIVE_POSITION', 'RCSEND_OREDER_FILES'];*/
 // ttttt = ['RCSEND_DOCUMENT_AUTHOR_ORGANIZATION', 'RCSEND_DOCUMENT_AUTHOR_CITIZEN'];*/
            const req = [];
            const keyForSearchCitizensInTheDirectoryByFields = ['DEF_SEARCH_CITIZEN', 'RCSEND'];
            const userId = this._userParamsSetSrv.userContextId;
            // tslint:disable-next-line:forin
            for (let key = 0; key < keyForSearchCitizensInTheDirectoryByFields.length; key++) {
              /*  const arrayKeys = keyForSearchCitizensInTheDirectoryByFields[key] === 'DEF_SEARCH_CITIZEN'
                 ? arrayOfKeysInTheCorrectOrder : arrayOfKeysInTheCorrectOrderForRcsend;*/
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
                valueDefSearchCitizen = newValueStringForRcsend;
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
        createObjRequestForAll() {
            const req = this.createObjRequest();
            const reqAttach = this.createObjRequestForAttach();
            const newReq = req.concat(reqAttach[0]);
            return newReq;
        }
        default() {
            const changed = true;
            this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(this.prepInputs._list);
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
        private openAccordion() {
            this.accordionListForEmail.forEach((item: IParamAccordionList) => {
                if (item.url === this.pageId) {
                    item.isOpen = true;
                }
            });
        }
   /* checkDataToDisabled(keyField, value) {
        if (this.formAttach.controls['rec.' + keyField].value === value) {
            this.disabledField = true;
            this.constUserParam.disabledFields.forEach(key => {
                this.formAttach.controls['rec.' + key].disable();
            });
        } else {
            this.disabledField = false;
            this.constUserParam.disabledFields.forEach(key => {
                this.formAttach.controls['rec.' + key].enable();
            });
        }
    }*/
}
