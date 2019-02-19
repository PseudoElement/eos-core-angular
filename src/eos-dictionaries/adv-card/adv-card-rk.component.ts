import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import { AdvCardRKDataCtrl, DEFAULTS_LIST_NAME, FILE_CONSTRAINT_LIST_NAME } from './adv-card-rk-datactrl';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { TDefaultField, TDFSelectOption, RKFieldsFict } from './rk-default-values/rk-default-const';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { EosUtils } from 'eos-common/core/utils';
import { Subscription } from 'rxjs/Subscription';

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
// @NgModule({
//     declarations: [
//         ,
//     ],
//     entryComponents: [ RKDefaultValuesCardComponent ],
//     // bootstrap: [ App ]
// })
export class AdvCardRKEditComponent implements OnDestroy, OnInit {
    // @ViewChild('tabContainer', { read: ViewContainerRef }) container;
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();

    // componentRef: ComponentRef <RKDefaultValuesCardComponent>;

    isUpdating = true;
    nodes: any[];
    tabs: Ttab [];
    dataController: AdvCardRKDataCtrl;

    activeTab: Ttab;
    form: FormGroup;


    valuesDefault: any;
    valuesDG: any;
    descriptions: any;
    inputs: any;
    newData: any;
    private subscriptions: Subscription[];

    // protected apiSrv: PipRX;
    private _node = {};
    private isn_node: number;


    // private _initialData: any;

    constructor(
        public bsModalRef: BsModalRef,
        private apiSrv: PipRX,
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,
        private _msgSrv: EosMessageService,

        // private _dictSrv: EosDictService,
        // private _msgSrv: EosMessageService,
        // private _confirmSrv: ConfirmWindowService,
    ) {
        this.apiSrv = apiSrv;
        this.isUpdating = true;
        this.tabs = tabs;
        this.isn_node = 3670;
        this.subscriptions = [];
    }


    ngOnInit() {
        this.dataController = new AdvCardRKDataCtrl(this.apiSrv, this._msgSrv);
        this.descriptions = this.dataController.getDescriptions();

        this.dataController.readValues(this.isn_node).then (values => {
            this.valuesDG = values[0];
            this.valuesDefault = {
                [DEFAULTS_LIST_NAME]:  this._makeDataObjDef(this.valuesDG[DEFAULTS_LIST_NAME]),
                [FILE_CONSTRAINT_LIST_NAME]: this._makeDataObjFileCon(this.valuesDG[FILE_CONSTRAINT_LIST_NAME]),
                };
            console.log(this.valuesDefault);
            this.dataController.loadDictsOptions(this.valuesDefault, this.updateLinks).then (d => {
                this.inputs = this.getInputs();
                this._updateOptions(this.inputs);
                const isNode = false;
                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, isNode);
                this._subscribeToChanges();
                this.isUpdating = false;
            });
        });
        // this.createComponent('a');
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
            options[0].title = rec['NOM_NUMBER'] + ' (' + rec['YEAR_NUMBER'] + ') ' + rec['CLASSIF_NAME'];
        }
    }

    save(): void {
        this.dataController.save(this.isn_node, this.inputs, this.newData);

    }

    _updateOptions(values: any[]) {
        console.log(values);
        const v = values['DOC_DEFAULT_VALUE_List.SECURLEVEL_FILE'];
        v.options.push (
            {
                value: '-1', title: 'Список ДЛ'
            }, {
                value: '-2', title: 'Фигуранты РК'
            }
        );

    }

    _makeDataObjFileCon (data: any): any {
        const res = { };
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            res[el['CATEGORY'] + '.' + 'EXTENSIONS'] = el['EXTENSIONS'];
            res[el['CATEGORY'] + '.' + 'MAX_SIZE'] = el['MAX_SIZE'];
            res[el['CATEGORY'] + '.' + 'ONE_FILE'] = el['ONE_FILE'];
        }
        return res;
    }

    _makeDataObjDef (data: any) {
        const res = { };
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            res[el['DEFAULT_ID']] = el['VALUE'];
        }
        return res;
    }

    getInputs(): any {
        const i: any = {};
        for (const key in this.descriptions) {
            if (this.descriptions.hasOwnProperty(key)) {
                const r = this.descriptions[key];
                i[key] = {};
                r.forEach(element => {
                    if (!element.foreignKey) {
                        element.foreignKey = element.key;
                    }
                    const t = i[key];
                    t[element.key] = element;
                });
                const a: any = RKFieldsFict;
                a.forEach(element => {
                    if (!element.foreignKey) {
                        element.foreignKey = element.key;
                    }
                    // const t = i.fict;
                    // t[element.key] = element;
                });
            }

        }

        // select classif_name , nom_number , year_number , e_document from nomenkl_cl where isn_lclassif =4057175

        return this._dataSrv.getInputs(i, this.valuesDefault);
    }
    clickTab (item: Ttab) {
        this.activeTab = item;
    }

    public initByNodeData(dndata: any) {
        // this._initialData = dndata;
        this.isUpdating = true;

        if (!dndata) {
            this._node = {};
        } else {
            this._node = dndata;
        }
        this.activeTab = tabs[0];
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public getTitleLabel() {
        return 'Реквизиты РК "' + this._node[NODE_LABEL_NAME] + '"';
    }

    public saveWithConfirmation() {
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

    private _changeByPath(path: string, value: any): boolean {
        let _value = null;
        if (typeof value === 'boolean') {
            _value = +value;
        } else if (value === 'null') {
            _value = null;
        } else if (value instanceof Date) {
            _value = EosUtils.dateToString(value);
        } else if (value === '') { // fix empty strings in IE
            _value = null;
        } else {
            _value = value;
        }
        this.newData = EosUtils.setValueByPath(this.newData, path, _value);
        const oldValue = EosUtils.getValueByPath(this.valuesDefault, path, false);

        // if (oldValue !== _value) {
        //     this.data = EosUtils.setValueByPath(this.data, path, _value);
        //     if (path === 'type') {
        //         this.init(_value);
        //     }
        //     // console.warn('changed', path, oldValue, 'to', _value, this.data.rec);
        // }

        return _value !== oldValue;
    }


}
