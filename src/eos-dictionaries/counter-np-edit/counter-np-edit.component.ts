import {Component, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import {EosDictService} from '../services/eos-dict.service';
import { YEAR_PATTERN, NUMERIC_PATTERN } from 'eos-common/consts/common.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DANGER_NUMCREATION_NP_CHANGE } from 'eos-dictionaries/consts/messages.consts';
import { CONFIRM_NUMCREATION_NP_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';

let NUM_TABLE_NAME: string;
let NUM_ID_NAME: string;
let NODE_NUM_NAME: string;
let IS_DOCGOUP: boolean;

const NODE_ID_NAME = 'ISN_NODE';
const NODE_LABEL_NAME = 'CLASSIF_NAME';
const NUM_YEAR_NAME = 'YEAR_NUMBER';
const NUM_VALUE_NAME = 'CURRENT_NUMBER';
const ISN_NUM_BASE = 'ISN_NUM_BASE';
const NODE_HIGH_NAME = 'PARENT_DUE';
const FLAG_MAX = 'FLAG_MAX';


@Component({
    selector: 'eos-counter-np-edit',
    templateUrl: 'counter-np-edit.component.html',
})

export class CounterNpEditComponent {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    editValueNum: number;
    editValueYear: number;
    nodes: any[];
    title = 'Счетчик номерообразования НП';

    valuePattern = NUMERIC_PATTERN;
    yearPattern = YEAR_PATTERN;

    protected apiSrv: PipRX;
    private _node = {};
    private _baseId: string;

    constructor(
        public bsModalRef: BsModalRef,
        apiSrv: PipRX,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
    ) {
        this.apiSrv = apiSrv;
        this.isUpdating = true;
    }

    /**
     * summon a modal window for NP_NUMCREATION
     * @param dndata EosDictionaryNode.data.rec - use departament's data.rec.CLASSIF_NAME and data.rec.ISN_NODE
     * if null - use main counter with base_id = '-1'
     */
    public initByNodeData(dndata: any) {
        this._init();
        this.isUpdating = true;

        if (!dndata) {
            this._node = {};
            this._node[NODE_LABEL_NAME] = 'Главный счетчик';
            this._node[NODE_ID_NAME] = String(-1);
        } else {
            this._node = dndata;
            const highId = dndata[NODE_HIGH_NAME];
            if (!dndata[NODE_NUM_NAME] && highId !== null) {
                this.isUpdating = false;
                this._dictSrv.currentDictionary.getFullNodeInfo(highId)
                    .then(highNode => {
                        if (highNode) {
                            this.initByNodeData(highNode.data.rec);
                        }
                    });
            } else if (highId === null) {
                this._node[NODE_LABEL_NAME] = 'Корневой элемент';
            }
        }

        this._baseId = String(this._node[NODE_ID_NAME]);
        if (!this.editValueYear) {
            this.editValueYear = (new Date).getFullYear();
        }
        const query = {criteries: {[NUM_ID_NAME]: String(this._baseId), [FLAG_MAX]: String(1)}};
        const req = {[NUM_TABLE_NAME]: query};
        this.apiSrv.read(req)
            .then((cnts) => {
                this.nodes = cnts.filter(d => {
                    return String(d[NUM_ID_NAME]) === this._baseId;
                });
                this.isUpdating = false;
                return cnts;
            })
            .catch(err => this._errHandler(err));
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public save() {
        if (!this._baseId) {
            return;
        }
        const query = {criteries: {[NUM_YEAR_NAME]: String(this.editValueYear)}};
        const req = {[NUM_TABLE_NAME]: query};
        this.editValueNum = Number(this.editValueNum);
        const isValid = true;
        const dt = this._getData();

        this.apiSrv.read(req).then((data) => {
            // TODO: check exists years somewhere (ticket 96979)
            // isValid = ?
            return data;
        }).then((data) => {
            if (isValid) {
                const old_value = this._getNodeValue();
                const _confrm = Object.assign({}, CONFIRM_NUMCREATION_NP_CHANGE);
                _confrm.body = _confrm.body
                    .replace('{{old_value}}', String(old_value))
                    .replace('{{new_value}}', String(this.editValueNum));
                this._confirmSrv.confirm(_confrm)
                    .then((confirmed: boolean) => {
                        if (confirmed) {
                            const chr = [
                                {
                                    method: 'POST',
                                    data: dt,
                                    requestUri: NUM_TABLE_NAME,
                                },
                            ];
                            this._updateRecord(chr).then(() => {
                                if (this._node[NODE_ID_NAME] === String(-1)) {
                                    this._node = null;
                                }
                                this.initByNodeData(this._node);
                            }).catch(err => this._errHandler(err));
                        }
                    }).catch(err => this._errHandler(err));
            } else {
                this._msgSrv.addNewMessage(DANGER_NUMCREATION_NP_CHANGE);
            }
        }).catch(err => this._errHandler(err));
    }

    public getNodeTitle() {
        return this._node[NODE_LABEL_NAME];
    }

    public rowClick(node: any) {
        this.editValueNum = node[NUM_VALUE_NAME];
        this.editValueYear = node[NUM_YEAR_NAME];
    }

    private _init() {
        if (this._dictSrv.currentDictionary.id === 'docgroup') {
            this.title = 'Счетчик номерообразования';
            NUM_TABLE_NAME = 'NUMCREATION';
            NUM_ID_NAME = 'ISN_DOCGROUP';
            NODE_NUM_NAME = 'DOCNUMBER_FLAG';
            IS_DOCGOUP = true;
        } else {
            NUM_TABLE_NAME = 'NP_NUMCREATION';
            NUM_ID_NAME = 'BASE_ID';
            NODE_NUM_NAME = 'NUMCREATION_FLAG';
            IS_DOCGOUP = false;
        }
    }

    private _getData() {
        const res = {
            [NUM_ID_NAME]  : String(this._baseId),
            [NUM_YEAR_NAME]: Number(this.editValueYear),
            [NUM_VALUE_NAME] : Number(this.editValueNum),
        };
        if (IS_DOCGOUP) {
            Object.assign(res, {[ISN_NUM_BASE]: String(-1)});
        }
        return res;
    }

    private _updateRecord(chr: any/*originalData: any, updates: any*/): Promise<any> {
        if (chr.length) {
            return this.apiSrv.batch(chr, '')
                .then(() => {
                    return Promise.resolve(null);
                });
        } else {
            return Promise.resolve(null);
        }
    }

    private _errHandler(err: any) {
        this._dictSrv.errHandler(err);
        this.hideModal();
    }

    private _getNodeValue(): number {
        let res = 0;
        const node = this.nodes.find(n => n[NUM_YEAR_NAME] === this.editValueYear);
        if (node) {
            res = node[NUM_VALUE_NAME];
        }
        return res;
    }
}
