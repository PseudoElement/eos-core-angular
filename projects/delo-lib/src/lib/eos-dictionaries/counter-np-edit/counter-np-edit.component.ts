import {Component, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {DOCGROUP_CL, NpCounterOverrideService, PipRX} from '../../eos-rest';
import {EosDictService} from '../services/eos-dict.service';
import {YEAR_PATTERN, NUMERIC_PATTERN, NOT_EMPTY_STRING} from '../../eos-common/consts/common.consts';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { DANGER_NUMCREATION_NP_CHANGE } from '../../eos-dictionaries/consts/messages.consts';
import { CONFIRM_NUMCREATION_CANT, CONFIRM_NUMCREATION_CHANGE } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { SopsHelper } from '../../eos-dictionaries/helpers/sops.helper';

const NODE_ID_NAME = 'ISN_NODE';
const NODE_LABEL_NAME = 'CLASSIF_NAME';
const NUM_YEAR_NAME = 'YEAR_NUMBER';
const NUM_VALUE_NAME = 'CURRENT_NUMBER';
const NODE_HIGH_NAME = 'PARENT_DUE';
const FLAG_MAX = 'FLAG_MAX';

const ERROR_MESSAGE_NOSUPPORT = 'Справочник не поддерживается';

export enum E_COUNTER_TYPE {
    counterDepartmentMain,
    counterDepartment,
    counterDepartmentRK = 2,
    counterDepartmentRKPD = 3,
    counterDocgroup = 4,
    counterDocgroupRKPD = 5,
}

export class CounterDeclarator {
    type: E_COUNTER_TYPE;
    dictId: string;
    dbTableName: string;
    dbNumIdName: string;
    dbBaseIdName?: string;
    dbNodeName: string;
    rootLabel: string;
    mainLabel: string;
    appendObject?: any;
    isCounterRK?: boolean;
    criteries?: any;
    defaultRecord?: {
        year: number,
        value: number,
    };
}

export let numDeclarators: CounterDeclarator [] = [
    {
        type: E_COUNTER_TYPE.counterDocgroup,
        dictId : 'docgroup',
        dbTableName : 'NUMCREATION',
        dbNumIdName : 'ISN_DOCGROUP',
        dbNodeName : 'DOCNUMBER_FLAG',
        rootLabel : 'Корневой элемент',
        mainLabel : 'Счетчик номерообразования РК',
        criteries: {
            'ISN_NUM_BASE': '-1',
        },
        appendObject : {
            'ISN_NUM_BASE': '-1',
        }
    }, {
        type: E_COUNTER_TYPE.counterDocgroupRKPD,
        dictId : 'docgroup',
        dbTableName : 'PRJ_NUMCREATION',
        dbNumIdName : 'ISN_DOCGROUP',
        dbNodeName : 'DOCNUMBER_FLAG',
        rootLabel : 'Корневой элемент',
        mainLabel : 'Счетчик номерообразования РКПД',
        criteries: {
            'ISN_NUM_BASE': '-1',
        },
        appendObject : {
            'ISN_NUM_BASE': '-1',
        }
    }, {
        type: E_COUNTER_TYPE.counterDepartmentRK,
        dictId : 'departments',
        dbTableName : 'NUMCREATION',
        dbNumIdName : 'ISN_NUM_BASE',
        dbBaseIdName: 'ISN_DOCGROUP',
        dbNodeName : 'NUMCREATION_FLAG',
        rootLabel : 'Корневой элемент',
        mainLabel : 'Счетчик номерообразования РК',
        isCounterRK : true,
    }, {
        type: E_COUNTER_TYPE.counterDepartmentRKPD,
        dictId : 'departments',
        dbTableName : 'PRJ_NUMCREATION',
        dbNumIdName : 'ISN_NUM_BASE',
        dbBaseIdName: 'ISN_DOCGROUP',
        dbNodeName : 'NUMCREATION_FLAG',
        rootLabel : 'Корневой элемент',
        mainLabel : 'Счетчик номерообразования РКПД',
        isCounterRK : true,
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

    currentDocgroup: String;
    docGroupOptions = [];

    valuePattern = NUMERIC_PATTERN;
    yearPattern = YEAR_PATTERN;
    docGroupPattern = NOT_EMPTY_STRING;

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
        private _npCounterOverride: NpCounterOverrideService
    ) {
        this.apiSrv = apiSrv;
        this.isUpdating = true;
    }

    private static _autoFocusOnValNumber() {
        setTimeout(() => {
            const val_number = document.getElementById('val_number');
            if (val_number) {
                val_number.focus();
            }
        }, 200);
    }

    /**
     * 
     * @param dndata EosDictionaryNode.data.rec - use departament's data.rec.CLASSIF_NAME and data.rec.ISN_NODE
     * if null - use main counter with base_id = '0'
     */
    public checknumDeclarators(arrayDeclarators: CounterDeclarator[]): boolean {
        const overrideDecl = this._npCounterOverride.getOverridesCounterDeclarator();
      return  arrayDeclarators.some(node => overrideDecl.some(_ov => _ov.type === node.type))
    }
    public initByNodeData(type: E_COUNTER_TYPE, dndata: any) {
        const oldDeclarator = [...numDeclarators];
        numDeclarators = [];
        numDeclarators.push(...oldDeclarator)
        if (!this.checknumDeclarators(oldDeclarator)) {
            numDeclarators.push(...this._npCounterOverride.getOverridesCounterDeclarator());
        }
        this._initialData = dndata;
        this._decl = this._init(type);
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
            if (!this._decl.isCounterRK && !dndata[this._decl.dbNodeName] && highId !== null) {
                this.isUpdating = false;
                this._dictSrv.currentDictionary.getFullNodeInfo(highId)
                    .then(highNode => {
                        CounterNpEditComponent._autoFocusOnValNumber();
                        if (highNode) {
                            this.initByNodeData(type, highNode.data.rec);
                        }
                    });
                return;
            } else if (highId === null) {
                this._node[NODE_LABEL_NAME] = this._decl.rootLabel;
            }
        }

        this._baseId = String(this._node[NODE_ID_NAME]);
        if (!this.editValueYear) {
            this.editValueYear = (new Date).getFullYear();
        }

        this._readRecords().then (() => {
            if (this._decl.defaultRecord) {
                const def_value = this._getNodeValue(this._decl.defaultRecord.year);
                if (!def_value) {
                   this._save(this._decl.defaultRecord.year, this._decl.defaultRecord.value);
                } else {
                    const last_value = this._getNodeValue(this.editValueYear);
                    if (!last_value && this.editValueYear === (new Date).getFullYear()
                        && !this.editValueNum) {
                        this.editValueNum = def_value;
                    }
                }
            }
        });
    }

    public onChangeDocgroup(newValue) {
        this.currentDocgroup = newValue;
        this.initByNodeData(this._decl.type, this._initialData);
    }

    public getTitleLabel(): string {
        if (this._decl) {
            return this._decl.mainLabel;
        }
        return '';
    }

    get isCounterRK(): boolean {
        if (this._decl) {
            return !!this._decl.isCounterRK;
        }
        return false;
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
                this._saveCheckValues().then( (tocontinue) => {
                    return tocontinue ? this._saveCheckConfirm() : false;
                }).then ((tocontinue) => {
                    return tocontinue ? this._save(this.editValueYear, this.editValueNum) : false;
                }).catch(err => this._errHandler(err));
            } else {
                this._msgSrv.addNewMessage(DANGER_NUMCREATION_NP_CHANGE);
            }
        }).catch(err => this._errHandler(err));
    }

    _saveCheckConfirm(): Promise<boolean> {
        const old_value = this._getNodeValue(this.editValueYear);
        if (old_value) {
            const _confrm = Object.assign({}, CONFIRM_NUMCREATION_CHANGE);
            _confrm.body = _confrm.body
                .replace('{{old_value}}', String(old_value))
                .replace('{{year}}', String(this.editValueYear))
                .replace('{{new_value}}', String(this.editValueNum));
            return this._confirmSrv.confirm(_confrm)
                .then((confirmed: boolean) => {
                    return confirmed;
                });
        }
        return Promise.resolve(true);
    }

    _saveCheckValues(): Promise<boolean> {

        let check = Promise.resolve(false);

        if (this._decl.type === E_COUNTER_TYPE.counterDocgroup) {
            check = SopsHelper.sopExistsDocRcByOrderNum(this._node['DUE'], this.editValueNum, this.editValueYear);
        } else if (this._decl.type === E_COUNTER_TYPE.counterDocgroupRKPD) {
            check = SopsHelper.sopExistsPrjRcByOrderNum(this._node['DUE'], this.editValueNum, this.editValueYear);
        }

        return check.then( docsexist => {
            if (docsexist) {
                return this._confirmSrv.confirm2(CONFIRM_NUMCREATION_CANT)
                    .then(() => {
                        return false;
                    });
            } else {
                return true;
            }
        });
    }

    public getNodeTitle() {
        return this._node[NODE_LABEL_NAME];
    }

    public rowClick(node: any) {
        this.editValueNum = node[NUM_VALUE_NAME];
        this.editValueYear = node[NUM_YEAR_NAME];
    }



    private _readRecords(): Promise<any> {
        const criteries = { [this._decl.dbNumIdName]: String(this._baseId), [FLAG_MAX]: String(1) };
        if (this._decl.criteries) {
            Object.assign(criteries, this._decl.criteries);
        }

        const query = { criteries: criteries };
        const req = { [this._decl.dbTableName]: query, orderby: NUM_YEAR_NAME };
        return this._fillDocGroup()
            .then(() => {
                this.isUpdating = false;
                 return this.apiSrv.read(req)
                    .then((cnts) => {
                        CounterNpEditComponent._autoFocusOnValNumber();
                        this.nodes = cnts.filter(d => {
                            let res = String(d[this._decl.dbNumIdName]) === this._baseId;
                            if (res && this._decl.isCounterRK) {
                                const dbBaseId = String(d[this._decl.dbBaseIdName]);
                                const isDgOptions = this.docGroupOptions.find((dgo) => dgo.value === dbBaseId);
                                if (this.currentDocgroup === undefined && dbBaseId !== String(-1) &&
                                        isDgOptions !== undefined) {
                                    this.currentDocgroup = dbBaseId;
                                }
                                res = this.currentDocgroup !== null && dbBaseId === this.currentDocgroup;
                            }
                            return res;
                        });
                        return cnts;
                    });
            })
            .catch(err => this._errHandler(err));
    }

    private _init(type: E_COUNTER_TYPE): CounterDeclarator {
        return numDeclarators.find(r => r.type === type);
    }

    private _makeBatchData(year: number, value: number) {
        const dt = {
            [this._decl.dbNumIdName]  : String(this._baseId),
            [NUM_YEAR_NAME]: Number(year),
            [NUM_VALUE_NAME] : Number(value),
        };

        if (this.isCounterRK) {
            Object.assign(dt, {ISN_DOCGROUP: this.currentDocgroup});
        }

        if (this._decl.appendObject) {
            Object.assign(dt, this._decl.appendObject);
        }
        const res = [
            {
                method: 'POST',
                data: dt,
                requestUri: this._decl.dbTableName,
            },
        ];
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

    private _save(year: number, value: number) {
        const chr = this._makeBatchData(year, value);
        this._updateRecord(chr).then(() => {
            this.initByNodeData(this._decl.type, this._initialData);
        }).catch(err => this._errHandler(err));

    }

    private _errHandler(err: any) {
        this._dictSrv.errHandler(err);
        this.hideModal();
    }

    private _getNodeValue(year_value: number): number {
        let res = 0;
        if (this.nodes) {
            const node = this.nodes.find(n => n[NUM_YEAR_NAME] === year_value);
            if (node) {
                res = node[NUM_VALUE_NAME];
            }
        }
        return res;
    }

    private _fillDocGroup(): Promise<any> {
        this.docGroupOptions = [];
        if (this._decl.isCounterRK) {
            const prj_criteries = {
                DOCNUMBER_FLAG: String(1),
                PRJ_SHABLON: '%{E}%',
            };

            const criteries = {
                DOCNUMBER_FLAG: String(1),
                SHABLON: '%{E}%',
            };

            if (this._decl.type === E_COUNTER_TYPE.counterDepartmentRKPD) {
                Object.assign(prj_criteries, {PRJ_NUM_FLAG: String(1)});
            }

            return this.apiSrv.read<DOCGROUP_CL>({DOCGROUP_CL: PipRX.criteries(prj_criteries)})
                .then((records) => {
                    records.forEach((rec) => {
                        this.docGroupOptions.push({title: rec.CLASSIF_NAME, value: String(rec.ISN_NODE)});
                        if (this.currentDocgroup === undefined) {
                            this.currentDocgroup = String(rec.ISN_NODE);
                        }
                    });
                    this.apiSrv.read<DOCGROUP_CL>({DOCGROUP_CL: PipRX.criteries(criteries)}).then ((recs) => {
                        recs.forEach((rec) => {
                            const exists = this.docGroupOptions.find((r) => r.value === String(rec.ISN_NODE));
                            if (!exists) {
                                this.docGroupOptions.push({title: rec.CLASSIF_NAME, value: String(rec.ISN_NODE)});
                                if (this.currentDocgroup === undefined) {
                                    this.currentDocgroup = String(rec.ISN_NODE);
                                }
                            }
                        });
                    });
                });
        }
        return Promise.resolve(null);
    }
}
