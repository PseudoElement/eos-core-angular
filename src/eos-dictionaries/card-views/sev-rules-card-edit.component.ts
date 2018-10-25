import { Component, Injector } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';

@Component({
    selector: 'eos-sev-rules-card-edit',
    templateUrl: 'sev-rules-card-edit.component.html',
    styleUrls: ['./sev-rules-card-edit.component.scss'],
})
export class SevRulesCardEditComponent extends BaseCardEditComponent {
    constructor(injector: Injector) {
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
}
