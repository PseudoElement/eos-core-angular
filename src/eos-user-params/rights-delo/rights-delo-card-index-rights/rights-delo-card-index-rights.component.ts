import { Component, Injector, OnInit } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { CARD_INDEXS_RIGHTS } from '../shared-rights-delo/consts/card-index-rights.consts';
import { EosUtils } from 'eos-common/core/utils';
// import { RightsDeloCardFilesSrv } from '../shared-rights-delo/services/card-files.service';

@Component({
    selector: 'eos-rights-delo-card-index-rights',
    templateUrl: 'rights-delo-card-index-rights.component.html'
})

export class RightsDeloCardIndexRightsComponent extends BaseRightsDeloSrv implements OnInit {
    isLoading = false;
    fieldKeysforCardIndexRights: string[] = [];
    arrayCheckboxforCardIndexRights = [
        'Регистрация документов',
        'Поиск документов',
        'Редактирование РК',
        'Редактирование доп.реквизитов',
        'Редактирование рубрик',
        'Редактирование связок',
        'Удаление РК',
        'Пересылка РК',
        'Получение отчетов',
        'Перемотка документов',
        'Списание документов в дело',
        'Отметка ознакомления',
        'Отправка по e-mail',
        'Отметка отправки документов',
        'Опись дел',
        'Добавлять файлы',
        'Читать файлы',
        'Редактировать файлы',
        'Удалять файлы',
        'Просмотр поручений',
        'Отправка сообщений СЭВ',
    ];
    arrayKeysCheckboxforCardIndexRights = [
        'CARD_INDEX_RIGHTS_REGISTRATION_OF_DOCUMENTS',
        'CARD_INDEX_RIGHTS_DOCUMENT_SEARCH',
        'CARD_INDEX_RIGHTS_EDITING_RC',
        'CARD_INDEX_RIGHTS_EDITING_ADDITIONAL_DETAILS',
        'CARD_INDEX_RIGHTS_EDITING_RUBRICS',
        'CARD_INDEX_RIGHTS_EDITING_BUNDLE',
        'CARD_INDEX_RIGHTS_RC_REMOVAL',
        'CARD_INDEX_RIGHTS_RC_SHIPMENT',
        'CARD_INDEX_RIGHTS_RECEIVE_REPORTS',
        'CARD_INDEX_RIGHTS_DOCUMENT_REWIND',
        'CARD_INDEX_RIGHTS_WRITING_OFF_OF_DOCUMENTS_IN_DELO',
        'CARD_INDEX_RIGHTS_MARK_FAMILIARIZATION',
        'CARD_INDEX_RIGHTS_SENDING_BY_EMAIL',
        'CARD_INDEX_RIGHTS_MARK_SENDING_DOCUMENTS',
        'CARD_INDEX_RIGHTS_INVENTORY_OF_CASES',
        'CARD_INDEX_RIGHTS_ADD_FILES',
        'CARD_INDEX_RIGHTS_READ_FILES',
        'CARD_INDEX_RIGHTS_EDIT_FILES',
        'CARD_INDEX_RIGHTS_DELETE_FILES',
        'CARD_INDEX_RIGHTS_VIEW_ORDERS',
        'CARD_INDEX_RIGHTS_SENDING_MESSAGES_SEV'
    ];
    objectDataCardIndexRights = {
        CARD_INDEX_RIGHTS_REGISTRATION_OF_DOCUMENTS: 0,
        CARD_INDEX_RIGHTS_DOCUMENT_SEARCH: 1,
        CARD_INDEX_RIGHTS_EDITING_RC: 2,
        CARD_INDEX_RIGHTS_EDITING_ADDITIONAL_DETAILS: 3,
        CARD_INDEX_RIGHTS_EDITING_RUBRICS: 4,
        CARD_INDEX_RIGHTS_EDITING_BUNDLE: 5,
        CARD_INDEX_RIGHTS_RC_REMOVAL: 6,
        CARD_INDEX_RIGHTS_RC_SHIPMENT: 7,
        CARD_INDEX_RIGHTS_RECEIVE_REPORTS: 8,
        CARD_INDEX_RIGHTS_DOCUMENT_REWIND: 9,
        CARD_INDEX_RIGHTS_WRITING_OFF_OF_DOCUMENTS_IN_DELO: 10,
        CARD_INDEX_RIGHTS_MARK_FAMILIARIZATION: 11,
        CARD_INDEX_RIGHTS_SENDING_BY_EMAIL: 12,
        CARD_INDEX_RIGHTS_MARK_SENDING_DOCUMENTS: 13,
        CARD_INDEX_RIGHTS_INVENTORY_OF_CASES: 14,
        CARD_INDEX_RIGHTS_ADD_FILES: 15,
        CARD_INDEX_RIGHTS_READ_FILES: 16,
        CARD_INDEX_RIGHTS_EDIT_FILES: 17,
        CARD_INDEX_RIGHTS_DELETE_FILES: 18,
        CARD_INDEX_RIGHTS_VIEW_ORDERS: 19,
        CARD_INDEX_RIGHTS_SENDING_MESSAGES_SEV: 20
    };
    fieldsChildCardIndexRights = [];
    prepInputsAttach;
    inputAttach;
    formAttach;
    newDataAttach;
    prepDataAttach = {rec: {}};

    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    constructor( injector: Injector, private servApi: UserParamApiSrv ) {
        super(injector, CARD_INDEXS_RIGHTS);
        for (let i = 0; i < this.arrayKeysCheckboxforCardIndexRights.length; i++) {
            this.fieldsChildCardIndexRights.push(
                {
                    key: this.arrayKeysCheckboxforCardIndexRights[i],
                    type: 'boolean',
                    title: this.arrayCheckboxforCardIndexRights[i]
                }
            );
        }
        this.prepInputsAttach = this.getObjectInputFields(this.fieldsChildCardIndexRights);
        this.afterInit();
    }
    afterInit() {
        const allData = this._userParamsSetSrv.hashUserContextCard;
        this.prepDataAttachField(allData);
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
    }
    ngOnInit() {
        const allData = this._userParamsSetSrv.hashUserContextCard;
        this.isLoading = true;
        CARD_INDEXS_RIGHTS.fields = [];
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
        for (let i = 0; i < data.length; i++) {
         for (const keyFromUsercard of Object.keys(allData)) {
           if (data[i]['DUE'] === keyFromUsercard) {
                 this.fieldKeysforCardIndexRights.push(data[i]['DUE']);
                 if (CARD_INDEXS_RIGHTS.fields[0] === undefined) {
                 CARD_INDEXS_RIGHTS.fields.push({
                    key: 'SELECT_FOR_CARD_NAME',
                    type: 'select',
                    title: '',
                    options: [
                        {value: data[i]['DUE'], title: data[i]['CARD_NAME']}
                    ]
                 });
                } else {
                      CARD_INDEXS_RIGHTS.fields[0]['options'].push(
                      {value: data[i]['DUE'], title: data[i]['CARD_NAME']}
                      );
                    }
                }
              }
            }
            this.init();
            this.isLoading = false;
        });
    }
    prepDataAttachField(data) {
        for (const key of Object.keys(data)) {
            for (const k of Object.keys(this.objectDataCardIndexRights)) {
                this.prepDataAttach.rec[k] = data[key].charAt(this.objectDataCardIndexRights[k]) === '1' ? '1' : '0';
            }
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
    selectOnClick(event) {
        const data = this._userParamsSetSrv.hashUserContextCard;
        for (const key of Object.keys(data)) {
            if (event.target.value === key) {
                for (const k of Object.keys(this.objectDataCardIndexRights)) {
                this.prepDataAttach.rec[k] = data[key].charAt(this.objectDataCardIndexRights[k]) === '1' ? '1' : '0';
                 }
            }
        }
        this.inputAttach = this.getInputAttach();
        this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
    }
}
