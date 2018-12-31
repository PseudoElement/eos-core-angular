import {Component, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import {EosDictService} from '../services/eos-dict.service';
import { YEAR_PATTERN, NUMERIC_PATTERN } from 'eos-common/consts/common.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DANGER_NUMCREATION_NP_CHANGE } from 'eos-dictionaries/consts/messages.consts';
import { CONFIRM_NUMCREATION_NP_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';

const NUMCREATION_TABLE_NAME    = 'NP_NUMCREATION';
const DEPARTMENTS_F_LABEL       = 'CLASSIF_NAME';
const DEPARTMENTS_F_ID          = 'ISN_NODE';
const NUMCREATION_F_ID          = 'BASE_ID';
const NUMCREATION_F_YEAR        = 'YEAR_NUMBER';
const NUMCREATION_F_VAL         = 'CURRENT_NUMBER';


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

    valuePattern = NUMERIC_PATTERN;
    yearPattern = YEAR_PATTERN;

    protected apiSrv: PipRX;
    private _dep_node = {};
    private _baseid: string;

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
    public initbyNodeData(dndata: any) {
        this.isUpdating = true;
        this._dep_node = dndata;
        if (!dndata) {
            this._dep_node = {};
            this._dep_node[DEPARTMENTS_F_LABEL] = 'Главный счетчик';
            this._dep_node[DEPARTMENTS_F_ID] = String(-1);
        }
        this._baseid = String(this._dep_node[DEPARTMENTS_F_ID]);
        if (!this.editValueYear) {
            this.editValueYear = (new Date).getFullYear();
        }
        const query = {criteries: {[NUMCREATION_F_ID]: String(this._baseid)}};
        const req = {[NUMCREATION_TABLE_NAME]: query};
        this.apiSrv.read(req).then((cnts) => {
            this.nodes = cnts.filter(d => {
                return d[NUMCREATION_F_ID] === this._baseid;
            });
            this.isUpdating = false;
            return cnts;
        }).catch(err => this._errHandler(err));

    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public save() {
        if (!this._baseid) {
            return;
        }
        const query = {criteries: {[NUMCREATION_F_YEAR]: String(this.editValueYear)}};
        const req = {[NUMCREATION_TABLE_NAME]: query};
        this.editValueNum = Number(this.editValueNum);
        const isValid = true;
        this.apiSrv.read(req).then((data) => {
            // TODO: check exists years somewhere (ticket 96979)
            // isValid = ?
            return data;
        }).then((data) => {
            if (isValid) {
                const old_value = this._getNodeValue(this.editValueYear);
                const _confrm = Object.assign({}, CONFIRM_NUMCREATION_NP_CHANGE);
                _confrm.body = _confrm.body.replace('{{old_value}}', String(old_value))
                                .replace('{{new_value}}', String(this.editValueNum));
                this._confirmSrv
                    .confirm(_confrm)
                    .then((confirmed: boolean) => {
                        if (confirmed) {
                            const chr = [
                                {
                                    method: 'POST',
                                    data: {
                                        [NUMCREATION_F_ID]  : String(this._baseid),
                                        [NUMCREATION_F_YEAR]: Number(this.editValueYear),
                                        [NUMCREATION_F_VAL] : Number(this.editValueNum),
                                    },
                                    requestUri: NUMCREATION_TABLE_NAME,
                                },
                            ];
                            this._updateRecord(chr).then(() => {
                                this.initbyNodeData(this._dep_node);
                            }).catch(err => this._errHandler(err));
                        }
                    })
                    .catch(err => this._errHandler(err));
            } else {
                this._msgSrv.addNewMessage(DANGER_NUMCREATION_NP_CHANGE);
            }
        }).catch(err => this._errHandler(err));
    }

    public getNodeTitle() {
        return this._dep_node[DEPARTMENTS_F_LABEL];
    }

    public rowClick(node: any) {
        this.editValueNum = node[NUMCREATION_F_VAL];
        this.editValueYear = node[NUMCREATION_F_YEAR];
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

    private _getNodeValue(editValueYear: number): number {
        let res = 0;
        const node = this.nodes.find(n => n[NUMCREATION_F_YEAR] === this.editValueYear);
        if (node) {
            res = node[NUMCREATION_F_VAL];
        }
        return res;
    }


}
