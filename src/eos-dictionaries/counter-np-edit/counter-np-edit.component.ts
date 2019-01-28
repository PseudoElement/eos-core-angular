import {Component, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {PipRX} from '../../eos-rest';
import {EosDictService} from '../services/eos-dict.service';
import { YEAR_PATTERN, NUMERIC_PATTERN } from 'eos-common/consts/common.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { DANGER_NUMCREATION_NP_CHANGE } from 'eos-dictionaries/consts/messages.consts';
import { CONFIRM_NUMCREATION_NP_CHANGE } from 'app/consts/confirms.const';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';


const NODE_ID_NAME = 'ISN_NODE';
const NODE_LABEL_NAME = 'CLASSIF_NAME';
const NUM_YEAR_NAME = 'YEAR_NUMBER';
const NUM_VALUE_NAME = 'CURRENT_NUMBER';
const NODE_HIGH_NAME = 'PARENT_DUE';
const FLAG_MAX = 'FLAG_MAX';

const ERROR_MESSAGE_NOSUPPORT = 'Справочник не поддерживается';
class CounterDeclarator {
    dictId: string;
    dbTableName: string;
    dbNumIdName: string;
    dbNodeName: string;
    rootLabel: string;
    mainLabel: string;
    appendObject?: any;
}

const numDeclarators: CounterDeclarator [] = [
    {
        dictId : 'docgroup',
        dbTableName : 'NUMCREATION',
        dbNumIdName : 'ISN_DOCGROUP',
        dbNodeName : 'DOCNUMBER_FLAG',
        rootLabel : 'Корневой элемент',
        mainLabel : 'Счетчик номерообразования',
        appendObject : {
            'ISN_NUM_BASE': '-1',
        }
    }, {
        dictId: 'departments',
        dbTableName: 'NP_NUMCREATION',
        dbNumIdName : 'BASE_ID',
        dbNodeName : 'NUMCREATION_FLAG',
        rootLabel: 'Главный счетчик',
        mainLabel : 'Счетчик номерообразования НП',
    }
];

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
    private _node = {};
    private _baseId: string;
    private _decl: CounterDeclarator;
    private _initialData: any;

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
     * if null - use main counter with base_id = '0'
     */
    public initByNodeData(dndata: any) {
        this._initialData = dndata;
        this._decl = this._init(this._dictSrv.currentDictionary.id);
        if (!this._decl) {
            this._errHandler(ERROR_MESSAGE_NOSUPPORT);
            return;
        }

        this.isUpdating = true;

        if (!dndata) {
            this._node = {};
            this._node[NODE_LABEL_NAME] = this._decl.rootLabel;
            this._node[NODE_ID_NAME] = String(0);
        } else {
            this._node = dndata;
            const highId = dndata[NODE_HIGH_NAME];
            if (!dndata[this._decl.dbNodeName] && highId !== null) {
                this.isUpdating = false;
                this._dictSrv.currentDictionary.getFullNodeInfo(highId)
                    .then(highNode => {
                        if (highNode) {
                            this.initByNodeData(highNode.data.rec);
                        }
                    });
            } else if (highId === null) {
                this._node[NODE_LABEL_NAME] = this._decl.rootLabel;
            }
        }

        this._baseId = String(this._node[NODE_ID_NAME]);
        if (!this.editValueYear) {
            this.editValueYear = (new Date).getFullYear();
        }
        const query = {criteries: {[this._decl.dbNumIdName]: String(this._baseId), [FLAG_MAX]: String(1)}};
        const req = {[this._decl.dbTableName]: query, orderby: NUM_YEAR_NAME};
        this.apiSrv.read(req)
            .then((cnts) => {
                this.nodes = cnts.filter(d => {
                    return String(d[this._decl.dbNumIdName]) === this._baseId;
                });
                this.isUpdating = false;
                return cnts;
            })
            .catch(err => this._errHandler(err));
    }

    public getTitleLabel(): string {
        if (this._decl) {
            return this._decl.mainLabel;
        }
        return '';
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public saveWithConfirmation() {
        if (!this._baseId) {
            return;
        }
        const query = {criteries: {[NUM_YEAR_NAME]: String(this.editValueYear)}};
        const req = {[this._decl.dbTableName]: query};
        this.editValueNum = Number(this.editValueNum);
        const isValid = true;

        this.apiSrv.read(req).then((data) => {
            // TODO: check exists years somewhere (ticket 96979)
            // isValid = ?
            return data;
        }).then((data) => {
            if (isValid) {
                const old_value = this._getNodeValue();
                if (old_value) {
                    const _confrm = Object.assign({}, CONFIRM_NUMCREATION_NP_CHANGE);
                    _confrm.body = _confrm.body
                        .replace('{{old_value}}', String(old_value))
                        .replace('{{new_value}}', String(this.editValueNum));
                    this._confirmSrv.confirm(_confrm)
                        .then((confirmed: boolean) => {
                            if (confirmed) {
                                this._save();
                            }
                            return Promise.resolve(null);
                        }).catch(err => this._errHandler(err));
                } else {
                    this._save();
                }
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

    private _init(dictId: string): CounterDeclarator {
        return numDeclarators.find(r => r.dictId === dictId);
    }

    private _getData() {
        const res = {
            [this._decl.dbNumIdName]  : String(this._baseId),
            [NUM_YEAR_NAME]: Number(this.editValueYear),
            [NUM_VALUE_NAME] : Number(this.editValueNum),
        };
        if (this._decl.appendObject) {
            Object.assign(res, this._decl.appendObject);
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

    private _save() {
        const dt = this._getData();
        const chr = [
            {
                method: 'POST',
                data: dt,
                requestUri: this._decl.dbTableName,
            },
        ];
        this._updateRecord(chr).then(() => {
            // if (this._node[NODE_ID_NAME] === String(-1)) {
            //     this._node = null;
            // }
            this.initByNodeData(this._initialData);
        }).catch(err => this._errHandler(err));

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
