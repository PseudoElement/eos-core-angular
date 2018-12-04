import { Component, OnInit, Output, ViewChild, EventEmitter, TemplateRef } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { InputControlService } from 'eos-common/services/input-control.service';
import { Subscription } from 'rxjs/Rx';
import { EosUtils } from 'eos-common/core/utils';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
// import { RightsDeloAbsoluteRightsComponent } from '../rights-delo-absolute-rights.component';
// import { BaseRightsDeloSrv } from '../../shared-rights-delo/services/base-rights-delo.service';
// import { CollectionService, ICollectionList } from './collection.service';
// import { BsModalService, BsModalRef } from 'ngx-bootstrap';
// import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';

@Component({
    selector: 'eos-absolute-rights-directory-modal',
    templateUrl: 'absolute-rights-directory-modal.component.html'
})

// @Injectable()
export class AbsoluteRightsDirectoryComponent implements OnInit {
   // @Output() closeCollection = new EventEmitter();
    @Output() formChanged = new EventEmitter();
    @Output() formInvalid = new EventEmitter();
    @ViewChild('modalWord') modalWord: TemplateRef<any>;
    isLoading = false;
    isChangeForm = false;
    _userParamsSetSrv: UserParamsService;
    inputCtrlSrv: InputControlService;
    subscriptions: Subscription[] = [];
    dataSrv: EosDataConvertService;
    userId = '3611'; // '' + this._userParamsSetSrv.userContextId;
    fieldChildAbsoluteRightsDirectory = [];
    _currentFormStatus;
    arrayCheckboxforAbsoluteRightsDirectory = [
        ['TECH_RIGHTS_USERS', 'Пользователи', false],
        ['TECH_RIGHTS_CURRENT_ORGANIZATION', 'Текущая организация', false],
        ['TECH_RIGHTS_LIST_OF_ORGANIZATIONS', 'Список организаций', false],
        ['TECH_RIGHTS_TYPES_OF_ORGANIZATIONS', 'Типы организаций', false],
        ['TECH_RIGHTS_REGIONS', 'Регионы', false],
        ['TECH_RIGHTS_CATEGORIES_OF_RECIPIENTS', 'Категории адресатов', false],
        ['TECH_RIGHTS_KEEPING_A_CALENDAR', 'Ведение календаря', false],
        ['TECH_RIGHTS_RUBRICATOR', 'Рубрикатор', false],
        ['TECH_RIGHTS_DOCUMENT_GROUPS', 'Группы документов', false],
        ['TECH_RIGHTS_DIVISIONS', 'Подразделения', false],
        ['TECH_RIGHTS_TYPES_OF_DELIVERY', 'Виды доставки', false],
        ['TECH_RIGHTS_REGISTRY_TYPES', 'Типы реестров', false],
        ['TECH_RIGHTS_TYPES_OF_LIGAMENTS', 'Типы связок', false],
        ['TECH_RIGHTS_NOMENCLATURE_OF_AFFAIRS', 'Номенклатура дел', false],
        ['TECH_RIGHTS_ACCESS_VULTURES', 'Грифы доступа', false],
        ['TECH_RIGHTS_CITIZENS', 'Граждане', false],
        ['TECH_RIGHTS_APPLICANT_STATUS', 'Статус заявителя', false],
        ['TECH_RIGHTS_CABINETS', 'Кабинеты', false],
        ['TECH_RIGHTS_SETTING_DETAILS', 'Настройка реквизитов', false],
        ['TECH_RIGHTS_TEMPLATES', 'Шаблоны', false],
        ['TECH_RIGHTS_TYPES_OF_VISAS', 'Типы виз', false],
        ['TECH_RIGHTS_TYPES_OF_SIGNATURES', 'Виды подписей', false],
        ['TECH_RIGHTS_ORDER_CATEGORIES', 'Категории поручений', false],
        ['TECH_RIGHTS_SYSTEM_PARAMETERS', 'Параметры системы', false],
        ['TECH_RIGHTS_EXECUTION_STATUS_ORDER', 'Состояние исполнения (поручение)', false],
        ['TECH_RIGHTS_PERFORMANCE_STATUS_PERFORMER', 'Состояние исполнения (исполнитель)', false],
        ['TECH_RIGHTS_PRIORITIES_OF_DRAFT_RESOLUTIONS', 'Приоритеты проектов резолюций', false],
        ['TECH_RIGHTS_DOCUMENT_TRANSFER_PROCEDURE', 'Процедура передачи документов', false],
        ['TECH_RIGHTS_SETTING_THE_VIEWING_PROTOCOL', 'Настройка протокола просмотра', false],
        ['TECH_RIGHTS_STRIPPING_PROTOCOLS', 'Зачистка протоколов', false],
        ['TECH_RIGHTS_CONFIGURING_THE_NOTIFICATION_AND_NOTIFICATION_SUBSYSTEM', 'Настройка подсистемы оповещения и уведомления', false],
        ['TECH_RIGHTS_SET_UP_BATCH_MAIL', 'Настройка партионной почты', false],
        ['TECH_RIGHTS_SEV_DIRECTORIES', 'Справочники СЭВ', false],
        ['TECH_RIGHTS_EMAIL_BUFFER', 'Буфер электронных сообщений', false],
        ['TECH_RIGHTS_EP_CATEGORIES', 'Категории ЭП', false],
    ];
    objectDataAbsoluteRightsDirectory = {
        TECH_RIGHTS_USERS: 0,
        TECH_RIGHTS_CURRENT_ORGANIZATION: 1,
        TECH_RIGHTS_LIST_OF_ORGANIZATIONS: 2,
        TECH_RIGHTS_TYPES_OF_ORGANIZATIONS: 3,
        TECH_RIGHTS_REGIONS: 4,
        TECH_RIGHTS_CATEGORIES_OF_RECIPIENTS: 5,
        TECH_RIGHTS_KEEPING_A_CALENDAR: 6,
        TECH_RIGHTS_RUBRICATOR: 7,
        TECH_RIGHTS_DOCUMENT_GROUPS: 8,
        TECH_RIGHTS_DIVISIONS: 9,
        TECH_RIGHTS_TYPES_OF_DELIVERY: 10,
        TECH_RIGHTS_REGISTRY_TYPES: 11,
        TECH_RIGHTS_TYPES_OF_LIGAMENTS: 12,
        TECH_RIGHTS_NOMENCLATURE_OF_AFFAIRS: 13,
        TECH_RIGHTS_ACCESS_VULTURES: 14,
        TECH_RIGHTS_CITIZENS: 15,
        TECH_RIGHTS_APPLICANT_STATUS: 16,
        TECH_RIGHTS_CABINETS: 17,
        TECH_RIGHTS_SETTING_DETAILS: 18,
        TECH_RIGHTS_TEMPLATES: 19,
        TECH_RIGHTS_TYPES_OF_VISAS: 22,
        TECH_RIGHTS_TYPES_OF_SIGNATURES: 23,
        TECH_RIGHTS_ORDER_CATEGORIES: 24,
        TECH_RIGHTS_SYSTEM_PARAMETERS: 25,
        TECH_RIGHTS_EXECUTION_STATUS_ORDER: 26,
        TECH_RIGHTS_PERFORMANCE_STATUS_PERFORMER: 27,
        TECH_RIGHTS_PRIORITIES_OF_DRAFT_RESOLUTIONS: 35,
        TECH_RIGHTS_DOCUMENT_TRANSFER_PROCEDURE: 28,
        TECH_RIGHTS_SETTING_THE_VIEWING_PROTOCOL: 29,
        TECH_RIGHTS_STRIPPING_PROTOCOLS: 30,
        TECH_RIGHTS_CONFIGURING_THE_NOTIFICATION_AND_NOTIFICATION_SUBSYSTEM: 31,
        TECH_RIGHTS_SET_UP_BATCH_MAIL: 32,
        TECH_RIGHTS_SEV_DIRECTORIES: 33,
        TECH_RIGHTS_EMAIL_BUFFER: 34,
        TECH_RIGHTS_EP_CATEGORIES: 36
    };
    arrayValuesDeloRights = [];
    prepInputsAttach;
    inputAttach;
    formAttach;
    newDataAttach;
    prepDataAttach = {rec: {}};
    private servApi: UserParamApiSrv;
    private quaryDepartment = {
        USER_CL: {
            criteries: {
                ISN_LCLASSIF: this.userId
            }
        }
    };
   /* constructor( injector: Injector, ) {
        super(null, injector, null);
        for (let i = 0; i < this.arrayCheckboxforAbsoluteRights.length; i++) {
            this.fieldChildAbsoluteRights.push(
                {
                    key: this.arrayCheckboxforAbsoluteRights[i][0],
                    type: 'boolean',
                    title: this.arrayCheckboxforAbsoluteRights[i][1]
                }
            );
           // this.prepInputsAttach = this.getObjectInputFields(this.fieldChildAbsoluteRights);
           // this.afterInit();
        }
        this.prepInputsAttach = this.getObjectInputFields(this.fieldChildAbsoluteRights);
    }*/
    ngOnInit () {
        for (let i = 0; i < this.arrayCheckboxforAbsoluteRightsDirectory.length; i++) {
            this.fieldChildAbsoluteRightsDirectory.push(
                {
                    key: this.arrayCheckboxforAbsoluteRightsDirectory[i][0],
                    type: 'boolean',
                    title: this.arrayCheckboxforAbsoluteRightsDirectory[i][1]
                }
            );
           // this.prepInputsAttach = this.getObjectInputFields(this.fieldChildAbsoluteRights);
           // this.afterInit();
           this.isLoading = true;
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            this.arrayValuesDeloRights.push(data[0]['DELO_RIGHTS']);
            this.prepDataAttachField(this.arrayValuesDeloRights);
            this.isLoading = false;
        }).then(() => {
            this.inputAttach = this.getInputAttach();
            this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
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
        });
        }
      //  this.prepInputsAttach = this.getObjectInputFields(this.fieldChildAbsoluteRightsDirectory);
      /*  this.isLoading = true;
        this._collectionSrv.getCollectionList()
            .then((list: ICollectionList[]) => {
                this.isLoading = false;
                this.collectionList = list;
                this._orderByField();
            })
            .catch(e => {
                this._closed();
            });*/
    }
    prepDataAttachField(data) {
        for (const k of Object.keys(this.objectDataAbsoluteRightsDirectory)) {
            this.prepDataAttach.rec[k] = data[0].charAt(this.objectDataAbsoluteRightsDirectory[k]) === '1' ? '1' : '0';
        }
    }
    getInputAttach() {
        const dataInput = {rec: {}};
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
        });
        return this.dataSrv.getInputs(this.prepInputsAttach, dataInput);
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
    submit() {}
    cancel() {}
}
