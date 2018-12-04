import { Component, Injector, OnInit } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { ABSOLUTE_RIGHTS } from '../shared-rights-delo/consts/absolute-rights.consts';
import { EosUtils } from 'eos-common/core/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AbsoluteRightsDirectoryComponent } from './absolute-rights-directory-modal/absolute-rights-directory-modal.component';

@Component({
    selector: 'eos-rights-delo-absolute-rights',
    templateUrl: 'rights-delo-absolute-rights.component.html'
})

export class RightsDeloAbsoluteRightsComponent extends BaseRightsDeloSrv implements OnInit {
    directoryModal: BsModalRef;
   // _modalSrv: BsModalService;
    isLoading = false;
    userId = '' + this._userParamsSetSrv.userContextId;
    fieldChildAbsoluteRights = [];
    arrayCheckboxforAbsoluteRights = [
        ['ABSOLUTE_RIGHTS_SYSTEM_TECHNOLOGIST', 'Системный технолог', false],
        ['ABSOLUTE_RIGHTS_SEARCH_ALL_CARD_INDEXES', 'Поиск по всем картотекам', false],
        ['ABSOLUTE_RIGHTS_SENDING_DOCUMENTS_IN_REGISTRIES', 'Отправка документов по реестрам', false],
        ['ABSOLUTE_RIGHTS_VIEW_ALL_ORDERS', 'Просмотр всех поручений', false],
        ['ABSOLUTE_RIGHTS_ENTERING_RESOLUTIONS', 'Ввод резолюций', false],
        ['ABSOLUTE_RIGHTS_ENTER_DRAFT_RESOLUTIONS', 'Ввод проектов резолюций', false],
        ['ABSOLUTE_RIGHTS_EXECUTION_OF_ORDERS', 'Исполнение поручений', false],
        ['ABSOLUTE_RIGHTS_CREATION_OF_THE_RCPD', 'Создание РКПД', false],
        ['ABSOLUTE_RIGHTS_CONTROL_OF_EXECUTION_OF_ORDERS', 'Контроль исполнения поручений', false],
        ['ABSOLUTE_RIGHTS_ADDING_ORGANIZATIONS_AND_CITIZENS', 'Добавление организаций и граждан', false],
        ['ABSOLUTE_RIGHTS_EDITING_ORGANIZATIONS_AND_CITIZENS', 'Редактирование организаций и граждан', false],
        ['ABSOLUTE_RIGHTS_EDITING_THE_REGISTRATION_NUMBER_OF_THE_RC', 'Редактирование регистрационного номера РК', false],
        ['ABSOLUTE_RIGHTS_VISITING_PROJECTS', 'Визировать проекты', false],
        ['ABSOLUTE_RIGHTS_SIGN_PROJECTS', 'Подписывать проекты', false],
        ['ABSOLUTE_RIGHTS_CREATE_SYSTEM_QUERIES', 'Создавать системные запросы', false],
        ['ABSOLUTE_RIGHTS_GROUP_REMOVAL_OF_RC', 'Групповое удаление РК', false],
        ['ABSOLUTE_RIGHTS_ALERT_SUBSCRIPTION_MANAGEMENT', 'Управление подпиской на оповещения', false],
        ['ABSOLUTE_RIGHTS_READING_FILES_IN_ALL_CARDS', 'Чтение файлов во всех картотеках', false],
        ['ABSOLUTE_RIGHTS_READING_RC_PERSONAL_ACCESS', 'Чтение РК персон. доступа', false],
        ['ABSOLUTE_RIGHTS_READING_PERSONAL_ACCESS_FILES', 'Чтение файлов персон. доступа', false],
        ['ABSOLUTE_RIGHTS_UPLOADING_INFORMATION_TO_THE_SSTU', 'Выгрузка информации на ССТУ', false],
    ];
    objectDataAbsoluteRights = {
        ABSOLUTE_RIGHTS_SYSTEM_TECHNOLOGIST: 0,
        ABSOLUTE_RIGHTS_SEARCH_ALL_CARD_INDEXES: 1,
        ABSOLUTE_RIGHTS_SENDING_DOCUMENTS_IN_REGISTRIES: 2,
        ABSOLUTE_RIGHTS_VIEW_ALL_ORDERS: 3,
        ABSOLUTE_RIGHTS_ENTERING_RESOLUTIONS: 4,
        ABSOLUTE_RIGHTS_ENTER_DRAFT_RESOLUTIONS: 22,
        ABSOLUTE_RIGHTS_EXECUTION_OF_ORDERS: 5,
        ABSOLUTE_RIGHTS_CREATION_OF_THE_RCPD: 28,
        ABSOLUTE_RIGHTS_CONTROL_OF_EXECUTION_OF_ORDERS: 6,
        ABSOLUTE_RIGHTS_ADDING_ORGANIZATIONS_AND_CITIZENS: 7,
        ABSOLUTE_RIGHTS_EDITING_ORGANIZATIONS_AND_CITIZENS: 8,
        ABSOLUTE_RIGHTS_EDITING_THE_REGISTRATION_NUMBER_OF_THE_RC: 9,
        ABSOLUTE_RIGHTS_VISITING_PROJECTS: 10,
        ABSOLUTE_RIGHTS_SIGN_PROJECTS: 11,
        ABSOLUTE_RIGHTS_CREATE_SYSTEM_QUERIES: 15,
        ABSOLUTE_RIGHTS_GROUP_REMOVAL_OF_RC: 18,
        ABSOLUTE_RIGHTS_ALERT_SUBSCRIPTION_MANAGEMENT: 19,
        ABSOLUTE_RIGHTS_READING_FILES_IN_ALL_CARDS: 23,
        ABSOLUTE_RIGHTS_READING_RC_PERSONAL_ACCESS: 24,
        ABSOLUTE_RIGHTS_READING_PERSONAL_ACCESS_FILES: 25,
        ABSOLUTE_RIGHTS_UPLOADING_INFORMATION_TO_THE_SSTU: 29
    };
    arrayValuesDeloRights = [];
    prepInputsAttach;
    inputAttach;
    formAttach;
    newDataAttach;
    prepDataAttach = {rec: {}};
    currentSelectedWord;
    private quaryDepartment = {
        USER_CL: {
            criteries: {
                ISN_LCLASSIF: this.userId
            }
        }
    };
    constructor( private _modalSrv: BsModalService, injector: Injector, private servApi: UserParamApiSrv ) {
        super(injector, ABSOLUTE_RIGHTS);
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
    }
   /* afterInit() {
        console.log('afterInit');
       // const allData = this.arrayCheckboxforCardIndexRights;
      //  this.prepDataAttachField(allData);
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
    }*/
    ngOnInit() {
      //  const allData = this._userParamsSetSrv.hashUserAbsoluteRights;
        this.isLoading = true;
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            this.arrayValuesDeloRights.push(data[0]['DELO_RIGHTS']);
            this.prepDataAttachField(this.arrayValuesDeloRights);
            this.init();
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
    prepDataAttachField(data) {
        for (const k of Object.keys(this.objectDataAbsoluteRights)) {
            this.prepDataAttach.rec[k] = data[0].charAt(this.objectDataAbsoluteRights[k]) === '1' ? '1' : '0';
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
        console.log(this.prepInputsAttach);
        console.log(dataInput);
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
    selectedNode(word) {
        this.isMarkNode = true;
        for (let i = 0; i < this.arrayCheckboxforAbsoluteRights.length; i++) {
            if (this.arrayCheckboxforAbsoluteRights[i][1] === word) {
                this.arrayCheckboxforAbsoluteRights[i][2] = true;
            } else {
                this.arrayCheckboxforAbsoluteRights[i][2] = false;
            }
        }
        this.currentSelectedWord = word;
    }
    openDirectoryModal() {
        // this.collectionVisible = value;
        this.directoryModal = this._modalSrv.show(AbsoluteRightsDirectoryComponent, {
            class: 'directory-modal',
            ignoreBackdropClick: true
        });
        this.directoryModal.content.closeCollection.subscribe(() => {
            this.directoryModal.hide();
        });
    }
}
