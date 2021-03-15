import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OTHER_USER_REESTR_CB } from '../../shared-user-param/consts/other.consts';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { Subject } from 'rxjs';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { PipRX, DOCGROUP_CL, DEPARTMENT } from 'eos-rest';
import { NodeDocsTree } from '../../../shared/list-docs-tree/node-docs-tree';
import { INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { IOpenClassifParams } from '../../../../eos-common/interfaces';
import { WaitClassifService } from '../../../../app/services/waitClassif.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AddGrifComponent } from './addGrif/addGrif.component';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { IUserSettingsModes } from 'eos-user-params/shared/intrfaces/user-params.interfaces';
// import {PARM_ERROR_SEND_FROM} from '../../shared-user-param/consts/eos-user-params.const';
@Component({
    selector: 'eos-user-param-reestr-cb',
    templateUrl: 'user-param-reestr-cb.component.html',
    providers: [FormHelperService],
})

export class UserParamReestrCBComponent implements OnDestroy, OnInit {
    @Input() defaultValues;
    @Input() defaultUser: any;
    @Input() errorHidden: boolean;
    @Input() appMode: IUserSettingsModes;
    @Input() isCurrentSettings?: boolean;

    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() pushIncrementError: EventEmitter<any> = new EventEmitter<any>();
    public createUserModal: BsModalRef;
    public form: FormGroup;
    public inputs: any;
    public flagBacground: boolean = false;
    public list: NodeDocsTree[] = [];
    public listSecur: string = '';
    public listDep: NodeDocsTree[] = [];
    public secureData = '';
    public saveReestrSecur;
    public saveReestrDocgroup;
    public saveReestrDep;
    private listDocGroup: NodeDocsTree[] = [];
    private _ngUnsebscribe: Subject<any> = new Subject();
    private allData: any;
    private paramDocDefault: string;
    private prepareData: any;
    private prepareInputs: any;
    private mapChanges = new Map();
    private defoltInputs: any;
    private flagEdit: boolean = false;
    constructor(
        private _userSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private remaster: RemasterService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _waitClassifSrv: WaitClassifService,
        private _modalSrv: BsModalService,
        private _errorSrv: ErrorHelperServices,
    ) {
        this.remaster.submitEmit.subscribe(() => {
            this.submit();
        });
        this.remaster.cancelEmit.subscribe(() => {
            this.cancel();
        });
        this.remaster.defaultEmit.subscribe((tab) => {
            if (tab === 2) {
                this.default();
            }
        });
        this.remaster.editEmit.subscribe(() => {
            this.flagEdit = true;
            this.editMode();
        });
    }
    ngOnDestroy() {
        this._ngUnsebscribe.next();
        this._ngUnsebscribe.complete();
    }
    ngOnInit() {
        const reqs = [];
        if (this.defaultUser) {
            this.paramDocDefault = String(this.defaultUser['REESTR_RESTRACTION_DOCGROUP']).replace(/,/g, '||');
            reqs.push(this.getDocGroupName(this.paramDocDefault, true));
            Promise.all(reqs).then( result => {
                if (result[0].length > 0) {
                    this.getListDoc(result[0]);
                }
                this.allData = this.defaultUser;
                this.inint();
            })
            .catch(err => {
                this._errorSrv.errorHandler(err);
            });
        } else {
            const paramsDoc = String(this._userSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/g, '||');
            const paramsDep = String(this._userSrv.hashUserContext['REESTR_RESTRACTION_DEPARTMENT']).replace(/,/g, '||');
            this.secureData =  this.updateSecur(this._userSrv.hashUserContext['REESTR_CB_SECUR']);
            reqs.push(this.getDocGroupName(paramsDoc, true));
            reqs.push(this.getDepName(paramsDep, true));
            Promise.all(reqs).then( result => {
                if (result[0].length > 0) {
                    this.getListDoc(result[0]);
                }
                if (result[1].length > 0) {
                    result[1].forEach(elem => {
                        const cfg: INodeDocsTreeCfg = {
                            due: elem.DUE,
                            label: elem.CLASSIF_NAME,
                            allowed: true,
                            data: elem,
                        };
                        this.listDep.push(new NodeDocsTree(cfg));
                    });
                }
                if (this.secureData.split(',')[1]) {
                    this.listSecur = '' + this.secureData.split(',')[1];
                }
                this.allData = this._userSrv.hashUserContext;
                this.inint();
            })
            .catch(err => {
                this._errorSrv.errorHandler(err);
            });
        }
    }
    updateSecur(str: string) {
        if (str) {
            let answer = str.replace(/isn\(/g, '');
            answer = answer.replace(/name\(/g, ',');
            answer = answer.replace(/\)/g, '');
            if (answer === ',') {
                answer = '';
            }
            return answer;
        }
        return '';
    }
    inint() {
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_REESTR_CB.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_REESTR_CB.fields);
        this.inputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.form = this.inpSrv.toFormGroup(this.inputs);
        this.emitIncrementError();
        this.editMode();
        this.formSubscriber();
    }
    formSubscriber() {
        this.form.valueChanges.subscribe(data => {
            this.checkTouch(data);
        });
    }

    checkTouch(data) {
        let countError = 0;
        Object.keys(data).forEach(key => {
            if (this.inputs[key].value !== data[key]) {
                countError += 1;
                this.mapChanges.set(key.substring(4), data[key]);
            } else {
                if (this.mapChanges.has(key.substring(4))) {
                    this.mapChanges.delete(key.substring(4));
                }
            }
        });
        if (countError > 0 || this.mapChanges.size) {
            this.pushChange.emit([{
                btn: true,
                data: this.mapChanges
            }, this.form.value]);
        } else {
            this.pushChange.emit(false);
        }
        this.emitIncrementError();
    }
   checkIncrement() {
        const value = this.form.controls['rec.REESTR_DATE_INTERVAL'].valid;
        const value1 = this.form.controls['rec.REESTR_COPY_COUNT'].valid;
        if (!value || !value1) {
            return false;
        } else {
            return true;
        }
    }

    emitIncrementError() {
         if (!this.checkIncrement()) {
            this.pushIncrementError.emit(false);
        }   else {
            this.pushIncrementError.emit(true);
        }
    }
    prepFormForSave() {
        Object.keys(this.inputs).forEach((key) => {
            const value = this.form.controls[key].value;
            this.inputs[key].value = value;
        });
    }

    prepFormCancel(input, flag) {
        Object.keys(input).forEach((key) => {
            const val = input[key].value;
            this.form.controls[key].patchValue(val, { emitEvent: flag });
        });
    }
    editMode() {
        if (this.flagEdit || this.isCurrentSettings) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }
    updateInfo() {
        this.saveReestrSecur = this.secureData;
        this.saveReestrDocgroup = String(this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].value);
        this.saveReestrDep = String(this.form.controls['rec.REESTR_RESTRACTION_DEPARTMENT'].value);
    }
    submit() {
        this.updateInfo();
        this.mapChanges.clear();
        this.prepFormForSave();
        this.flagEdit = false;
        this.editMode();
    }
    default(event?) {
        const reqs = [];
        this.list = [];
        this.listDep = [];
        this.listSecur = '';
        this.listDocGroup = [];
        this.prepareData = {};
        this.prepareInputs = {};
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_REESTR_CB.fields, this.defaultValues);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_REESTR_CB.fields);
        this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.paramDocDefault = String(this.defaultValues['REESTR_RESTRACTION_DOCGROUP']).replace(/,/g, '||');
        const paramsDep = String(this.defaultValues['REESTR_RESTRACTION_DEPARTMENT']).replace(/,/g, '||');
        this.secureData = this.updateSecur(this.defaultValues['REESTR_CB_SECUR']);
        reqs.push(this.getDocGroupName(this.paramDocDefault, true));
        reqs.push(this.getDepName(paramsDep, true));
        Promise.all(reqs).then( result => {
            if (result[0].length > 0) {
                this.getListDoc(result[0]);
            }
            if (result[1].length > 0) {
                result[1].forEach(elem => {
                    const cfg: INodeDocsTreeCfg = {
                        due: elem.DUE,
                        label: elem.CLASSIF_NAME,
                        allowed: true,
                        data: elem,
                    };
                    this.listDep.push(new NodeDocsTree(cfg));
                });
            }
            this.allData = this.defaultValues;
            this.prepFormCancel(this.defoltInputs, true);
            /* this.inint(); */
        })
        .catch(err => {
            this._errorSrv.errorHandler(err);
        });
    }
    cancel($event?) {
        const reqs = [];
        this.flagEdit = false;
        this.listDep = [];
        this.listSecur = '';
        this.list = [];
        this.listDocGroup = [];
        let paramsDoc;
        let paramsDep = String(this._userSrv.hashUserContext['REESTR_RESTRACTION_DEPARTMENT']).replace(/,/g, '||');
        if (this.defaultUser) {
            paramsDoc = this.paramDocDefault;
        } else {
            paramsDoc = String(this._userSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/g, '||');
        }
        if (this.saveReestrDocgroup !== undefined) {
            paramsDoc = this.saveReestrDocgroup.replace(/,/g, '||');
        }
        if (this.saveReestrDep !== undefined) {
            paramsDep = this.saveReestrDep.replace(/,/g, '||');
        }
        this.secureData = this.saveReestrSecur !== undefined ? this.saveReestrSecur : this.updateSecur(this._userSrv.hashUserContext['REESTR_CB_SECUR']);
        reqs.push(this.getDocGroupName(paramsDoc, true));
        reqs.push(this.getDepName(paramsDep, true));
        Promise.all(reqs).then( result => {
            if (result[0].length > 0) {
                this.getListDoc(result[0]);
            }
            if (result[1].length > 0) {
                result[1].forEach(elem => {
                    const cfg: INodeDocsTreeCfg = {
                        due: elem.DUE,
                        label: elem.CLASSIF_NAME,
                        allowed: true,
                        data: elem,
                    };
                    this.listDep.push(new NodeDocsTree(cfg));
                });
            }
            if (this.secureData.split(',')[1]) {
                this.listSecur = '' + this.secureData.split(',')[1];
            }
            this.prepFormCancel(this.inputs, true);
            this.mapChanges.clear();
            this.editMode();
        })
        .catch(err => {
            this._errorSrv.errorHandler(err);
        });
    }
    deleteDirectory() {
        this.list = [];
        this.listDocGroup = [];
        this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].patchValue('');
    }
    deleteDep() {
        this.listDep = [];
        this.form.controls['rec.REESTR_RESTRACTION_DEPARTMENT'].patchValue('');
    }
    deleteSecure() {
        this.listSecur = '';
        this.secureData = '';
        this.form.controls['rec.REESTR_CB_SECUR'].patchValue('');
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
                this._msg.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Выберите значение',
                });
                throw new Error();
            } else {
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
                        } else {
                            this._msg.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение',
                                msg: 'Группа ' + doc.CLASSIF_NAME + ' уже добавлена',
                            });
                        }
                    });
                    this._createStructure(this.listDocGroup);
                    this.PatchValForm();
                })
                .catch(err => {
                    this._errorSrv.errorHandler(err);
                });
            }
        }).catch(error => {
            this.flagBacground = false;
        });
    }
    selectfromTheDep() {
        this.flagBacground = true;
        const params: IOpenClassifParams = {
            classif: 'DEPARTMENT',
            selectMulty: true,
            selectLeafs: false,
            selectNodes: true,
            return_due: true,
           /*  selected: '0.2SH.', */
        };
        this._waitClassifSrv.openClassif(params).then(isn => {
            this.flagBacground = false;
            if (String(isn) === '') {
                this._msg.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение',
                    msg: 'Выберите значение',
                });
                throw new Error();
            } else {
                this.getDepName(String(isn)).then((res: DEPARTMENT[]) => {
                    res.forEach(elem => {
                        if (!this.checkAddNode(this.listDep, elem.DUE)) {
                            const cfg: INodeDocsTreeCfg = {
                                due: elem.DUE,
                                label: elem.CLASSIF_NAME,
                                allowed: true,
                                data: elem,
                            };
                            this.listDep.push(new NodeDocsTree(cfg));
                        } else {
                            this._msg.addNewMessage({
                                type: 'warning',
                                title: 'Предупреждение',
                                msg: 'Подразделение ' + elem.CLASSIF_NAME + ' уже добавлено',
                            });
                        }
                    });
                    this.PatchValFormSecureDep();
                });
            }
        }).catch(error => {
            if (error) {
                this._errorSrv.errorHandler(error);
            }
            this.flagBacground = false;
        });
    }
    selectfromTheSecure() {
     this.createUserModal = this._modalSrv.show(AddGrifComponent, {
        class: 'param-create-user',
        ignoreBackdropClick: true,
        animated: false,
        show: false,
    });
    if (this.secureData === ',') {
        this.secureData = '';
    }
    this.createUserModal.content.data = this.secureData;
    this.createUserModal.content.closedModal.subscribe((data) => {
        if (data) {
            this.secureData = data[0].join('|') + ',' + data[1].join('; ');
            if (this.secureData === ',') {
                this.secureData = '';
            }
            this.PatchValFormSecure('isn(' + data[0].join('|') + ')name(' + data[1].join('; ') + ')' );
            this.listSecur = data[1].join('; ');
        }
        setTimeout(() => {
            this.createUserModal.hide();
        });
    });
    }
    PatchValForm() {
        const new_ISN = this.list.reduce((accumulator, current: NodeDocsTree) => {
            return accumulator += current.data['ISN_NODE'] + ',';
        }, '');
        const substrIsn = new_ISN.substr(0, new_ISN.length - 1);
        this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].patchValue(substrIsn);
    }
    PatchValFormSecure(str: string) {
        this.form.controls['rec.REESTR_CB_SECUR'].patchValue(str);
    }
    PatchValFormSecureDep() {
        const new_ISN = this.listDep.reduce((accumulator, current: NodeDocsTree) => {
            return accumulator += current.data['ISN_NODE'] + ',';
        }, '');
        const substrIsn = new_ISN.substr(0, new_ISN.length - 1);
        this.form.controls['rec.REESTR_RESTRACTION_DEPARTMENT'].patchValue(substrIsn);
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
        } else {
            this.list.push(node);
        }
    }
    private _findMinLength(liNodes: NodeDocsTree[]): number {
        let min = liNodes[0].link.length;
        liNodes.forEach(node => {
            const count = node.link.length;
            if (count < min) {
                min = count;
            }
        });
        return min;
    }
    private checkAddNode(list: any[], due: string): boolean {
        return list.some((elem: NodeDocsTree) => {
            return elem.DUE === due;
        });
    }
    private checkAddedTree(due: string): boolean {
        return this.listDocGroup.some((list: NodeDocsTree) => {
            return list.DUE === due;
        });
    }
    private getDocGroupName(param: string, flag?: boolean): Promise<any> {
        let crit = '';
        if (param !== 'null' && param !== '') {
            flag ? crit = 'ISN_NODE' : crit = 'DUE';
            const query = {
                DOCGROUP_CL: {
                    criteries: {
                        [crit]: param
                    }
                }
            };
            return this._pipRx.read(query);
        }
        return Promise.resolve([]);
    }
    private getDepName(param: string, flag?: boolean): Promise<any> {
        let crit = '';
        if (param !== 'null' && param !== '') {
            flag ? crit = 'ISN_NODE' : crit = 'DUE';
            const query = {
                DEPARTMENT: {
                    criteries: {
                        [crit]: param
                    }
                }
            };
            return this._pipRx.read(query);
        }
        return Promise.resolve([]);
    }

}
