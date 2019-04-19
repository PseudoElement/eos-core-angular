import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OTHER_USER_REESTR } from '../../shared-user-param/consts/other.consts';
import { UserParamsService } from '../../../shared/services/user-params.service';
import { Subject } from 'rxjs/Subject';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { PipRX, DOCGROUP_CL } from 'eos-rest';
import { NodeDocsTree } from '../../../../eos-user-params/shared/list-docs-tree/node-docs-tree';
import { INodeDocsTreeCfg } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';
// import { ALL_ROWS } from 'eos-rest/core/consts';
import { IOpenClassifParams } from '../../../../eos-common/interfaces';
import { WaitClassifService } from '../../../../app/services/waitClassif.service';
import { EosMessageService } from 'eos-common/services/eos-message.service';
// import {PARM_ERROR_SEND_FROM} from '../../shared-user-param/consts/eos-user-params.const';
@Component({
    selector: 'eos-user-param-reestr',
    templateUrl: 'user-param-reestr.component.html',
    providers: [FormHelperService],
})

export class UserParamReestrComponent implements OnDestroy, OnInit {
    @Input() defaultValues;
    @Output() pushChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() pushIncrementError: EventEmitter<any> = new EventEmitter<any>();
    public form: FormGroup;
    public inputs: any;
    public list: NodeDocsTree[] = [];
    private listDocGroup: NodeDocsTree[] = [];
    private _ngUnsebscribe: Subject<any> = new Subject();
    private allData: any;
    private prepareData: any;
    private prepareInputs: any;
    private mapChanges = new Map();
    private defoltInputs: any;
    private flagEdit: boolean = false;
    private flagBacground: boolean = false;
    constructor(
        private _userSrv: UserParamsService,
        private formHelp: FormHelperService,
        private dataConv: EosDataConvertService,
        private inpSrv: InputControlService,
        private remaster: RemasterService,
        private _pipRx: PipRX,
        private _msg: EosMessageService,
        private _waitClassifSrv: WaitClassifService,
        // private _errorSrv: ErrorHelperServices,
    ) {
        this.remaster.submitEmit.subscribe(() => {
            this.submit();
        });
        this.remaster.cancelEmit.subscribe(() => {
            this.cancel();
        });
        this.remaster.defaultEmit.subscribe(() => {
            this.default();
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
        const paramsDoc = String(this._userSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/g, '||');
        this.getDocGroupName(paramsDoc, true).then((result) => {
            if (result.length > 0) {
                this.getListDoc(result);
            }
            this.allData = this._userSrv.hashUserContext;
            this.inint();
        }).catch(error => {
            console.log(error);
        });
    }
    inint() {
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_REESTR.fields, this.allData);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_REESTR.fields);
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
            this.pushChange.emit({
                btn:  true,
                data: this.mapChanges
            });
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
        if (this.flagEdit) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
    }
    submit() {
        this.mapChanges.clear();
        this.prepFormForSave();
        this.flagEdit = false;
        this.editMode();
    }
    default(event?) {
        this.list = [];
        this.listDocGroup = [];
        this.prepareData = {};
        this.prepareInputs = {};
        this.prepareData = this.formHelp.parse_Create(OTHER_USER_REESTR.fields, this.defaultValues);
        this.prepareInputs = this.formHelp.getObjectInputFields(OTHER_USER_REESTR.fields);
        this.defoltInputs = this.dataConv.getInputs(this.prepareInputs, { rec: this.prepareData });
        this.prepFormCancel(this.defoltInputs, true);
    }
    cancel($event?) {
        this.flagEdit = false;
        this.list = [];
        this.listDocGroup = [];
        const paramsDoc = String(this._userSrv.hashUserContext['REESTR_RESTRACTION_DOCGROUP']).replace(/,/, '||');
        this.getDocGroupName(paramsDoc, true).then(result => {
            if (result.length > 0) {
                this.getListDoc(result);
            }
        });
        this.prepFormCancel(this.inputs, false);
        this.mapChanges.clear();
        this.editMode();
    }
    deleteDirectory() {
        this.list = [];
        this.listDocGroup = [];
        this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].patchValue('');
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
        const new_ISN = this.list.reduce((accumulator, current: NodeDocsTree) => {
            return accumulator += current.data['ISN_NODE'] + ',';
        }, '');
        const substrIsn = new_ISN.substr(0, new_ISN.length - 1);
        this.form.controls['rec.REESTR_RESTRACTION_DOCGROUP'].patchValue(substrIsn);
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

}
