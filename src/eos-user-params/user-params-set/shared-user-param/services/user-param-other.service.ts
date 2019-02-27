import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { OTHER_USER } from '../consts/other.consts';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { IOpenClassifParams } from 'eos-common/interfaces';
import { DOCGROUP_CL, DEPARTMENT } from 'eos-rest';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import {PARM_SUCCESS_SAVE, PARM_ERROR_SEND_FROM, PARM_CANCEL_CHANGE } from '../consts/eos-user-params.const';
import { INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
@Injectable()
export class UserParamOtherSrv extends BaseUserSrv {
    readonly fieldGroups: string[] = ['Пересылка РК', 'Адресаты документа', 'Реестр передачи документов', 'Шаблоны'];
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
    readonly constPrepareForm = ['RS_OUTER_DEFAULT_DELIVERY', 'REESTR_RESTRACTION_DOCGROUP', 'ADDR_EXPEDITION', 'REESTR_COPY_COUNT', 'REESTR_DATE_INTERVAL'];
    currTab = 0;
    dataAttachDb;
    inputAttach;
    prepInputsAttach;
    initShablony: Array<any>;
    saveDefaultValue: Array<any>;
    prepDataAttach = {rec: {}};
    flagBacground: boolean = false;
    listDocGroup: NodeDocsTree[] = [];
    list: NodeDocsTree[] = [];
    link = this._userParamsSetSrv.userContextId;
    selfLink: string;
    editFlag: boolean = false;
    countError = 0;
    newDataForSave = new Map();
    sendFrom: string = '';
    saveValueSendForm: string = '';
    isLoading: boolean;

    constructor( injector: Injector) {
        super(injector, OTHER_USER);
        this.isLoading = true;
        this.selfLink = this._router.url.split('?')[0];
        const paramsDoc = String(this._userParamsSetSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/g, '||');
        const ADDR_EXP = String(this._userParamsSetSrv.hashUserContext['ADDR_EXPEDITION']);
        Promise.all([this.getDocGroupName(paramsDoc, true), this.getList(), this.getDefaultsValues(), this.getDepartMentName(ADDR_EXP, true)]).then(result => {
            OTHER_USER.fields.map(field => {
                if (field.key === 'RS_OUTER_DEFAULT_DELIVERY' && field.options.length === 1) {
                    result[1].forEach(item => {
                        field.options.push(
                            {value: item.ISN_LCLASSIF, title: item.CLASSIF_NAME},
                        );
                    });
                }
                return field;
            });
            if (result[0].length > 0) {
                this.getListDoc(result[0]);
            }

            if (result[3].length > 0) {
                this.saveValueSendForm = (result[3][0] as DEPARTMENT).CLASSIF_NAME;
                this.sendFrom = (result[3][0] as DEPARTMENT).CLASSIF_NAME;
            }
            this.init();
            this.initShablony = result[2];
            this.saveDefaultValue = ( result[2] as Array<any>).slice();
        }).catch(error => {
            this.isLoading = false;
        });
    }
    hideToolTip() {
        const element = document.querySelector('.tooltip');
        if (element) {
            element.setAttribute('style', 'display: none');
        }
    }
    init() {
             this.prepareDataParam();
              const allData = this._userParamsSetSrv.hashUserContext;
              this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
              this.prepareData = this.convData(this.sortedData);
              this.inputs = this.getInputs();
              this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
              this.disableForEditAllForm(this.editFlag);
              // меняем значения на одинаковые для слижения за изменениями формы
              this.changeInpetsValue(this.inputs);
              this.checngeFormValue();
              this.subscribeChangeForm();
              this.isLoading = false;
      }
      getInputs() {
        const dataInput = {rec: {}};
        Object.keys(this.prepareData.rec).forEach(key => {
            if ((this._fieldsType[key] === 'boolean' || this._fieldsType[key] === 'toggle') && !this.prepInputs.rec[key].formatDbBinary) {
                if (this.prepareData.rec[key] === 'YES' || this.prepareData.rec[key] === '1') {
                    dataInput.rec[key] = true;
                } else {
                    dataInput.rec[key] = false;
                }
            } else {
                dataInput.rec[key] = this.prepareData.rec[key];
            }
        });
        return this.dataSrv.getInputs(this.prepInputs, dataInput);
    }
      changeInpetsValue(iputs) {
        this.constPrepareForm.forEach(key => {
            const value = String(iputs['rec.' + key].value);
            if (value === 'null' || value === 'undefined') {
                iputs['rec.' + key].value = '';
              }
        });
        }

        checngeFormValue() {
            this.constPrepareForm.forEach(key => {
                const value = String(this.form.controls['rec.' + key].value);
                if (value === 'null' || value === 'undefined') {
                    this.form.controls['rec.' + key].patchValue('', {eventEmit: false});
                  }
            });
      }


      subscribeChangeForm() {
        let count_error = 0;
        this.subscriptions.push(
            this.form.valueChanges
                .debounceTime(200)
                .subscribe(newVal => {
                    Object.keys(newVal).forEach(val => {
                     if (!this.getFactValueFuck(newVal[val], val)) {
                         this.setNewData(newVal, val, true);
                         count_error += 1;
                     } else {
                        this.setNewData(newVal, val, false);
                     }
                    });
                   if (count_error > 0) {
                        this.formChanged.emit(true);
                        this.isChangeForm = true;
                    }else {
                        this.formChanged.emit(false);
                        this.isChangeForm = false;
                    }
                    if (!this.form.controls['rec.REESTR_DATE_INTERVAL'].valid || !this.form.controls['rec.REESTR_COPY_COUNT'].valid) {
                        this.formChanged.emit(false);
                        this.isChangeForm = false;
                    }
                    count_error = 0;
            })
        );
    }

    setNewData(newValObj, newValue, flag) {
        if (flag) {
            this.newDataForSave.set(newValue, newValObj[newValue]);
        }   else {
           if (this.newDataForSave.has(newValue)) {
                this.newDataForSave.delete(newValue);
           }
        }
    }
    getFactValueFuck(newValue: any, val: string): boolean {
        const  oldValue = this.inputs[val].value;
        return oldValue !== newValue ? false : true;
    }
    getListDoc(list: DOCGROUP_CL[]) {
        list.forEach((item: DOCGROUP_CL) => {
            const cfg: INodeDocsTreeCfg = {
                due: item.DUE,
                label: item.CLASSIF_NAME,
                allowed: true,
                data: item,
            };
            this.listDocGroup.push(new NodeDocsTree(cfg));
        });
        this._createStructure(this.listDocGroup);
    }
    deleteDirectory() {
        this.list = [];
        this.listDocGroup = [];
        this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].patchValue('');
    }
    getList(): Promise<any> {
         const query = {
            DELIVERY_CL: ALL_ROWS
         };
       return  this.userParamApiSrv.getData(query);
    }

    getObjQueryInputsFieldForDefaultAll() {
        return {
            [this.constUserParam.apiInstance]: {
                    criteries: {
                        ISN_USER_OWNER: '-99'
                }
            }
        };
    }
    getDefaultsValues(): Promise<any> {
    const query = this.getObjQueryInputsFieldForDefaultAll();
      return  this.getData(query)
        .then(defaultValue => {
         return defaultValue.splice(-33);
        }).then(result => {
            const arrayDateMain = [];
            let prepareObj = {};
            result.forEach(el => {
                let keyForm = 'rec.';
                prepareObj['PARM_NAME'] = el['PARM_NAME'];
                prepareObj['PARM_VALUE'] = el['PARM_VALUE'];
                prepareObj['keyForm'] = keyForm + el['PARM_NAME'];
                arrayDateMain.push(prepareObj);
                keyForm = 'rec.';
                prepareObj = {};
            });
            return arrayDateMain;
        });
    }
    edit(event) {
        this.editFlag = event;
        this.disableForEditAllForm(event);
    }

    disableForEditAllForm(event) {
        Object.keys(this.inputs).forEach(key => {
            if (!event) {
                this.form.controls[key].disable({onlySelf: true, emitEvent: false});
            }   else {
                this.form.controls[key].enable({onlySelf: true, emitEvent: false});
            }
        });
    }
    submit(event?) {
        this.isLoading = true;
        this.formChanged.emit(false);
        this.isChangeForm = false;
        this.userParamApiSrv
                .setData(this.createObjRequest())
                .then(data => {
                    this.msgSrv.addNewMessage(PARM_SUCCESS_SAVE);
                    const userId = this._userParamsSetSrv.userContextId;
                    this._userParamsSetSrv.getUserIsn(String(userId));
                    this.saveValueSendForm = this.sendFrom;
                    this.isLoading = false;
                })
                .catch(data => console.log(data));
    }
    upStateInputs(val) {
        this.inputs[val[0]].value = val[1];
    }

    createObjRequest(): any[] {
    const req = [];
    const userId = this._userParamsSetSrv.userContextId;
    Array.from(this.newDataForSave).forEach(val => {
        let parn_Val;
        this.upStateInputs(val);
        if (typeof val[1] === 'boolean') {
            val[1] === false ? parn_Val = 'NO' : parn_Val = 'YES';
        } else {
            String(val[1]) === 'null' ? parn_Val = '' : parn_Val = val[1];
        }
        req.push({
                method: 'MERGE',
                requestUri: `USER_CL(${userId})/USER_PARMS_List(\'${userId} ${val[0].substr(4)}\')`,
                data: {
                    PARM_VALUE: `${parn_Val}`
            }
        });
      });
        return req;
    }
    cancellation(event?) {
        if (this.isChangeForm) {
           this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
           this.sendFrom = this.saveValueSendForm;
           const paramsDoc = String(this._userParamsSetSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/, '||');
           this.list = [];
           this.listDocGroup = [];
           this.getDocGroupName(paramsDoc, true).then(result => {
                if (result.length > 0) {
                    this.getListDoc(result);
                }
           });
        }
        this.fillFormDefaultValues(this.inputs);
        this.editFlag = event;
        this.disableForEditAllForm(event);
    }

    default(event?) {
        const D = this.prepInputs._list.slice();
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(D.splice(0, 17));
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data.concat(this.saveDefaultValue));
                const newInputsForDefaultsValues = this.getInputs();
                this.changeInpetsValue(newInputsForDefaultsValues);
                this.fillFormDefaultValues(newInputsForDefaultsValues);
                this.sendFrom = '';
                this.list = [];
                this.listDocGroup = [];
                // this.inputs = this.getInputs();
                // this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                // this.formChanged.emit(changed);
                // this.isChangeForm = changed;
                // this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
    }
    fillFormDefaultValues(inputsForDefault) {
        Object.keys(inputsForDefault).forEach(key => {
            this.form.controls[key].patchValue(inputsForDefault[key].value);
        });
    }

    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    setTab(i: number) {
        this.currTab = i;
    }
    getObjQueryInputsField2(inputs: Array<any>) {
        return {
        [this.constUserParam.apiInstance]: {
            criteries: {
                PARM_NAME: inputs.join('||'),
                ISN_USER_OWNER: '3611'
            }
          }
       };
    }

    convData(data: Object) {
        const d = {};
     for (const key of Object.keys(data)) {
        d[key] = data[key];
     }
        return { rec: d };
    }
    selectfromTheDirectory() {
        this.flagBacground = true;
        const params: IOpenClassifParams = {
            classif: 'DOCGROUP_CL',
            selectMulty: true,
            selectLeafs: false,
            selectNodes: true,
            return_due: true,
        };

        this._waitClassifSrv.openClassif(params).then(isn => {
            this.flagBacground = false;
            if (String(isn) === '') {
                this.msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Выберите значение',
                    dismissOnTimeout: 5000,
                });
                throw new Error();
            }   else {
                this.getDocGroupName(String(isn)).then((res: DOCGROUP_CL[]) => {
                    res.forEach((doc: DOCGROUP_CL) => {
                        if (!this.checkAddedTree(doc.DUE)) {
                            const cfg: INodeDocsTreeCfg = {
                                due: doc.DUE,
                                label: doc.CLASSIF_NAME,
                                allowed: true,
                                data: doc,
                            };
                            this.listDocGroup.push(new NodeDocsTree(cfg));
                        }
                    });
                    this._createStructure(this.listDocGroup);
                    this.PatchValForm();
                });
            }
        }).catch(error => {
            this.flagBacground = false;
        });
    }

    PatchValForm() {
        const new_ISN =   this.list.reduce((accumulator, current: NodeDocsTree) => {
            return accumulator += current.data['ISN_NODE'] + ',';
        }, '');
        const substrIsn = new_ISN.substr(0, new_ISN.length - 1);
        this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].patchValue(substrIsn);
    }

    sendFromChoose() {
        this.flagBacground = true;
        const params: IOpenClassifParams = {
            classif: 'DEPARTMENT',
            selectMulty: false,
            selectLeafs: false,
            selectNodes: true,
            return_due: true
        };
        this._waitClassifSrv.openClassif(params).then(isn => {
            this.flagBacground = false;
            this.getDepartMentName(String(isn)).then((res: DEPARTMENT[]) => {
                this.setFillSendFrom(res);
            });
        }).catch(error => {
            this.flagBacground = false;
        });
    }

    setFillSendFrom(res: DEPARTMENT[]) {
        if (res.length > 0) {
            const depart = res[0];
            if (depart.EXPEDITION_FLAG <= 0) {
                this.msgSrv.addNewMessage(PARM_ERROR_SEND_FROM);
            }   else {
                this.sendFrom = depart.CLASSIF_NAME;
                this.form.controls['rec.ADDR_EXPEDITION'].patchValue(depart.DUE);
            }
        }
    }
    clearSendFrom() {
        const val =   this.form.controls['rec.ADDR_EXPEDITION'].value;
        if (val !== '' && String(val) !== 'null') {
            this.sendFrom = '';
            this.form.controls['rec.ADDR_EXPEDITION'].patchValue('');
        }

        this.sendFrom = '';
    }
    close(event) {
        this._router.navigate(['user_param', JSON.parse(sessionStorage.getItem('lastNodeDue'))]);
    }

    private checkAddedTree(due: string): boolean {
      return  this.listDocGroup.some((list: NodeDocsTree) => {
            return list.DUE === due;
        });
    }
    private _createStructure(liNodes: NodeDocsTree[]) {
        this.list = [];
        const minLength = this._findMinLength(liNodes);
        liNodes.forEach((node: NodeDocsTree) => {
            node.children = [];
            node.parent = null;
            if (node.link.length === minLength) {
                this.list.push(node);
            } else {
                this._findParent(node);
            }
        });
    }
    private _findParent(node: NodeDocsTree) {
        let parent: NodeDocsTree = null;
        let index = node.link.length - 2;
        while (!parent && (index >= 0)) {
            const parentName = node.link[index];
            this.listDocGroup.some((n: NodeDocsTree) => {
                if (n.link.length - 1 === index && n.link[index] === parentName) {
                    parent = n;
                    return true;
                }
            });
            index--;
        }
        if (parent) {
            parent.addChildren(node);
            node.parent = parent;
        }   else {
            this.list.push(node);
        }
    }
    private _findMinLength (liNodes: NodeDocsTree[]): number {
        let min = liNodes[0].link.length;
        liNodes.forEach(node => {
            const count = node.link.length;
            if (count < min) {
                min = count;
            }
        });
        return min;
    }
  private  getDocGroupName(param: string, flag?: boolean): Promise<any> {
      let crit = '';
      if (param !== 'null' && param !== '') {
      flag ? crit = 'ISN_NODE' : crit = 'DUE';
          const query = {
              DOCGROUP_CL: {
                  criteries: {
                      [crit]:  param
                  }
              }
          };
          return  this.userParamApiSrv.getData(query);
      }
      return Promise.resolve([]);
    }

    private  getDepartMentName(param: string, flagWhatToChoose?: boolean): Promise<any> {
        if (param !== 'null' && param !== '') {
            const query = {
                DEPARTMENT: [param]
            };
            return  this.userParamApiSrv.getData(query);
        }
        return Promise.resolve([4]);
      }

}
