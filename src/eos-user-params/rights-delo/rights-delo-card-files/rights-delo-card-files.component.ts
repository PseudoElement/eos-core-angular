import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { CARD_FILES_USER } from '../shared-rights-delo/consts/card-files.consts';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserParamsService } from '../../shared/services/user-params.service';
import { CardFilesDirectoryModalComponent } from './card-files-directory-modal/card-files-directory-modal.component';
import { EosUtils } from 'eos-common/core/utils';
import { PARM_SUCCESS_SAVE, PARM_NO_MAIN_CARD } from '../shared-rights-delo/consts/eos-user-params.const';

@Component({
    selector: 'eos-rights-delo-card-files',
    templateUrl: 'rights-delo-card-files.component.html'
})

export class RightsDeloCardFilesComponent extends BaseRightsDeloSrv implements OnInit {
    @Output() Changed = new EventEmitter();
    modalCollection: BsModalRef;
    _userParamsSetSrv: UserParamsService;
    newDataAttach;
    arrayValuesFoldersAvailable = [];
    isLoading = false;
    listCabinets = [];
    fieldKeysforCardFiles = [];
    fieldKeysforCardFilesCabinets = [];
    arrayForCurrentCabinets = [];
    arrayNewData = [];
    arrayUpdateData = [];
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
    postOrMergeQuery;
    currentSelectedWord;
    prepInputsAttach;
    prepDataAttach = {rec: {}};
    inputAttach;
    formAttach;
    currentDueCard;
    objectForIsnCabinet = {};
    allDataForCurrentCabinet;
    allDataForCurrentUsercard;
    currentIsnCabinet;
    currentWord;
    flagCurrentDataCabinetDepartment = true;
    flagNoCardIndexSelected = false;
    flagCardFileAvailability;
    flagNoMainCard = false;
    flagTmp = false;
    globalIndexMainCard;
    globalMainCard;
    flagForFirstShowSelect = false;
    flagNewDataWhenChanging = false;
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
               if (data2.length > 0) {
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
                this.flagCardFileAvailability = true;
            } else {
                this.flagCardFileAvailability = false;
            }
                this.servApi.getData(this.quaryCabinet).then(data4 => {
                    for (let j = 0; j < data4.length; j++) {
                            this.arrayForCurrentCabinets.push([data4[j]['CABINET_NAME'], data4[j]['ISN_CABINET'], data4[j]['DUE']]);
                }
                }).catch(error => console.log(error));
                this.init();
                this.choosingMainCheckbox();
        }).then(() => {
            for (let i = 0; i < CARD_FILES_USER.fields.length; i++) {
                if (CARD_FILES_USER.fields[i]['readonly'] === true) {
                  this.form.controls['rec.' + CARD_FILES_USER.fields[i]['key']].disable();
                }
            }
              this.isLoading = false;
        }).catch(error => console.log(error));
        }).catch(error => console.log(error));
    }
    updatePageCard() {
        this.fieldKeysforCardFilesCabinets = [];
            this.updateInit();
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
            for (const key of Object.keys(this.prepareData.rec)) {
                if (this.prepareData.rec[key] !== undefined) {
                    for (let j = 0; j < this.fieldKeysforCardFiles.length; j++) {
                        if (this.fieldKeysforCardFiles[j][0] === key) {
                            this.fieldKeysforCardFiles[j][4] = true;
                        }
                    }
                }
            }
            this.prepareDataParam();
            this.inputs = this.getInputs();
            this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
            for (let i = 0; i < CARD_FILES_USER.fields.length; i++) {
                if (CARD_FILES_USER.fields[i]['readonly'] === true) {
                  this.form.controls['rec.' + CARD_FILES_USER.fields[i]['key']].disable();
                }
            }
        this.allData = this._userParamsSetSrv.userCard;
         }
    settingValuesForFieldsCabinets(value) {
                            this.prepDataAttachField(value);
                            this.fieldKeysforCardFilesCabinets = [];
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
        if (this.newDataAttach || this.prepareData || this.newData2) {
            if (!this.flagNoMainCard) {
            const userId = '' + this._userParamsSetSrv.userContextId;
            this.formChanged.emit(false);
            this.isChangeForm = false;
            // this._userParamsSetSrv.getUserIsn();
            this.userParamApiSrv
                .setData(this.createObjRequestForAll())
                .then(data => {
                   // this.prepareData.rec = Object.assign({}, this.newData.rec);
                    this.allData = this._userParamsSetSrv.userCard;
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    this._userParamsSetSrv.getUserIsn(userId);
                })
                // tslint:disable-next-line:no-console
                .catch(data => console.log(data));
            } else {
                this.msgSrv.addNewMessage(PARM_NO_MAIN_CARD);
            }
        }
    }
    checkData() {
        this.flagNewDataWhenChanging  = true;
    }
    newDataWhenChanging() {
        if (this.flagNewDataWhenChanging) {
        let valueDefForFoldersAvailable = '';
        let valueDefForHideInaccessible = '';
        let valueDefForHideInaccessiblePrj = '';
        let flagToCheckForThePresenceOfTheDesiredCabinet = false;
        const userId = this._userParamsSetSrv.userContextId;
        const arrayForValueSrchContactFields = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
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
                        valueDefForHideInaccessiblePrj += 0;
                    }
                } else if (arrayKeys[i][0] === 'USER_ACCOUNTS_SUPERVISORY_PROCEEDINGS') {
                    if (this.newDataAttach.rec[arrayKeys[i][0]] === true) {
                        valueDefForFoldersAvailable += 'A';
                    }
                } else {
                    if (this.newDataAttach.rec[arrayKeys[i][0]] === true) {
                        if (i === 9) {
                            valueDefForFoldersAvailable += arrayForValueSrchContactFields[6];
                        } else {
                            valueDefForFoldersAvailable += arrayForValueSrchContactFields[i];
                        }
                    }
                }
            }
        if (this.allDataForCurrentUsercard['USER_CABINET_List'].length > 0) {
            for (let i = 0; i < this.allDataForCurrentUsercard['USER_CABINET_List'].length; i++) {
                if (this.allDataForCurrentUsercard['USER_CABINET_List'][i]['ISN_CABINET'] === this.currentIsnCabinet) {
                    this.allDataForCurrentUsercard['USER_CABINET_List'][i]['FOLDERS_AVAILABLE'] = valueDefForFoldersAvailable;
                    this.allDataForCurrentUsercard['USER_CABINET_List'][i]['HIDE_INACCESSIBLE'] = +valueDefForHideInaccessible;
                    this.allDataForCurrentUsercard['USER_CABINET_List'][i]['HIDE_INACCESSIBLE_PRJ'] = +valueDefForHideInaccessiblePrj;
                    this.arrayUpdateData.push({
                        ISN_CABINET: +this.currentIsnCabinet,
                        ISN_LCLASSIF: +userId,
                        FOLDERS_AVAILABLE: valueDefForFoldersAvailable,
                        ORDER_WORK: null,
                        HOME_CABINET: 1,
                        HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                        HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj,
                        DUE_CARD: this.allDataForCurrentUsercard['DUE']
                });
                flagToCheckForThePresenceOfTheDesiredCabinet = true;
                } else if (i === (this.allDataForCurrentUsercard['USER_CABINET_List'].length - 1) && !flagToCheckForThePresenceOfTheDesiredCabinet) {
                    this.allDataForCurrentUsercard['USER_CABINET_List'].push({
                        CompositePrimaryKey: '' + this.currentIsnCabinet + ' ' + +userId,
                        DEPARTMENT_DUE: this.allDataForCurrentUsercard['DUE'],
                        FOLDERS_AVAILABLE: valueDefForFoldersAvailable,
                        HIDE_CONF_RESOL: 0,
                        HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                        HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj,
                        HOME_CABINET: 0,
                        ISN_CABINET: this.currentIsnCabinet,
                        ISN_LCLASSIF: +userId,
                        IS_ASSISTANT: 0,
                        ORDER_WORK: null
                    });
                    this.arrayNewData.push({
                        ISN_CABINET: +this.currentIsnCabinet,
                        ISN_LCLASSIF: +userId,
                        FOLDERS_AVAILABLE: valueDefForFoldersAvailable,
                        ORDER_WORK: null,
                        HOME_CABINET: 1,
                        HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                        HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj,
                        DUE_CARD: this.allDataForCurrentUsercard['DUE']
                });
                break;
                }
            }
        } else {
            this.allDataForCurrentUsercard['USER_CABINET_List'].push({
                CompositePrimaryKey: '' + this.currentIsnCabinet + ' ' + +userId,
                DEPARTMENT_DUE: this.allDataForCurrentUsercard['DUE'],
                FOLDERS_AVAILABLE: valueDefForFoldersAvailable,
                HIDE_CONF_RESOL: 0,
                HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj,
                HOME_CABINET: 0,
                ISN_CABINET: this.currentIsnCabinet,
                ISN_LCLASSIF: +userId,
                IS_ASSISTANT: 0,
                ORDER_WORK: null
            });
            this.arrayNewData.push({
                ISN_CABINET: +this.currentIsnCabinet,
                ISN_LCLASSIF: +userId,
                FOLDERS_AVAILABLE: valueDefForFoldersAvailable.length > 0 ? valueDefForFoldersAvailable : '1234',
                ORDER_WORK: null,
                HOME_CABINET: 1,
                HIDE_INACCESSIBLE: +valueDefForHideInaccessible,
                HIDE_INACCESSIBLE_PRJ: +valueDefForHideInaccessiblePrj,
                DUE_CARD: this.allDataForCurrentUsercard['DUE']
        });
        }
        this.flagNewDataWhenChanging = false;
        }
    }
      createObjRequestForAttach(): any[] {
      this.newDataWhenChanging();
        const req = [];
        const userId = this._userParamsSetSrv.userContextId;
            if (this.arrayNewData.length > 0) {
                for (let i = 0; i < this.arrayNewData.length; i++) {
                    req.push({
                        method: 'POST',
                        requestUri: `USER_CL(${userId})/USERCARD_List(\'${userId} ${this.arrayNewData[i]['DUE_CARD']}\')/USER_CABINET_List`,
                        data: {
                                ISN_CABINET: this.arrayNewData[i]['ISN_CABINET'],
                                ISN_LCLASSIF: this.arrayNewData[i]['ISN_LCLASSIF'],
                                FOLDERS_AVAILABLE: this.arrayNewData[i]['FOLDERS_AVAILABLE'],
                                ORDER_WORK: this.arrayNewData[i]['ORDER_WORK'],
                                HOME_CABINET: this.arrayNewData[i]['HOME_CABINET'],
                                HIDE_INACCESSIBLE: this.arrayNewData[i]['HIDE_INACCESSIBLE'],
                                HIDE_INACCESSIBLE_PRJ: this.arrayNewData[i]['HIDE_INACCESSIBLE_PRJ']
                        }
                    });
                }
            }
            if (this.arrayUpdateData.length > 0) {
                for (let i = 0; i < this.arrayUpdateData.length; i++) {
                req.push({
                    method: 'MERGE',
                    requestUri: `USER_CL(${userId})/USERCARD_List(\'${userId} ${this.arrayUpdateData[i]['DUE_CARD']}\')/USER_CABINET_List(\'${this.arrayUpdateData[i]['ISN_CABINET']} ${userId}\')`,
                    data: {
                              FOLDERS_AVAILABLE: this.arrayUpdateData[i]['FOLDERS_AVAILABLE'],
                              HIDE_INACCESSIBLE: this.arrayUpdateData[i]['HIDE_INACCESSIBLE'],
                              HIDE_INACCESSIBLE_PRJ: this.arrayUpdateData[i]['HIDE_INACCESSIBLE_PRJ'],
                    }
                });
            }
            }
        this.arrayNewData = [];
        this.arrayUpdateData = [];
       return req;
    }
    createObjRequestForAll() {
        let newReq;
        if (this.newDataAttach) {
        const reqAttach = this.createObjRequestForAttach();
        const req = this.createObjRequest();
        newReq = req.concat(reqAttach);
        } else {
         return this.createObjRequest();
        }
        return newReq;
    }
    choosingMainCheckbox() {
        let flag = true;
        let flagIfNotMainCard = true;
        let tmpI = -1;
        const arr = [];
        this.flagNoMainCard = false;
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            for (const key in this._userParamsSetSrv.hashUserContexHomeCard) {
            if (this.fieldKeysforCardFiles[i][2] === true) {
                this.mainCheckbox = {};
                flag = false;
                flagIfNotMainCard = false;
                this.fieldKeysforCardFiles[i][2] = true;
                this.fieldKeysforCardFiles[i][3] = true;
                this.mainCheckbox[this.fieldKeysforCardFiles[i][0]] = 1;
            } else if (this.fieldKeysforCardFiles[i][0] === key && this._userParamsSetSrv.hashUserContexHomeCard[key] === 1 && flag) {
                tmpI = i;
                flagIfNotMainCard = false;
            } else {
                this.fieldKeysforCardFiles[i][3] = false;
                if ((this.fieldKeysforCardFiles.length - 1) === i && flagIfNotMainCard && tmpI === -1) {
                    this.fieldKeysforCardFiles[arr[0]][2] = true;
                    this.fieldKeysforCardFiles[arr[0]][3] = true;
                    this.mainCheckbox[this.fieldKeysforCardFiles[arr[0]][0]] = 1;
                    this.selectedNode(this.fieldKeysforCardFiles[arr[0]][1], null);
                } else if (this.fieldKeysforCardFiles[i][0] === key) {
                    arr.push(i);
                } else {
                this.fieldKeysforCardFiles[i][3] = false;
                }
            }
          }
        }

        if (tmpI !== -1 && flag) {
            this.oldMainCheckbox = {};
            this.fieldKeysforCardFiles[tmpI][2] = true;
            this.fieldKeysforCardFiles[tmpI][3] = true;
            this.globalIndexMainCard = tmpI;
            this.oldMainCheckbox[this.fieldKeysforCardFiles[tmpI][0]] = 0;
            this.selectedNode(this.fieldKeysforCardFiles[tmpI][1], null);
        }
        this.btnDisabled = false;
    }
    selectedNode(word, event) {
        if (word !== 'No main card') {
        this.isMarkNode = true;
        this.flagNoCardIndexSelected = false;
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            if (this.fieldKeysforCardFiles[i][1] === word) {
                this.currentWord = word;
                this.fieldKeysforCardFiles[i][2] = true;
                for (let j = 0; j < this.allData.length; j++) {
                    if (this.fieldKeysforCardFiles[i][0] === this.allData[j]['DUE']) {
                        this.globalMainCard = this.fieldKeysforCardFiles[i][0];
                        if (this.allData[j]['USER_CABINET_List'].length > 0) {
                            this.flagForFirstShowSelect = true;
                            this.allDataForCurrentCabinet = this.allData[j]['USER_CABINET_List'][0];
                            this.allDataForCurrentUsercard = this.allData[j];
                        } else {
                            let str = '';
                            this.settingValuesForFieldsCabinets('Empty');
                            this.allDataForCurrentCabinet = this.allData[j]['USER_CABINET_List'];
                            this.allDataForCurrentUsercard = this.allData[j];
                            if (event !== null) {
                            str += event.target.control.id;
                            str = str.substr(4, str.length);
                            this.currentDueCard = str;
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
        if (!this.flagNoCardIndexSelected) {
            if (dataCabinetDepartment.length > 0) {
                for (let j = 0; j < dataCabinetDepartment.length; j++) {
                  selectForCabinetsName['options'].push({value: dataCabinetDepartment[j]['DUE'], title: dataCabinetDepartment[j]['CABINET_NAME']});
                  if (this.flagForFirstShowSelect) {
                    for (let i = 0; i < this.allDataForCurrentUsercard['USER_CABINET_List'].length; i++) {
                        if (this.allDataForCurrentUsercard['USER_CABINET_List'][i]['ISN_CABINET'] === dataCabinetDepartment[0]['ISN_CABINET']) {
                            this.settingValuesForFieldsCabinets(this.allDataForCurrentUsercard['USER_CABINET_List'][i]);
                            this.flagForFirstShowSelect = false;
                        }
                   }
                }
                   // this.selectOnClick(null, selectForCabinetsName.options[0]);
                }
                this.selectOnClick(null, selectForCabinetsName.options[0]);
                this.flagCurrentDataCabinetDepartment = true;
            } else {
                this.flagCurrentDataCabinetDepartment = false;
            }
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
    selectOnClick(event, dataAtTheStart) {
      this.newDataWhenChanging();
      if (dataAtTheStart !== null) {
        setTimeout(() => {
        for (let z = 0; z < this.arrayForCurrentCabinets.length; z++) {
          if (dataAtTheStart.title === this.arrayForCurrentCabinets[z][0] &&
            dataAtTheStart.value === this.arrayForCurrentCabinets[z][2]) {
                this.currentIsnCabinet = this.arrayForCurrentCabinets[z][1];
              /*  for (let i = 0; i < this.allDataForCurrentUsercard['USER_CABINET_List'].length; i++) {
                    if (this.allDataForCurrentUsercard['USER_CABINET_List'][i]['ISN_CABINET'] === this.currentIsnCabinet) {
                        console.log('Попапллллл');
                        console.log(this.allDataForCurrentUsercard['USER_CABINET_List'][i]);
                        this.settingValuesForFieldsCabinets(this.allDataForCurrentUsercard['USER_CABINET_List'][i]);
                    }
                }*/
              //  this.settingValuesForFieldsCabinets('Empty');
              //  this.settingValuesForFieldsCabinets(this.allDataForCurrentUsercard['USER_CABINET_List'][i]);
                break;
            }
        }
    }, 1000);
      } else {
      if (this.allDataForCurrentUsercard['USER_CABINET_List'].length > 0) {
       loop1:
        for (let i = 0; i < this.allDataForCurrentUsercard['USER_CABINET_List'].length; i++) {
            for (let z = 0; z < this.arrayForCurrentCabinets.length; z++) {
            if (event.target.value === this.allDataForCurrentUsercard['USER_CABINET_List'][i]['DEPARTMENT_DUE'] &&
            event.target.selectedOptions['0']['innerHTML'] === this.arrayForCurrentCabinets[z][0] &&
            this.arrayForCurrentCabinets[z][1] === this.allDataForCurrentUsercard['USER_CABINET_List'][i]['ISN_CABINET']) {
             this.currentIsnCabinet = this.allDataForCurrentUsercard['USER_CABINET_List'][i]['ISN_CABINET'];
                this.settingValuesForFieldsCabinets(this.allDataForCurrentUsercard['USER_CABINET_List'][i]);
                this.postOrMergeQuery = 'MERGE';
                break loop1;
            } else {
                if (event.target.value === this.arrayForCurrentCabinets[z][2] &&
                    event.target.selectedOptions['0']['innerHTML'] === this.arrayForCurrentCabinets[z][0] &&
                    this.allDataForCurrentUsercard['USER_CABINET_List'][i]['ISN_CABINET'] !== this.arrayForCurrentCabinets[z][1]) {
                    this.currentIsnCabinet = this.arrayForCurrentCabinets[z][1];
                    break;
                }
                this.postOrMergeQuery = 'POST';
                this.settingValuesForFieldsCabinets('Empty');
            }
          }
        }
    } else {
            for (let z = 0; z < this.arrayForCurrentCabinets.length; z++) {
               if (event.target.value === this.arrayForCurrentCabinets[z][2] &&
                event.target.selectedOptions['0']['innerHTML'] === this.arrayForCurrentCabinets[z][0]) {
                this.currentIsnCabinet = this.arrayForCurrentCabinets[z][1];
            }
        }
        this.postOrMergeQuery = 'POST';
    }
}
    }
    addCardFile() {
        this.modalCollection = this._modalSrv.show(CardFilesDirectoryModalComponent, {
            class: 'directory-modal',
            ignoreBackdropClick: true
        });
        this.modalCollection.content.closeCollection.subscribe(() => {
            this.updatePageCard();
            this.modalCollection.hide();
        });
    }
    removeCardFile() {
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            if (this.fieldKeysforCardFiles[i][0] === this.allDataForCurrentUsercard['DUE']) {
                if (this.fieldKeysforCardFiles[i][3] === true) {
                    this.flagNoMainCard = true;
                    this.flagCurrentDataCabinetDepartment = false;
                    this.flagNoCardIndexSelected = true;
                }
                this.fieldKeysforCardFiles[i][4] = false;
              //  this.newData.rec[this.fieldKeysforCardFiles[i][0]] = 'NO';
               this.newData2[this.fieldKeysforCardFiles[i][0]] = false;
               if (this.fieldKeysforCardFiles[i][3] === true || this.flagNoMainCard) {
                this.flagCurrentDataCabinetDepartment = false;
                this.flagNoCardIndexSelected = true;
                this.selectedNode('No main card', null);
               } else {
                this.selectedNode(this.fieldKeysforCardFiles[this.globalIndexMainCard][1], null);
               }
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.subscribeChangeForm();
                this.btnDisabled = false;
                break;
            }
        }
    }
}
