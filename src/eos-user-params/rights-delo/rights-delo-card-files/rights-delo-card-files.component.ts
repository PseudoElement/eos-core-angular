import { Component, Injector, OnInit } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { CARD_FILES_USER } from '../shared-rights-delo/consts/card-files.consts';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserParamsService } from '../../shared/services/user-params.service';
import { CardFilesDirectoryModalComponent } from './card-files-directory-modal/card-files-directory-modal.component';
import { EosUtils } from 'eos-common/core/utils';
import { PARM_SUCCESS_SAVE } from '../shared-rights-delo/consts/eos-user-params.const';

@Component({
    selector: 'eos-rights-delo-card-files',
    templateUrl: 'rights-delo-card-files.component.html'
})

export class RightsDeloCardFilesComponent extends BaseRightsDeloSrv implements OnInit {
    modalCollection: BsModalRef;
    _userParamsSetSrv: UserParamsService;
    newDataAttach;
    arrayValuesFoldersAvailable = [];
    isLoading = false;
    fieldKeysforCardFiles = [];
    fieldKeysforCardFilesCabinets = [];
    arrayForCurrentCabinets = [];
    allData;
    arrayKeysCheckboxforCabinets = [
        ['USER_ACCOUNTS_RECEIVED', 'Поступившие'],
        ['USER_ACCOUNTS_ON_PERFORMANCE', 'На исполнении'],
        ['USER_ACCOUNTS_UNDER_CONTROL', 'На контроле'],
        ['USER_ACCOUNTS_HAVE_LEADERSHIP', 'У руководства'],
        ['USER_ACCOUNTS_UNDER_CONSIDERATION', 'На рассмотрении'],
        ['USER_ACCOUNTS_IN_DELO', 'В дело'],
        ['USER_ACCOUNTS_SUPERVISORY_PROCEEDINGS', 'Надзорные производства'],
        ['USER_ACCOUNTS_PROJECT_MANAGEMENT', 'Управление проектами'],
        ['USER_ACCOUNTS_ON_SIGHT', 'На визировании'],
        ['USER_ACCOUNTS_ON_THE_SIGNATURE', 'На подписи'],
        ['HIDE_INACCESSIBLE', 'Учитывать ограничения доступа к РК по грифам и группам документов'],
        ['HIDE_INACCESSIBLE_PRJ', 'Учитывать права для работы с РКПД'],
    ];
    cardFilesUser = {
        id: 'card-files',
        title: 'Картотеки',
        apiInstance: 'DEPARTMENT',
        fields: []
    };
    currentSelectedWord;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    inputAttach;
    formAttach;
    objectForIsnCabinet = {};
    allDataForCurrentCabinet;
    allDataForCurrentUsercard;
    currentIsnCabinet;
    currentWord;
    flagCurrentDataCabinetDepartment = true;
    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    private quareUsercard = {
        USERCARD: {
            criteries: {
                ISN_LCLASSIF: '' + this._userParamsSetSrv.userContextId
            }
        }
    };
    private quaryCabinet = {
        CABINET: {
            criteries: {
            }
        }
    };
    constructor(private _modalSrv: BsModalService, injector: Injector, private servApi: UserParamApiSrv ) {
        super(injector, CARD_FILES_USER);
        for (let i = 0; i < this.arrayKeysCheckboxforCabinets.length; i++) {
            this.fieldKeysforCardFilesCabinets.push(
                {
                    key: this.arrayKeysCheckboxforCabinets[i][0],
                    type: 'boolean',
                    title: this.arrayKeysCheckboxforCabinets[i][1]
                }
            );
        }
        this.prepInputsAttach = this.getObjectInputFields(this.fieldKeysforCardFilesCabinets);
    }
    ngOnInit() {
        const allDataCard = this._userParamsSetSrv.userCard;
        this.allData = allDataCard;
        this.isLoading = true;
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
             this.servApi.getData(this.quareUsercard)
             .then(data2 => {
                for (let i = 0; i < data.length; i++) {
                this.fieldKeysforCardFiles.push([data[i]['DUE'], data[i]['CARD_NAME'], false, false, false]);
                CARD_FILES_USER.fields.push({
                    key: data[i]['DUE'],
                    type: 'boolean',
                    title: data[i]['CARD_NAME'],
                    readonly: true
                 });
                    for (let j = 0; j < data2.length; j++) {
                       if (data[i]['DUE'] === data2[j]['DUE']) {
                       this.fieldKeysforCardFiles[i][4] = true;
                       }
                    }
                }
                this.servApi.getData(this.quaryCabinet).then(data4 => {
                    for (let j = 0; j < data4.length; j++) {
                            this.arrayForCurrentCabinets.push([data4[j]['CABINET_NAME'], data4[j]['ISN_CABINET'], data4[j]['DUE']]);
                }
                });
                this.init();
                this.choosingMainCheckbox();
        }).then(() => {
            for (let i = 0; i < CARD_FILES_USER.fields.length; i++) {
                if (CARD_FILES_USER.fields[i]['readonly'] === true) {
                  this.form.controls['rec.' + CARD_FILES_USER.fields[i]['key']].disable();
                }
            }
           //   this.choosingMainCheckbox();
              this.isLoading = false;
        });
        });
        console.log(this.prepareData);
    }
    settingValuesForFieldsCabinets(value) {
                            this.prepDataAttachField(value);
                            this.inputAttach = this.getInputAttach();
                            this.formAttach = this.inputCtrlSrv.toFormGroup(this.inputAttach);
                            this.subscriptions.push(
                            this.formAttach.valueChanges.debounceTime(200)
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
    }

    prepDataAttachField(data) {
        if (data === 'Empty') {
            this.prepDataAttach.rec = {};
        } else {
        for (const key of Object.keys(data)) {
            if (key === 'FOLDERS_AVAILABLE') {
            this.prepDataAttach.rec['USER_ACCOUNTS_RECEIVED'] = data[key].indexOf('1')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_ON_PERFORMANCE'] = data[key].indexOf('2')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_UNDER_CONTROL'] = data[key].indexOf('3')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_HAVE_LEADERSHIP'] = data[key].indexOf('4')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_UNDER_CONSIDERATION'] = data[key].indexOf('5')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_IN_DELO'] = data[key].indexOf('6')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_PROJECT_MANAGEMENT'] = data[key].indexOf('7')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_ON_SIGHT'] = data[key].indexOf('8')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_ON_THE_SIGNATURE'] = data[key].indexOf('9')
            >= 0 ? true : false;
            this.prepDataAttach.rec['USER_ACCOUNTS_SUPERVISORY_PROCEEDINGS'] = data[key].indexOf('A')
            >= 0 ? true : false;
            } else if (key === 'HIDE_INACCESSIBLE') {
                this.prepDataAttach.rec['HIDE_INACCESSIBLE'] = data[key] === 1 ? true : false;
            } else if (key === 'HIDE_INACCESSIBLE_PRJ') {
                this.prepDataAttach.rec['HIDE_INACCESSIBLE_PRJ'] = data[key] === 1 ? true : false;
            }
        }
    }
    }
    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
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
        if (this.newDataAttach || this.prepareData || this.newData) {
            const userId = '' + this._userParamsSetSrv.userContextId;
            this.formChanged.emit(false);
            this.isChangeForm = false;
            // this._userParamsSetSrv.getUserIsn();
            this.userParamApiSrv
                .setData(this.createObjRequestForAll())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
        }
    }
      createObjRequestForAttach(): any[] {
        let valueDefForFoldersAvailable = '';
        let valueDefForHideInaccessible = '';
        let valueDefForHideInaccessiblePrj = '';
        const arrayForValueSrchContactFields = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const req = [];
        const userId = this._userParamsSetSrv.userContextId;
        const arrayKeys = this.arrayKeysCheckboxforCabinets;
            for (let i = 0; i < arrayKeys.length; i++) {
                if (arrayKeys[i][0] === 'HIDE_INACCESSIBLE') {
                    if (this.newDataAttach.rec[arrayKeys[i][0]] === true) {
                        valueDefForHideInaccessible += 1;
                    } else {
                        valueDefForHideInaccessible += 0;
                    }
                } else if (arrayKeys[i][0] === 'HIDE_INACCESSIBLE_PRJ') {
                    if (this.newDataAttach.rec[arrayKeys[i][0]] === true) {
                        valueDefForHideInaccessiblePrj += 1;
                    } else {
                        valueDefForHideInaccessible += 0;
                    }
                } else if (arrayKeys[i][0] === 'USER_ACCOUNTS_SUPERVISORY_PROCEEDINGS') {
                    if (this.newDataAttach.rec[arrayKeys[i][0]] === true) {
                        valueDefForFoldersAvailable += 'A';
                    }
                } else {
                    if (this.newDataAttach.rec[arrayKeys[i][0]] === true) {
                           valueDefForFoldersAvailable += arrayForValueSrchContactFields[i];
                    }
                }
            }
        if (this.allDataForCurrentCabinet.length === 0) {
            req.push({
                method: 'POST',
                requestUri: `USER_CL(${userId})/USERCARD_List(\'${userId} ${this.allDataForCurrentUsercard['DUE']}\')/USER_CABINET_List`,
                data: {
                        ISN_CABINET: +this.currentIsnCabinet,
                        ISN_LCLASSIF: +userId,
                        FOLDERS_AVAILABLE: valueDefForFoldersAvailable,
                        ORDER_WORK: null,
                        HOME_CABINET: 1,
                        HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                        HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj
                }
            });
        } else {
            req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${userId})/USERCARD_List(\'${userId} ${this.allDataForCurrentCabinet['DEPARTMENT_DUE']}\')/USER_CABINET_List(\'${this.allDataForCurrentCabinet['ISN_CABINET']} ${userId}\')`,
                data: {
                          FOLDERS_AVAILABLE: valueDefForFoldersAvailable,
                          HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                          HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj,
                }
            });
        }
       return req;
    }
    createObjRequestForAll() {
        let newReq;
        if (this.newDataAttach) {
        const reqAttach = this.createObjRequestForAttach();
        const req = this.createObjRequest();
        newReq = req.concat(reqAttach[0]);
        } else {
         return this.createObjRequest();
        }
        return newReq;
    }
    choosingMainCheckbox() {
        let flag = true;
        let tmpI = -1;
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            for (const key in this._userParamsSetSrv.hashUserContexHomeCard) {
            if (this.fieldKeysforCardFiles[i][2] === true) {
                this.mainCheckbox = {};
                flag = false;
                this.fieldKeysforCardFiles[i][2] = true;
                this.fieldKeysforCardFiles[i][3] = true;
                this.mainCheckbox[this.fieldKeysforCardFiles[i][0]] = 1;
            } else if (this.fieldKeysforCardFiles[i][0] === key && this._userParamsSetSrv.hashUserContexHomeCard[key] === 1 && flag) {
                tmpI = i;
            } else {
                this.fieldKeysforCardFiles[i][3] = false;
            }
          }
        }

        if (tmpI !== -1 && flag) {
            this.oldMainCheckbox = {};
            this.fieldKeysforCardFiles[tmpI][2] = true;
            this.fieldKeysforCardFiles[tmpI][3] = true;
            this.oldMainCheckbox[this.fieldKeysforCardFiles[tmpI][0]] = 0;
            this.selectedNode(this.fieldKeysforCardFiles[tmpI][1], null);
        }
    }
    selectedNode(word, event) {
        this.isMarkNode = true;
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            if (this.fieldKeysforCardFiles[i][1] === word) {
                this.currentWord = word;
                this.fieldKeysforCardFiles[i][2] = true;
                for (let j = 0; j < this.allData.length; j++) {
                    if (this.fieldKeysforCardFiles[i][0] === this.allData[j]['DUE']) {
                        if (this.allData[j]['USER_CABINET_List'].length > 0) {
                            this.settingValuesForFieldsCabinets(this.allData[j]['USER_CABINET_List'][0]);
                            this.allDataForCurrentCabinet = this.allData[j]['USER_CABINET_List'][0];
                            this.allDataForCurrentUsercard = this.allData[j];
                        } else {
                            this.settingValuesForFieldsCabinets('Empty');
                            this.allDataForCurrentCabinet = this.allData[j]['USER_CABINET_List'];
                            this.allDataForCurrentUsercard = this.allData[j];
                            for (let z = 0; z < this.arrayForCurrentCabinets.length; z++) {
                                if (word === this.arrayForCurrentCabinets[z][0]) {
                                    this.currentIsnCabinet = this.arrayForCurrentCabinets[z][1];
                                }
                            }
                        }
                    }
                }
            } else {
                this.fieldKeysforCardFiles[i][2] = false;
            }
        }
        this.currentSelectCard();
        this.currentSelectedWord = word;
    }
    currentSelectCard() {
        let dataCabinetDepartmentForDefault;
        const quareCabinetDepartment = {
            CABINET: {
                criteries: {
                    'CABINET.DEPARTMENT.DEPARTMENT_DUE': this.allDataForCurrentUsercard['DUE']
                }
            }
        };
        const selectForCabinetsName = CARD_FILES_USER.fields.find(elem => elem.key === 'SELECT_FOR_CABINETS_NAME');
        selectForCabinetsName['options'] = [];

        this.servApi.getData(quareCabinetDepartment).then(dataCabinetDepartment => {
            dataCabinetDepartmentForDefault = dataCabinetDepartment;
            if (dataCabinetDepartment.length > 0) {
                for (let j = 0; j < dataCabinetDepartment.length; j++) {
                  selectForCabinetsName['options'].push({value: dataCabinetDepartment[j]['DUE'], title: dataCabinetDepartment[j]['CABINET_NAME']});
                }
                this.flagCurrentDataCabinetDepartment = true;
            } else {
                this.flagCurrentDataCabinetDepartment = false;
            }
        }).then(() => {
           this.init();
        }).then(() => {
            if (this.flagCurrentDataCabinetDepartment) {
                this.form['value']['rec.SELECT_FOR_CABINETS_NAME'] = dataCabinetDepartmentForDefault[0]['DUE'];
                this.prepareData.rec['SELECT_FOR_CABINETS_NAME'] = dataCabinetDepartmentForDefault[0]['DUE'];
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
            }
        });
    }
    selectOnClick(event) {
        for (let i = 0; i < this.allDataForCurrentUsercard['USER_CABINET_List'].length; i++) {
            if (event.target.value === this.allDataForCurrentUsercard['USER_CABINET_List'][i]['DEPARTMENT_DUE']) {
                this.settingValuesForFieldsCabinets(this.allDataForCurrentUsercard['USER_CABINET_List'][i]);
            } else {
                this.settingValuesForFieldsCabinets('Empty');
            }
        }
    }
    addCardFile() {
        this.modalCollection = this._modalSrv.show(CardFilesDirectoryModalComponent, {
            class: 'modal-collection',
            ignoreBackdropClick: true
        });
        this.modalCollection.content.closeCollection.subscribe(() => {
            this.modalCollection.hide();
        });
    }
    removeCardFile() {
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            if (this.fieldKeysforCardFiles[i][0] === this.allDataForCurrentUsercard['DUE']) {
              //  this.prepareData.rec[this.fieldKeysforCardFiles[i][0]] = undefined;
                this.fieldKeysforCardFiles[i][4] = false;
                this.newData.rec[this.fieldKeysforCardFiles[i][0]] = 'NO';
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
            }
        }
    }
}
