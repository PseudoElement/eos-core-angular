import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';
import { PipRX } from '../../eos-rest';
import { ORGANIZ_CL } from '../../eos-rest';
import { Subject } from 'rxjs';
import { Validators } from '@angular/forms';
import { TOOLTIP_DELAY_VALUE } from '../../eos-common/services/eos-tooltip.service';
import { ConfirmWindowService } from '../../eos-common/index';
import { CONFIRM_MEDO_NODE_UPDATE_DIRECTORY } from '../../app/consts/confirms.const';

@Component({
    selector: 'eos-medo-node-card',
    templateUrl: 'medo-node-card-edit.component.html',
    styleUrls: ['./medo-node-card-edit.component.scss']
})
export class MedoNodeCardComponent extends BaseCardEditDirective implements OnInit, OnDestroy {
    showDoc: boolean;
    showDocOrgList: ORGANIZ_CL[] = [];
    tooltipDelay = TOOLTIP_DELAY_VALUE;
    hashPass: string = 'хеш пароля';
    public flagSort: boolean = false;
    public type1: string = 'password';
    public medoPass: string = '';
    private ngUnsubscribe: Subject<any> = new Subject();
    get showClass() {
        return this.showDoc ? 'eos-icon-open-folder-blue' : 'eos-icon-close-folder-blue';
    }
    get classSort() {
        return this.flagSort ? 'eos-icon-arrow-blue-top' : 'eos-icon-arrow-blue-bottom';
    }
    constructor(injector: Injector,
        private _apiSrv: PipRX,
        private _confirmSrv: ConfirmWindowService,
        ) {
        super(injector);
    }
    get typeInput(): string {
        return !this.form.controls['rec.PASSWORD'].value ? 'text' : this.type1;
    }
    get errorPass(): boolean {
        return this.medoPass === '' && !this.data.rec['ISN_LCLASSIF'];
    }
    ngOnInit(): void {
        this.showDoc = false;
        if (!this.data.rec['ISN_LCLASSIF']) {
            this.inputs['rec.PASSWORD'].required = true;
            this.form.controls['rec.PASSWORD'].setValidators([Validators.required]);
        }
        super.ngOnInit();
        this.getOrganizWithTypeMedo();
    }
    onKeyUp($event) {
        this.setValue('rec.PASSWORD', this.medoPass, true);
    }
    setVision() {
        this.type1 = 'text';
    }
    resetVision() {
        this.type1 = 'password';
    }
    onAfterLoadRelated() {
        super.onAfterLoadRelated();
    }
    public confirmSave(): Promise<boolean> {
        if (this.dictSrv.currentNode && this.data.rec['DIRECTORY'] !== this.dictSrv.currentNode.data.rec._orig['DIRECTORY']) {
            return this._confirmSrv.confirm2(CONFIRM_MEDO_NODE_UPDATE_DIRECTORY).then((res) => {
                if (res && res.result === 2) {
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            });
        } else {
            return Promise.resolve(true); 
        }
    }
    getOrganizWithTypeMedo() {
        if (this.data && this.data.rec && this.data.rec['ISN_LCLASSIF']) {
            const allAray = [];
            allAray.push(this._apiSrv.read({
                MEDO_PARTICIPANT: {
                    criteries: {
                        'ISN_MAIN_NODE': this.data.rec['ISN_LCLASSIF'],
                    }
                }
            }));
            allAray.push(this._apiSrv.read({
                MEDO_PARTICIPANT: {
                    criteries: {
                        'ISN_DSP_NODE ': this.data.rec['ISN_LCLASSIF'],
                    }
                }
            }))
            Promise.all(allAray)
            .then((data) => {
                if (data[0].length > 0 || data[1].length > 0) {
                    const allIsnOrganiz = [];
                    data[0].forEach((d) => {
                        allIsnOrganiz.push(d['ISN_ORGANIZ']); 
                    });
                    data[1].forEach((d) => {
                        allIsnOrganiz.push(d['ISN_ORGANIZ']); 
                    });
                    const promAll = [];
                    promAll.push(this._apiSrv.read({
                        ORGANIZ_CL: {
                            criteries: {
                                'ISN_NODE': allIsnOrganiz.join('|'),
                            }
                        }
                    }));
                    promAll.push( this._apiSrv.read({
                        CONTACT: {
                            criteries: {
                                'ISN_CONTACT': allIsnOrganiz.join('|'),
                            }
                        }
                    }));
                   Promise.all(promAll)
                   .then((data) => {
                        const contact = new Map<number, string>();
                        if (data[1].length > 0) {
                            data[1].forEach((cont) => {
                                contact.set(cont['ISN_CONTACT'], cont['MEDO_ID']);
                            });
                        }
                        if (data[0].length > 0 && data[1].length > 0) {
                            data[0].forEach((org) => {
                                if (contact.has(org['ISN_NODE'])) {
                                    org['MEDO_ID'] = contact.get(org['ISN_NODE']);
                                }
                            });
                        }
                        this.showDocOrgList = data[0];
                   });
                }
            });
        }
    }
    public sortDoc() {
        this.showDocOrgList = this.showDocOrgList.sort((a: ORGANIZ_CL, b: ORGANIZ_CL) => {
            return (this.flagSort ? 1 : -1) * a.CLASSIF_NAME.localeCompare(b.CLASSIF_NAME);
        });
        this.flagSort = !this.flagSort;
    }
    public openDoc() {
        this.showDoc = !this.showDoc;
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
