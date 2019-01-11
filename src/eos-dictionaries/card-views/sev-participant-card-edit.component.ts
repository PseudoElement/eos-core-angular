import { RulesSelectComponent } from './../sev-rules-select/sev-rules-select.component';
import { Component, Injector, OnInit, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { PipRX } from '../../eos-rest';
import { WARN_NO_BINDED_ORGANIZATION } from 'eos-dictionaries/consts/messages.consts';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ALL_ROWS, _ES } from 'eos-rest/core/consts';

@Component({
    selector: 'eos-sev-participant-card-edit',
    templateUrl: 'sev-participant-card-edit.component.html',
    styleUrls: ['./sev-participant-card-edit.component.scss'],
})
export class SevParticipantCardEditComponent extends BaseCardEditComponent implements OnChanges, OnInit {
    _orgName: any;
    hasOrganization: any;
    modalWindow: BsModalRef;

    private _usedRulesString;
    private _usedRules;
    private _listRules;


    constructor(
        injector: Injector,
        private _apiSrv: PipRX,
        private _zone: NgZone,
        private msgSrv: EosMessageService,
        private _modalSrv: BsModalService,
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

    ngOnInit(): void {
        this._usedRules = [];
        this._listRules = [];
        const i = this.inputs['rec.ISN_CHANNEL'];
        i.options = [];

        const req_ch = {'SEV_CHANNEL': []};
        this._apiSrv.read(req_ch)
            .then((rdata: any[]) => {
                rdata.forEach((d) => {
                    i.options.push({ title: d['CLASSIF_NAME'], value: d['ISN_LCLASSIF']});
                });
            });
        this._readDBLists();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    chooseOrganiz() {
        const config = this.dictSrv.getApiConfig();
        if (config) {
            const pageUrl = config.webBaseUrl + '/Pages/Classif/ChooseClassif.aspx?';
            const params = 'Classif=CONTACT&value_id=__ClassifIds&skip_deleted=True&select_nodes=False&select_leaf=True&return_due=True';
            this._zone.runOutsideAngular(() => {
                window.open(pageUrl + params, 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');
                window['endPopup'] = (due) => {
                    this._zone.run(() => this.bindOrganization(due));
                };
            });
        }
    }

    bindOrganization(orgDue: string) {
        const dues = orgDue ? orgDue.split('|') : [''];
        this.dictSrv.bindOrganization(dues[0])
            .then((org) => {
                if (org) {
                    this._orgName = org['CLASSIF_NAME'];
                    this.setValue('rec.DUE_ORGANIZ', org.DUE);
                    this.setValue('rec.CLASSIF_NAME', org['CLASSIF_NAME']);
                }
            });
    }

    unbindOrganization() {
        if (this.hasOrganization) {
            this._orgName = '';
            this.data.organization = null;
            this.setValue('rec.DUE_LINK_ORGANIZ', null);
        } else {
            this.msgSrv.addNewMessage(WARN_NO_BINDED_ORGANIZATION);
        }
    }

    chooseRules() {
        this.modalWindow = null;
            this.modalWindow = this._modalSrv.show(RulesSelectComponent, {class: 'sev-rules-select-modal modal-lg'});
            this.modalWindow.content.initbyLists(this._listRules, this._usedRules);

        if (this.modalWindow) {
            const subscription = this.modalWindow.content.onChoose.subscribe((res) => {
                this._usedRulesString = this._updateUsedRules(res.list, res.used);
                subscription.unsubscribe();
            });
        }
    }

    getStringUsedRules (): string {
        if (this._usedRulesString) {
            return this._usedRulesString;
        }
        return '...';
    }

    private _readDBLists(): any {
        const query_list = ALL_ROWS;
        const req_list = {'SEV_RULE': query_list};
        this._apiSrv.read(req_list).then(list => {
            this._listRules = list;
            if (list && list.length && !this.isNewRecord) {
                this._readUsedRules(list);
            }
        });
    }

    private _readUsedRules(list: any) {
        const query_used = {criteries: {['ISN_PARTICIPANT']: String(this.data.rec['ISN_LCLASSIF'])}};
        const req_used = {'SEV_PARTICIPANT_RULE': query_used };
        this._apiSrv.read(req_used).then(used => {
            if (used && used.length) {
                used.forEach(el => {
                    const n = list.find( e => el['ISN_RULE'] === e['ISN_LCLASSIF']);
                    if (n) {
                        this._usedRules.push(n);
                    }
                });
                this._usedRulesString = this._updateUsedRules(list, this._usedRules);
            }
        });
    }

    private _updateUsedRules(list: any, used: any): string {
        let res = '';
        const spdata = [];
        for (let i = 0; i < used.length; i++) {
            const element = list.find( l => used[i]['ISN_LCLASSIF'] === l['ISN_LCLASSIF']);
            if (element) {
                res += element['CLASSIF_NAME'] + '; ';
                const ob = {
                    __metadata: { __type: 'SEV_PARTICIPANT_RULE' },
                    CompositePrimaryKey: String(this.data.rec['ISN_LCLASSIF']) + ' ' + String(element['ISN_LCLASSIF']),
                    ISN_PARTICIPANT: Number(this.data.rec['ISN_LCLASSIF']),
                    ISN_RULE: Number(element['ISN_LCLASSIF']),
                    ORDERNUM: i + 1,
                    _State: _ES.Added,
                };
                spdata.push(ob);
            }
        }
        this.data.SEV_PARTICIPANT_RULE_List = spdata;

        return res;
    }

    private updateForm(changes: SimpleChanges) {
    }


}
