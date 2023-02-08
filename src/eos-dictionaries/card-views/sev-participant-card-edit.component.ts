import { RulesSelectComponent } from './../sev-rules-select/sev-rules-select.component';
import { Component, Injector, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { PipRX, SEV_ASSOCIATION, SEV_RULE, SEV_PARTICIPANT_RULE } from '../../eos-rest';
import { WARN_NO_BINDED_ORGANIZATION, DANGER_ORGANIZ_NO_SEV } from 'eos-dictionaries/consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ALL_ROWS, _ES } from 'eos-rest/core/consts';
import { SevIndexHelper } from 'eos-rest/services/sevIndex-helper';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_ORGANIZ_CL_PARTIC } from 'eos-user-select/shered/consts/create-user.consts';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { IOpenClassifParams } from 'eos-common/interfaces/interfaces';
import { AppContext } from 'eos-rest/services/appContext.service';
@Component({
    selector: 'eos-sev-participant-card-edit',
    templateUrl: 'sev-participant-card-edit.component.html',
    styleUrls: ['./sev-participant-card-edit.component.scss'],
})
export class SevParticipantCardEditComponent extends BaseCardEditComponent implements OnChanges, OnInit {
    @ViewChild('pop') pop;
    @ViewChild('pop2') pop2;
    _logDeletOrg: boolean;
    _orgName: any;
    modalWindow: BsModalRef;
    private _flagSetOrigin: boolean = true;
    private _usedRulesString; // правила которые мы будем отображать
    private _usedRules; // правила которые есть у пользователя
    private _listRules; // тут лежат все правила. Можно не делать доп запросов
    private _originSrules: Map<number, SEV_PARTICIPANT_RULE> = new Map();
    private _changes: Map<number, any> = new Map();

    get isCbBase(): boolean {
       return this._appCtx.cbBase;
    }

    constructor(
        injector: Injector,
        private _apiSrv: PipRX,
        /* private _zone: NgZone, */
        private _msgSrv: EosMessageService,
        private _modalSrv: BsModalService,
        private _waitClassif: WaitClassifService,
        private _errorHelper: ErrorHelperServices,
        private _appCtx: AppContext
    ) {
        super(injector);
    }

    get orgName(): string {
        if (this._orgName) {
            return this._orgName;
        } else if (this.data && this.data.organization) {
            return this.data.organization.CLASSIF_NAME;
        } else {
            return '';
        }
    }
    get logDeletOrg(): boolean {
        if (this._logDeletOrg !== undefined) {
            return this._logDeletOrg;
        } else if (this.data && this.data.rec) {
            return Boolean(this.data.rec.DELETED);
        } else {
            return false;
        }
    }
    ngOnInit(): void {
        this._usedRules = [];
        this._listRules = [];
        this.data.SEV_PARTICIPANT_RULE_CHANGES_LIST = [];
        const i = this.inputs['rec.ISN_CHANNEL'];
        i.options = [];
        const req_ch = { 'SEV_CHANNEL': [] };
        this._apiSrv.read(req_ch)
            .then((rdata: any[]) => {
                rdata.forEach((d) => {
                    if (d['DELETED'] === 0) {
                        i.options.push({ title: d['CLASSIF_NAME'], value: d['ISN_LCLASSIF'] });
                    } else if (d['ISN_LCLASSIF'] === this.form.controls['rec.ISN_CHANNEL'].value) {
                        i.options.push({ title: d['CLASSIF_NAME'], value: d['ISN_LCLASSIF'], isDeleted: true });
                    }
                });
            });
        this._readDBLists();
    }
    getValueOrg(): string {
        const value = this.form.controls['rec.CLASSIF_NAME'].value || '...';
        if (value === '...') {
            this.pop.show();
        } else {
            this.pop.hide();
        }
        return value;
    }
    getClassToInput() {
        const value = this.form.controls['rec.CLASSIF_NAME'].value || '';
        if (value) {
            return '';
        } else {
            return 'input-error';
        }
    }
    getClassToInputRule() {
        if (this._usedRulesString) {
            return '';
        } else {
            return 'input-error';
        }
    }
    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    get hasOrganization(): boolean {
        return this.getValue('rec.DUE_ORGANIZ');
    }

