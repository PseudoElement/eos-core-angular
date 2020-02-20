import { Component, Injector, OnInit } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_LINK_CL, OPEN_CLASSIF_SECURITY_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { LINK_CL, SECURITY_CL } from 'eos-rest';

@Component({
    selector: 'eos-sev-rules-card-edit',
    templateUrl: 'sev-rules-card-edit.component.html',
    styleUrls: ['./sev-rules-card-edit.component.scss'],
})
export class SevRulesCardEditComponent extends BaseCardEditComponent implements OnInit {
    public linkTypeListNames = [];
    public fileAccessNames = [];
    constructor(injector: Injector,
        private _waitClassif: WaitClassifService
    ) {
        super(injector);
    }
    get typeDoc(): number {
        return this.getValue('rec.type');
    }
    get ruleKind(): number {
        return this.getValue('rec.kind');
    }
    get link(): boolean {
        return this.getValue('rec.link');
    }
    get isBunchRKPD(): boolean {
        return this.getValue('rec.LinkPD');
    }
    get isLinkKindWithType(): boolean {
        return this.getValue('rec.linkKind') === 1;
    }
    get address(): boolean {
        return this.getValue('rec.address');
    }
    get addressee(): boolean {
        return this.getValue('rec.addressee');
    }
    get file(): boolean {
        return this.getValue('rec.file');
    }
    get taskFile(): boolean {
        return this.getValue('rec.taskFile');
    }
    get item(): boolean {
        return this.getValue('rec.item');
    }
    get resolution(): boolean {
        return this.getValue('rec.resolution');
    }
    get orders(): boolean {
        return this.getValue('rec.orders');
    }
    get forwardingDocs(): boolean {
        return this.getValue('rec.forwardingDocs');
    }
    get consideration(): boolean {
        return this.getValue('rec.Consideration');
    }
    get executors(): boolean {
        return this.getValue('rec.executors');
    }
    get executorFiles(): boolean {
        return this.getValue('rec.executorFiles');
    }
    get editSet(): boolean {
        return this.getValue('rec.editSet');
    }
    get reportExecution(): boolean {
        return this.getValue('rec.reportExecution');
    }
    get executorsProject(): boolean {
        return this.getValue('rec.executorsProject');
    }
    get dateExecutionProject(): boolean {
        return this.getValue('rec.dateExecutionProject');
    }
    get Visa(): boolean {
        return this.getValue('rec.Visa');
    }
    get VisaInfo(): boolean {
        return this.getValue('rec.VisaInfo');
    }
    get signatures(): boolean {
        return this.getValue('rec.signatures');
    }
    get signaturesInfo(): boolean {
        return this.getValue('rec.signaturesInfo');
    }
    get visaForward(): boolean {
        return this.getValue('rec.visaForward');
    }
    get signatureForward(): boolean {
        return this.getValue('rec.signatureForward');
    }
    get forwardingVisa(): boolean {
        return this.getValue('rec.forwardingVisa');
    }
    get forwardingSign(): boolean {
        return this.getValue('rec.forwardingSign');
    }
    get reportVisa(): boolean {
        return this.getValue('rec.reportVisa');
    }
    get reportSign(): boolean {
        return this.getValue('rec.reportSign');
    }
    get infoVisaign(): boolean {
        return this.getValue('rec.infoVisaign');
    }
    get linkTypeListControl() {
        return this.getControl('rec.linkTypeList');
    }
    get fileAcces() {
        return this.getControl('rec.fileAccessList');
    }
    ngOnInit() {
        super.ngOnInit();
        console.log(this.form);
        this.loadLinksNames();
        this.loadGrifsNames();
        this.form.controls['rec.type'].valueChanges.subscribe(value => {
            this.updateRule_Kind(+value);
        });
        this.form.controls['rec.kind'].valueChanges.subscribe(value => {
            this.updateOnlyKind(+value);
        });
    }
    openLinkCl() {
        this.openClassifLikc();
    }
    openSecurityCl() {
        this.openClassiSecurity();
    }
    public deleteFieldsNames(name) {
        switch (name) {
            case 'rec.linkTypeList':
                this.linkTypeListControl.patchValue('');
                this.linkTypeListNames = [];
                break;
            case 'rec.fileAccessList':
                this.fileAcces.patchValue('');
                this.fileAccessNames = [];
                break;
        }
    }

    private updateRule_Kind(value: number): void {
        const formRuleKind = this.form.controls['rec.RULE_KIND'];
        const formKind = this.form.controls['rec.kind'];
        formKind.patchValue(1);
        if (value === 1) {
            formRuleKind.patchValue(1);
        } else {
            formRuleKind.patchValue(5);
        }
    }
    private updateOnlyKind(value: number): void {
        const type = this.form.controls['rec.type'].value;
        const kind = this.form.controls['rec.RULE_KIND'];
        if (type === 1) {
            kind.patchValue(value);
        } else {
            kind.patchValue(value + 4);
            console.log((value + 4));
        }
    }
    private openClassifLikc() {
        if (this.linkTypeListControl.value && this.linkTypeListControl.value !== 'null') {
            OPEN_CLASSIF_LINK_CL.selected = this.linkTypeListControl.value;
        }
        this._waitClassif.openClassif(OPEN_CLASSIF_LINK_CL).then(data => {
            this.linkTypeListControl.patchValue(data);
            this.loadLinksNames();
        }).catch(e => {

        });
    }
    private openClassiSecurity() {
        if (this.fileAcces.value && this.fileAcces.value !== 'null') {
            OPEN_CLASSIF_SECURITY_CL.selected = this.fileAcces.value;
        }
        this._waitClassif.openClassif(OPEN_CLASSIF_SECURITY_CL).then(data => {
            this.fileAcces.patchValue(data);
            this.loadGrifsNames();
        }).catch(e => {

        });
    }
    private loadLinksNames() {
        if (this.linkTypeListControl.value && this.linkTypeListControl.value !== 'null') {
            this.dictSrv.currentDictionary.descriptor.loadNames('LINK_CL', this.linkTypeListControl.value).then((names: LINK_CL[]) => {
                this.linkTypeListNames = [];
                names.forEach((n: LINK_CL) => {
                    this.linkTypeListNames.push(n.CLASSIF_NAME);
                });
            }).catch(e => {
                console.log(e);
            });
        }
    }
    private loadGrifsNames() {
        if (this.fileAcces.value && this.fileAcces.value !== 'null') {
            this.dictSrv.currentDictionary.descriptor.loadNames('SECURITY_CL', this.fileAcces.value).then((names: SECURITY_CL[]) => {
                this.fileAccessNames = [];
                names.forEach((n: SECURITY_CL) => {
                    this.fileAccessNames.push(n.GRIF_NAME);
                });
            }).catch(e => {
                console.log(e);
            });
        }
    }
}
