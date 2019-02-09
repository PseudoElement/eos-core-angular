import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import { AdvCardRKDataCtrl, ACRK_GROUP, DEFAULTS_LIST_NAME } from './adv-card-rk-datactrl';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { TDefaultField, TDFSelectOption, RKFieldsFict } from './rk-default-values/rk-default-const';

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

    // componentRef: ComponentRef <RKDefaultValuesCardComponent>;

    isUpdating = true;
    nodes: any[];
    tabs: Ttab [];
    dataController: AdvCardRKDataCtrl;

    activeTab: Ttab;
    form: FormGroup;


    valuesDefault: any;
    valuesDG: any;
    fieldsDescrDefault: any;
    inputsDefault: any;

    // protected apiSrv: PipRX;
    private _node = {};

    // private _initialData: any;

    constructor(
        public bsModalRef: BsModalRef,
        private apiSrv: PipRX,
        private _dataSrv: EosDataConvertService,
        private _inputCtrlSrv: InputControlService,

        // private _dictSrv: EosDictService,
        // private _msgSrv: EosMessageService,
        // private _confirmSrv: ConfirmWindowService,
    ) {
        this.apiSrv = apiSrv;
        this.isUpdating = true;
        this.tabs = tabs;
    }


    ngOnInit() {
        this.dataController = new AdvCardRKDataCtrl(this.apiSrv);
        this.fieldsDescrDefault = this.dataController.getDescriptions(ACRK_GROUP.defaultRKValues);
        // this.valuesDefault = this.dataController.getValues(ACRK_GROUP.defaultRKValues);

        this.dataController.readValues1(3670).then (values => {
            this.valuesDG = values[0];
            this.valuesDefault = this._makeDataObj(this.valuesDG[DEFAULTS_LIST_NAME]);
            this.dataController.loadDictsOptions(ACRK_GROUP.defaultRKValues, this.valuesDefault, this.updateLinks).then (d => {
                this.inputsDefault = this.getInputs();
                const isNode = false;
                this.form = this._inputCtrlSrv.toFormGroup(this.inputsDefault, isNode);
                this.isUpdating = false;
            });
        });
        // this.createComponent('a');
    }
    ngOnDestroy() {
        // this.componentRef.destroy();
    }

    updateLinks (el: TDefaultField, options: TDFSelectOption[], data: any) {
        if (el.key === 'JOURNAL_ISN_NOMENC' ||
            el.key === 'JOURNAL_ISN_NOMENC_W'
            ) {
            const rec = data[0];
            options[0].title = rec['NOM_NUMBER'] + ' (' + rec['YEAR_NUMBER'] + ') ' + rec['CLASSIF_NAME'];
        }
    }

    _makeDataObj (data: any) {
        const res = { rec: {}};

        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            res.rec[el['DEFAULT_ID']] = el['VALUE'];
        }

        // {rec: this.valuesDG[DEFAULTS_LIST_NAME] };
        return res;
    }
    getInputs() {

        const i: any = {rec: {}};
        this.fieldsDescrDefault.forEach(element => {
            if (!element.foreignKey) {
                element.foreignKey = element.key;
            }
            const t = i.rec;
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
        // if (!this._baseId) {
        //     return;
        // }
        // const query = {criteries: {[NUM_YEAR_NAME]: String(this.editValueYear)}};
        // const req = {[this._decl.dbTableName]: query};
        // this.editValueNum = Number(this.editValueNum);
        // const isValid = true;

        // this.apiSrv.read(req).then((data) => {
        //     // TODO: check exists years somewhere (ticket 96979)
        //     // isValid = ?
        //     return data;
        // }).then((data) => {
        //     if (isValid) {
        //         const old_value = this._getNodeValue(this.editValueYear);
        //         if (old_value) {
        //             const _confrm = Object.assign({}, CONFIRM_NUMCREATION_NP_CHANGE);
        //             _confrm.body = _confrm.body
        //                 .replace('{{old_value}}', String(old_value))
        //                 .replace('{{new_value}}', String(this.editValueNum));
        //             this._confirmSrv.confirm(_confrm)
        //                 .then((confirmed: boolean) => {
        //                     if (confirmed) {
        //                         this._save(this.editValueYear, this.editValueNum);
        //                     }
        //                     return Promise.resolve(null);
        //                 }).catch(err => this._errHandler(err));
        //         } else {
        //             this._save(this.editValueYear, this.editValueNum);
        //         }
        //     } else {
        //         this._msgSrv.addNewMessage(DANGER_NUMCREATION_NP_CHANGE);
        //     }
        // }).catch(err => this._errHandler(err));
    }

    // private _init(dictId: string): CounterDeclarator {
    //     // return numDeclarators.find(r => r.dictId === dictId);
    // }

    // private _makeBatchData(year: number, value: number) {
    //     const dt = {
    //         [this._decl.dbNumIdName]  : String(this._baseId),
    //         [NUM_YEAR_NAME]: Number(year),
    //         [NUM_VALUE_NAME] : Number(value),
    //     };
    //     if (this._decl.appendObject) {
    //         Object.assign(dt, this._decl.appendObject);
    //     }
    //     const res = [
    //         {
    //             method: 'POST',
    //             data: dt,
    //             requestUri: this._decl.dbTableName,
    //         },
    //     ];
    //     return res;
    // }

    // private _updateRecord(chr: any/*originalData: any, updates: any*/): Promise<any> {
    //     if (chr.length) {
    //         return this.apiSrv.batch(chr, '')
    //             .then(() => {
    //                 return Promise.resolve(null);
    //             });
    //     } else {
    //         return Promise.resolve(null);
    //     }
    // }

    // private _save(year: number, value: number) {
    //     // const chr = this._makeBatchData(year, value);
    //     // this._updateRecord(chr).then(() => {
    //     //     this.initByNodeData(this._initialData);
    //     // }).catch(err => this._errHandler(err));

    // }

    // private _errHandler(err: any) {
    //     this._dictSrv.errHandler(err);
    //     this.hideModal();
    // }
}
