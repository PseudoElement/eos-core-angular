import { Component, Output, EventEmitter, OnDestroy, OnInit, OnChanges, ViewChild } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import { AdvCardRKDataCtrl, DEFAULTS_LIST_NAME, FILE_CONSTRAINT_LIST_NAME } from './adv-card-rk-datactrl';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { TDefaultField, TDFSelectOption } from './rk-default-values/rk-default-const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosUtils } from 'eos-common/core/utils';
import { Subscription } from 'rxjs/Subscription';
import { RKBasePage } from './rk-default-values/rk-base-page';
import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';

const NODE_LABEL_NAME = 'CLASSIF_NAME';
class Ttab {
    tag: number;
    title: string;
}

const tabs: Ttab [] = [
    {tag: 0, title: 'По умолчанию'},
    {tag: 1, title: 'Обязательные'},
    {tag: 2, title: 'При записи'},
    {tag: 3, title: 'Файлы'},
];


// Реквизит "Срок исполнения" может быть заполнен только в одном месте

@Component({
    selector: 'eos-adv-card-rk',
    templateUrl: 'adv-card-rk.component.html',
})

export class AdvCardRKEditComponent implements OnDestroy, OnInit, OnChanges {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    nodes: any[];
    tabs: Ttab [];
    dataController: AdvCardRKDataCtrl;
    // changeEvent: Subject<any> = new Subject();
    activeTab: Ttab;
    form: FormGroup;


    values: any;

    descriptions: any;
    inputs: any;
    newData: any;
    storedValuesDG: any;
    editValues: any;
    isChanged: boolean;
    // protected formChanges$: Subscription;
    private subscriptions: Subscription[];

    @ViewChild('currentPage')
    private currentPage: RKBasePage;
    // protected apiSrv: PipRX;
    private _node = {};
    private isn_node: number;

    constructor(
        public bsModalRef: BsModalRef,
        private _apiSrv: PipRX,
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _msgSrv: EosMessageService,

    ) {
        this.isUpdating = true;
        this.tabs = tabs;
        this.subscriptions = [];
        this.editValues = {};
        this.isChanged = false;
    }

    ngOnChanges() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }

    updateLinks (el: TDefaultField, options: TDFSelectOption[], data: any) {
        if (el.key === 'JOURNAL_ISN_NOMENC' ||
            el.key === 'JOURNAL_ISN_NOMENC_W'
            ) {
            const rec = data[0];
            if (rec['DUE'] === '0.') {
                options[0].title = '...';
            } else {
                options[0].title = rec['NOM_NUMBER'] + ' (' + rec['YEAR_NUMBER'] + ') ' + rec['CLASSIF_NAME'];
            }
        }
    }

    save(): void {
        this.dataController.save(this.isn_node, this.inputs, this.newData).then (r => {
            this.bsModalRef.hide();
        }).catch (err => {

        });
    }

    cancel(): void {
        this.bsModalRef.hide();
    }

    public clickTab (item: Ttab) {
        this.activeTab = item;
    }

    public initByNodeData(dndata: any) {
        this.isUpdating = true;
        this.isn_node = dndata['ISN_NODE'];
        if (!dndata) {
            this._node = {};
        } else {
            this._node = dndata;
        }
        this.activeTab = tabs[0];

        this.dataController = new AdvCardRKDataCtrl(this._apiSrv, this._msgSrv);
        this.descriptions = this.dataController.getDescriptions();

        this.dataController.readValues(this.isn_node).then (values => {
            this.storedValuesDG = values[0];
            this.values = {
                [DEFAULTS_LIST_NAME]:  this._makeDataObjDef(this.storedValuesDG[DEFAULTS_LIST_NAME]),
                [FILE_CONSTRAINT_LIST_NAME]: this._makeDataObjFileCon(this.storedValuesDG[FILE_CONSTRAINT_LIST_NAME]),
                };
            this.editValues = this._makePrevValues(this.values);

            this.dataController.loadDictsOptions(this.values, this.updateLinks).then (d => {
                this.inputs = this._getInputs();
                this._updateOptions(this.inputs);
                const isNode = false;
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, isNode);
                this._subscribeToChanges();
                this.isUpdating = false;
            });
        });

    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public getTitleLabel() {
        return 'Реквизиты РК "' + this._node[NODE_LABEL_NAME] + '"';
    }

    public saveWithConfirmation() {
    }

    private _updateOptions(values: any[]) {
        const v = values['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'];
        v.options.push (
            {
                value: '-1', title: 'Список ДЛ'
            }, {
                value: '-2', title: 'Фигуранты РК'
            }
        );

    }

    private _makeDataObjFileCon (data: any): any {
        const res = { };
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            res[el['CATEGORY'] + '.' + 'EXTENSIONS'] = el['EXTENSIONS'];
            res[el['CATEGORY'] + '.' + 'MAX_SIZE'] = el['MAX_SIZE'];
            res[el['CATEGORY'] + '.' + 'ONE_FILE'] = el['ONE_FILE'];
        }
        return res;
    }

    private _makeDataObjDef (data: any) {
        const res = { };
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            res[el['DEFAULT_ID']] = el['VALUE'];
        }
        return res;
    }

    private _getInputs(): any {
        const i: any = {};
        for (const key in this.descriptions) {
            if (this.descriptions.hasOwnProperty(key)) {
                const r = this.descriptions[key];
                i[key] = {};
                r.forEach(element => {
                    if (!element.foreignKey) {
                        element.foreignKey = element.key;
                    }
                    if (element.type === E_FIELD_TYPE.boolean) {
                        if (this.values[key][element.key] === '0') {
                            this.values[key][element.key] = null;
                        }
                    } else if (this.values[key]) {
                        if (this.values[key][element.key] === 'null') {
                            this.values[key][element.key] = null;
                        }
                    }
                    const t = i[key];
                    t[element.key] = element;
                });
            }

        }
        return this._dataSrv.getInputs(i, this.values);
    }

    private _subscribeToChanges() {
        this.subscriptions.push(this.form.valueChanges.subscribe((newVal) => {
            let changed = false;
            Object.keys(newVal).forEach((path) => {
                if (this._changeByPath(path, newVal[path])) {
                    changed = true;
                }
            });
            this.formChanged.emit(changed);
        }));
    }

    private _makePrevValues(values: any): any {
        const res = {};
        for (const k1 in values) {
            if (values.hasOwnProperty(k1)) {
                const e1 = values[k1];
                for (const k2 in e1) {
                    if (e1.hasOwnProperty(k2)) {
                        const e2 = e1[k2];
                        res[k1 + '.' + k2] = e2;
                    }
                }
            }
        }
        return res;
    }

    private _getPrevValue (path: string): any {
        return this.editValues[path];
    }

    private _setPrevValue (path: string, value: any) {
        this.editValues[path] = value;
    }

    private _changeByPath(path: string, value: any): boolean {
        const type: E_FIELD_TYPE = this.inputs[path].controlType;
        value = this.dataController.fixDBValueByType(value, type);
        const prevValue = this.dataController.fixDBValueByType(this._getPrevValue(path), type);

        this.newData = EosUtils.setValueByPath(this.newData, path, value);

        if (value !== prevValue) {
            this.isChanged = true;
            this._setPrevValue(path, value);
            this.currentPage.onDataChanged(path, prevValue, value);
            return true;
        }
        return false;
    }


}