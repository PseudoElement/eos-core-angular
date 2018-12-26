import {Component, Input, Output, EventEmitter, OnDestroy, OnInit} from '@angular/core';
import {IFieldView} from 'eos-dictionaries/interfaces';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import {EosDictService} from '../services/eos-dict.service';
import { YEAR_PATTERN, NUMERIC_PATTERN } from 'eos-common/consts/common.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DANGER_NUMCREATION_NP_CHANGE } from 'eos-dictionaries/consts/messages.consts';
import { CONFIRM_NUMCREATION_NP_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';


export const NUMCREATION_MAIN_NODE_ID = '0.';

@Component({
    selector: 'eos-counter-np-edit',
    templateUrl: 'counter-np-edit.component.html',
})
export class CounterNpEditComponent implements OnDestroy, OnInit {
    @Input() baseId: string;
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    editValueNum: number;
    editValueYear: number;
    nodes: any[];

    valuePattern = NUMERIC_PATTERN;
    yearPattern = YEAR_PATTERN;

    protected apiSrv: PipRX;
    private _dep_node = {};

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

    ngOnDestroy() {
    }

    init(baseid: string) {
        this.baseId = baseid;
        this._dep_node['CLASSIF_NAME'] = '...';
        this.apiSrv.read({'DEPARTMENT': this.baseId}).then((data) => {
            this._dep_node = data[0];
        });

        const query = {criteries: {BASE_ID: this.baseId}};
        const req = {['NP_NUMCREATION']: query};
        this.apiSrv.read(req).then((data) => {
            this.nodes = data.filter(d => {
                return d['BASE_ID'] === baseid;
            });
            this.isUpdating = false;
            return data;
        }).catch(err => this.errHandler(err));

    }

    ngOnInit() {
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    save() {
        const query = {criteries: {YEAR_NUMBER: String(this.editValueYear)}};
        const req = {['NP_NUMCREATION']: query};
        this.editValueNum = Number(this.editValueNum);
        const isValid = true;
        this.apiSrv.read(req).then((data) => {
            // TODO: check exists years somewhere (ticket 96979)
            // for (let i = 0; i <= data.length; i++) {
            //     const r = data[i];
            //     let val: number;
            //     if (!r) {
            //         continue;
            //     }
            //     val = Number(r['CURRENT_NUMBER']);
            //     if (val >= this.editValueNum) {
            //         isValid = false;
            //         break;
            //     }
            // }
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
                                        BASE_ID: this.baseId,
                                        YEAR_NUMBER: Number(this.editValueYear),
                                        CURRENT_NUMBER: Number(this.editValueNum),
                                    },
                                    requestUri: 'NP_NUMCREATION',
                                },
                            ];
                            this.updateRecord(chr).then(() => {
                                this.init(this.baseId);
                            }).catch(err => this.errHandler(err));
                        }
                    })
                    .catch(err => this.errHandler(err));
            } else {
                this._msgSrv.addNewMessage(DANGER_NUMCREATION_NP_CHANGE);
            }
        }).catch(err => this.errHandler(err));


    }

    updateRecord(chr: any/*originalData: any, updates: any*/): Promise<any> {
        if (chr.length) {
            return this.apiSrv.batch(chr, '')
                .then(() => {
                    // results.push({success: true, record: record});
                    // return results;
                    return Promise.resolve(null);
                });
        } else {
            return Promise.resolve(null);
        }
    }
    select(item: IFieldView, type: number) {
    }

    edit(item: IFieldView) {
    }

    getNodeTitle() {
        if (this.baseId === NUMCREATION_MAIN_NODE_ID) {
            return 'Главный счетчик';
        } else {
            return this._dep_node['CLASSIF_NAME'];
        }
    }

    rowClick(node: any) {
        this.editValueNum = node.CURRENT_NUMBER;
        this.editValueYear = node.YEAR_NUMBER;
    }

    private errHandler(err: any) {
        this._dictSrv.errHandler(err);
        this.hideModal();
    }

    private _getNodeValue(editValueYear: number): number {
        let res = 0;
        const node = this.nodes.find(n => n.YEAR_NUMBER === this.editValueYear);
        if (node) {
            res = node.CURRENT_NUMBER;
        }
        return res;
    }


}