    chooseOrganiz() {
        if (!this.editMode) { // проверка на то есть ли режим редактирования
            return;
        }
        const config = this.dictSrv.getApiConfig();
        if (config) {
            this._waitClassif.openClassif(OPEN_CLASSIF_ORGANIZ_CL_PARTIC)
            .then((due: string) => {
                this.bindOrganization(due);
            }).catch(e => {
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
        }
    }

    bindOrganization(orgDue: string) {
        const dues = orgDue ? orgDue.split('|') : [''];
        const due = dues[0];
        this._apiSrv.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(due, 'ORGANIZ_CL')] })
            .then(rSevIndex => {
                // console.log(rSevIndex);
                if (rSevIndex && rSevIndex.length) {
                    this.dictSrv.bindOrganization(dues[0])
                        .then((org) => {
                            if (org) {
                                this._logDeletOrg = Boolean(org['DELETED']);
                                this._orgName = org['CLASSIF_NAME'];
                                this.setValue('rec.DUE_ORGANIZ', org.DUE);
                                this.setValue('rec.CLASSIF_NAME', org['CLASSIF_NAME']);
                            }
                        });
                } else {
                    this._msgSrv.addNewMessage(DANGER_ORGANIZ_NO_SEV);
                }
            });
    }

    unbindOrganization() {
        if (this.hasOrganization) {
            this.dictSrv.unbindOrganization();
            this._orgName = '';
            this._logDeletOrg = false;
            this.setValue('rec.CLASSIF_NAME', null);
            this.setValue('rec.DUE_ORGANIZ', null);
        } else {
            this._msgSrv.addNewMessage(WARN_NO_BINDED_ORGANIZATION);
        }
    }

    chooseRules() {
        this.modalWindow = null;
        this.modalWindow = this._modalSrv.show(RulesSelectComponent, { class: 'sev-rules-select-modal modal-lg' });
        this.modalWindow.content.initbyLists(this._listRules, this._usedRules);
        if (this.modalWindow) {
            const subscription = this.modalWindow.content.onChoose.subscribe((res) => {
                this._usedRules = res.used;
                this._usedRulesString = this._updateUsedRules(res.list, res.used);
                this.changesRrules(res.list, res.used);
                subscription.unsubscribe();
            });
        }
    }
    changesRrules(list: SEV_RULE[], used: SEV_RULE[]) {
        used.forEach((u: SEV_RULE) => {
            if (this._originSrules.has(u.ISN_LCLASSIF)) {
                this._changes.delete(u.ISN_LCLASSIF);
            } else {
                this._changes.set(u.ISN_LCLASSIF, this.addDataRule(u));
            }
        });
        this._listRules.forEach((oldList: SEV_RULE) => {
            const findOther = used.every((u: SEV_RULE) => u.ISN_LCLASSIF !== oldList.ISN_LCLASSIF);
            if (findOther && this._originSrules.has(oldList.ISN_LCLASSIF)) {
                this._changes.set(oldList.ISN_LCLASSIF, this.deletedRules(oldList));
            }
            if (findOther && !this._originSrules.has(oldList.ISN_LCLASSIF)) {
                this._changes.delete(oldList.ISN_LCLASSIF);
            }
        });
        this.data.SEV_PARTICIPANT_RULE_CHANGES_LIST = this._changes;
        if (this._changes.size) {
            this.setValue('rec.rules', this._usedRulesString);
        } else {
            this.setValue('rec.rules', null);
        }
    }

    getStringUsedRules(): string {
        if (this._usedRulesString) {
            this.pop2.hide();
            return this._usedRulesString;
        }
        this.pop2.show();
        return '...';
    }
    openClassiSecurity(value) {
        if (!this.editMode) { // проверка на то есть ли режим редактирования
            return;
        }
        const allSevRule = [];
        if (this._usedRules && this._usedRules.length) {
            this._usedRules.forEach((rul) => {
                allSevRule.push(rul['ISN_LCLASSIF']);
            });
        }
        const OPEN_CLASSIF_SEV_RULE: IOpenClassifParams = {
            classif: 'SEV_RULE',
            selectMulty: false,
            selectLeafs: true,
            skipDeleted: false,
            id: '0.',
            selected: allSevRule.join('|')
        };
        this._waitClassif.openClassif(OPEN_CLASSIF_SEV_RULE)
        .then(data => {
            const selectRule = data.split('|'); // разбиваем строки на элементы
            if (this._listRules && this._listRules.length && selectRule.length) {
                this._usedRules = this._listRules.filter((rule) => {
                    if (selectRule.indexOf('' + rule['ISN_LCLASSIF']) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
            this._usedRulesString = this._updateUsedRules(this._listRules, this._usedRules);
            this.changesRrules(this._listRules, this._usedRules);
        }).catch(e => {
            if (e) {
                this._errorHelper.errorHandler(e);
            }
        });
    }
    deleteAllRule() {
        this._usedRules = [];
        this._usedRulesString = this._updateUsedRules(this._listRules, this._usedRules);
        this.changesRrules(this._listRules, this._usedRules);
    }
    private _readDBLists(): any {
        const query_list = ALL_ROWS;
        const req_list = { 'SEV_RULE': query_list };
        this._apiSrv.read(req_list).then(list => {
            this._listRules = list;
            if (list && list.length && !this.isNewRecord) {
                this._readUsedRules(list);
            }
        });
    }

    private _readUsedRules(list: any) {
        const query_used = { criteries: { ['ISN_PARTICIPANT']: String(this.data.rec['ISN_LCLASSIF']) } };
        const req_used = { 'SEV_PARTICIPANT_RULE': query_used };
        this._apiSrv.read(req_used).then(used => {
            if (used && used.length) {
                used.forEach(el => {
                    const n = list.find(e => el['ISN_RULE'] === e['ISN_LCLASSIF']);
                    if (n) {
                        this._usedRules.push(n);
                    }
                });
                this._usedRulesString = this._updateUsedRules(list, this._usedRules);
            }
            this._flagSetOrigin = false;
        });
    }

    private _updateUsedRules(list: any, used: any): string {

        let res = '';
        const spdata = [];
        for (let i = 0; i < used.length; i++) {
            const element = list.find(l => used[i]['ISN_LCLASSIF'] === l['ISN_LCLASSIF']);
            if (element) {
                res += element['CLASSIF_NAME'] + '; ';
                const ob = {
                    __metadata: { __type: 'SEV_PARTICIPANT_RULE' },
                    CompositePrimaryKey: String(this.data.rec['ISN_LCLASSIF']) + ' ' + String(element['ISN_LCLASSIF']),
                    ISN_PARTICIPANT: Number(this.data.rec['ISN_LCLASSIF']),
                    ISN_RULE: Number(element['ISN_LCLASSIF']),
                    ORDERNUM: i + 1,
                    //  _State: _ES.Added,
                };
                spdata.push(ob);
                if (this._flagSetOrigin && !this.isNewRecord) {
                    this._originSrules.set(element['ISN_LCLASSIF'], ob);
                }
            }
        }
        this.data.SEV_PARTICIPANT_RULE_List = spdata;

        return res;
    }
    private addDataRule(data: SEV_RULE): SEV_PARTICIPANT_RULE {
        return {
            __metadata: { __type: 'SEV_PARTICIPANT_RULE' },
            ISN_PARTICIPANT: Number(this.data.rec['ISN_LCLASSIF']),
            ISN_RULE: Number(data['ISN_LCLASSIF']),
            ORDERNUM: data.WEIGHT + 1,
            _State: _ES.Added,
        };
    }
    private deletedRules(list: SEV_RULE) {
        return {
            __metadata: { __type: 'SEV_PARTICIPANT_RULE' },
            ISN_PARTICIPANT: Number(this.data.rec['ISN_LCLASSIF']),
            ISN_RULE: Number(list['ISN_LCLASSIF']),
            _State: _ES.Deleted,
        };
    }

    private updateForm(changes: SimpleChanges) {
    }


}
