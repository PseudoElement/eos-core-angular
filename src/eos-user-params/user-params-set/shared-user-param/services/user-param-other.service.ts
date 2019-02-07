import { Injectable, Injector } from '@angular/core';
import { BaseUserSrv } from './base-user.service';
import { OTHER_USER } from '../consts/other.consts';
import { E_FIELD_TYPE } from '../../../shared/intrfaces/user-params.interfaces';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { IOpenClassifParams } from 'eos-common/interfaces';
import { DOCGROUP_CL } from 'eos-rest';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { PARM_CANCEL_CHANGE } from '../consts/eos-user-params.const';
@Injectable()
export class UserParamOtherSrv extends BaseUserSrv {
    readonly fieldGroups: string[] = ['Пересылка РК', 'Адресаты документа', 'Реестр передачи документов', 'Шаблоны'];
    readonly fieldTemplates: string[] = ['Имя шаблона', 'Значение по умолчанию', 'Текущее значение'];
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
    countError = 0;
    private fieldsType = {};
    constructor( injector: Injector) {
        super(injector, OTHER_USER);
        const paramsDoc = String(this._userParamsSetSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/, '||');
        Promise.all([this.getDocGroupName(paramsDoc), this.getList(), this.getDefaultsValues()]).then(result => {
            OTHER_USER.fields.map(field => {
                if (field.key === 'RS_OUTER_DEFAULT_DELIVERY' && field.options.length === 0) {
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
            this.init();
            this.initShablony = result[2];
            this.saveDefaultValue = ( result[2] as Array<any>).slice();
        }).catch(error => {
            console.log(error);
        });
    }

    init() {
        this.prepareDataParam();
              const allData = this._userParamsSetSrv.hashUserContext;
              this.sortedData = this.linearSearchKeyForData(this.constUserParam.fields, allData);
              this.prepareData = this.convData(this.sortedData);
              this.prepareData.rec['REESTR_RESTRACTION_DOCGROUP'] = '';
              this.prepareData.rec['RS_OUTER_DEFAULT_DELIVERY'] = 'wewrwer';
              this.inputs = this.getInputs();
              console.log(this.prepareData);
              console.log(this.inputs);
              this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
              console.log(this.form);
              this.subscribeChangeForm();
      }
      changeInpetsValue() {
          if (this.inputs['rec.RS_OUTER_DEFAULT_DELIVERY'] === (null || undefined)) {
            this.inputs['rec.RS_OUTER_DEFAULT_DELIVERY'] = '';
          }
      }

      subscribeChangeForm() {
        let count_error = 0;
        this.subscriptions.push(
            this.form.valueChanges
                .debounceTime(200)
                .subscribe(newVal => {
                    Object.keys(newVal).forEach(val => {
                     if (newVal[val] !== this.prepareData.rec[val.substr(4)]) {
                        //  const val1 = newVal[val];
                        //  const val2 = this.getFactValueFuck(val1, this.prepareData.rec[val.substr(4)]);
                        //  if (val1 !== val2) {
                        //      console.log(val);
                        //      console.log(newVal[val] + '' + this.prepareData.rec[val.substr(4)]);
                        //      console.log(val1 + '' + val2 );
                        //         count_error += 1;
                        //  }
                     }
                    });
                   if (count_error > 0) {
                        this.formChanged.emit(true);
                        this.isChangeForm = true;
                    }else {
                        this.formChanged.emit(false);
                        this.isChangeForm = false;
                    }
                    count_error = 0;
                  console.log(this.inputs);
                    console.log(this.form);
            })
        );
    }
    getFactValueFuck(val1, val2) {
       if (typeof val1 === 'boolean') {
          if (typeof val2 === 'string') {
              if (val2 === 'YES') {
                  return true;
              }
              if (val2 === 'NO') {
                  return false;
              }
          }
          if (typeof val2 === 'object') {
              return false;
          }
          return val2;
       }
      return val2;
    }
    getListDoc(list: DOCGROUP_CL[]) {
        list.forEach((item: DOCGROUP_CL) => {
            this.listDocGroup.push(new NodeDocsTree(item.DUE, item.CLASSIF_NAME, true, item));
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

    cancel() {
        if (this.isChangeForm) {
           this.msgSrv.addNewMessage(PARM_CANCEL_CHANGE);
           this.isChangeForm = false;
           this.formChanged.emit(false);
           this.ngOnDestroy();
           const paramsDoc = String(this._userParamsSetSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/, '||');
           this.getDocGroupName(paramsDoc).then(result => {
            if (result.length > 0) {
                this.getListDoc(result);
            }
           });
           this.init();
        }
    }

    default() {
        const changed = true;
        const D = this.prepInputs._list.slice();
        this.queryObjForDefault = this.getObjQueryInputsFieldForDefault(D.splice(0, 17));
        return this.getData(this.queryObjForDefault).then(data => {
                this.prepareData = this.convDataForDefault(data.concat(this.saveDefaultValue));
                this.inputs = this.getInputs();
                this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
                this.formChanged.emit(changed);
                this.isChangeForm = changed;
                this.list = [];
                this.listDocGroup = [];
                this.subscribeChangeForm();
            })
            .catch(err => {
                throw err;
            });
    }

    getInputAttach() {
        return this.dataSrv.getInputs(this.prepInputsAttach, this.prepDataAttach);
    }
    setTab(i: number) {
        this.currTab = i;
    }
    prepareDataParam() {
        this.prepInputs = this.getObjectInputFields(this.constUserParam.fields);
        this.queryObj = this.getObjQueryInputsField2(this.prepInputs._list);
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

    getObjectInputFields(fields) {
        const inputs: any = { _list: [], rec: {} };
        fields.forEach(field => {
            this.fieldsType[field.key] = field.type;
            inputs._list.push(field.key);
            inputs.rec[field.key] = {
                title: field.title,
                type: E_FIELD_TYPE[field.type],
                foreignKey: field.key,
                pattern: field.pattern,
                length: field.length,
                options: field.options,
                readonly: !!field.readonly,
                formatDbBinary: !!field.formatDbBinary
            };
        });
        return inputs;
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
        };
        this._waitClassifSrv.openClassif(params).then(isn => {
            this.flagBacground = false;
            this.getDocGroupName(String(isn)).then((res: DOCGROUP_CL[]) => {
                res.forEach((doc: DOCGROUP_CL) => {
                    if (!this.checkAddedTree(doc.DUE)) {
                        this.listDocGroup.push(new NodeDocsTree(doc.DUE, doc.CLASSIF_NAME, true, doc));
                    }
                });
                this._createStructure(this.listDocGroup);
                this.PatchValForm();
            });
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
  private  getDocGroupName(param: string): Promise<any> {
      if (param !== 'null' && param !== '') {
          const query = {
              DOCGROUP_CL: {
                  criteries: {
                      ISN_NODE:  param
                  }
              }
          };
          return  this.userParamApiSrv.getData(query);
      }
      return Promise.resolve([]);
    }

}
