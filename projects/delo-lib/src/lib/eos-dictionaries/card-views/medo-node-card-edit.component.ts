import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';
import { PipRX } from '../../eos-rest';
import { ORGANIZ_CL } from '../../eos-rest';
import { Subject } from 'rxjs';
import { Validators } from '@angular/forms';

@Component({
    selector: 'eos-medo-node-card',
    templateUrl: 'medo-node-card-edit.component.html',
    styleUrls: ['./medo-node-card-edit.component.scss']
})
export class MedoNodeCardComponent extends BaseCardEditDirective implements OnInit, OnDestroy {
    showDoc: boolean;
    showDocOrgList: ORGANIZ_CL[] = [];
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
        this.showDoc = true;
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
    getOrganizWithTypeMedo() {
        if (this.data && this.data.rec && this.data.rec['ISN_LCLASSIF']) {
            this._apiSrv.read({
                ORGANIZ_CL: {
                    criteries: {
                        'CONTACT.MEDO_ID': this.data.rec['ISN_LCLASSIF'],
                    }
                }
            })
            .then((data: any[]) => {
                this.showDocOrgList = data;
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
