import { Component, Injector, OnInit } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { OPEN_CLASSIF_LINK_CL, OPEN_CLASSIF_SECURITY_CL } from 'eos-user-select/shered/consts/create-user.consts';
import { LINK_CL, SECURITY_CL, DEPARTMENT, ORGANIZ_CL } from 'eos-rest';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';

@Component({
    selector: 'eos-sev-rules-card-edit',
    templateUrl: 'sev-rules-card-edit.component.html',
    styleUrls: ['./sev-rules-card-edit.component.scss'],
})
export class SevRulesCardEditComponent extends BaseCardEditComponent implements OnInit {
    public linkTypeListNames = [];
    public fileAccessNames = [];
    public securityLink = [];
    private _errorHelper: ErrorHelperServices;
    constructor(injector: Injector,
        private _waitClassif: WaitClassifService
    ) {
        super(injector);
        this._errorHelper = injector.get(ErrorHelperServices);
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
        return this.getValue('rec.visa');
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
    get fileAccesRK() {
        return this.getControl('rec.fileAccessListRk');
    }
    get RuleKind() {
        return this.getControl('rec.RULE_KIND');
    }
    ngOnInit() {
        super.ngOnInit();
        this.afterGetFrom();
        this.form.controls['rec.type'].valueChanges.subscribe(value => {
            this.updateRule_Kind(+value);
            this.loadGrifsNames(value);
        });

    }
    afterGetFrom() {
        this.loadLinksNames();
        this.loadGrifsNames(this.typeDoc);
        this.checkKind();
        this.dictSrv['_apiSrv'].read({ DEPARTMENT: { criteries: { 'DUE_LINK_ORGANIZ': 'isnotnull' } } }).then((d: DEPARTMENT[]) => {
            let idsOrganiz: string[] = [];
            const options = new Map();
            if (d && d.length) {
                idsOrganiz = d.map(i => {
                    options.set(i.DUE_LINK_ORGANIZ, { value: i.DUE, title: '' });
                    return i.DUE_LINK_ORGANIZ;
                });
            }
            this.dictSrv['_apiSrv'].read({ ORGANIZ_CL: idsOrganiz }).then((o: ORGANIZ_CL[]) => {
                const due_depInput = this.inputs['rec.DUE_DEP'];
                o.forEach((e: ORGANIZ_CL) => {
                    const val = options.get(e.DUE);
                    val.title = e.CLASSIF_NAME;
                    due_depInput.options.push(val);
                });
            });
        });
    }
    checkKind() {
        if (String(this.RuleKind.value) !== '1' && String(this.RuleKind.value) !== '5' && this.editMode) {
            const error = { code: 2000, message: 'Данный вид правила не поддерживается. Доступный вид правила: "Отправка документов"' };
            this.RuleKind.patchValue('1');
            this._errorHelper.errorHandler(error);
        }
    }
    openLinkCl() {
        this.openClassifLikc();
    }
    openSecurityCl(value) {
        this.openClassiSecurity(value);
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
        formKind.patchValue(1, { emitEvent: false });
        if (value === 1) {
            formRuleKind.patchValue(1);
        } else {
            formRuleKind.patchValue(5);
        }
    }
    // private updateOnlyKind(value: number): void {
    //     const type = this.form.controls['rec.type'].value;
    //     const kind = this.form.controls['rec.RULE_KIND'];
    //     console.log(type);
    //     if (type === 1) {
    //         kind.patchValue(value);
    //     } else {
    //         kind.patchValue(value + 4);
    //     }
    // }
    private openClassifLikc() {
        if (this.linkTypeListControl.value && this.linkTypeListControl.value !== 'null') {
            OPEN_CLASSIF_LINK_CL.selected = this.linkTypeListControl.value;
        }
        this._waitClassif.openClassif(OPEN_CLASSIF_LINK_CL).then(data => {
            this.linkTypeListControl.patchValue(data);
            this.loadLinksNames();
        }).catch(e => {
            if (e) {
                this._errorHelper.errorHandler(e);
            }
        });
    }
    private openClassiSecurity(value) {
        const control = this.form.controls[value];
        if (control.value && control.value !== 'null') {
            OPEN_CLASSIF_SECURITY_CL.selected = control.value;
        } else {
            OPEN_CLASSIF_SECURITY_CL.selected = '';
        }
        this._waitClassif.openClassif(OPEN_CLASSIF_SECURITY_CL).then(data => {
            control.patchValue(data);
            this.loadGrifsNames(this.typeDoc);
        }).catch(e => {
            if (e) {
                this._errorHelper.errorHandler(e);
            }
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
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
        }
    }
    private loadGrifsNames(value) {
        this.fileAccessNames = [];
        let control;
        if (String(value) === '1') {
            control = this.fileAcces;
        }
        if (String(value) === '2') {
            control = this.fileAccesRK;
        }
        if (control.value && control.value !== 'null') {
            this.dictSrv.currentDictionary.descriptor.loadNames('SECURITY_CL', control.value).then((names: SECURITY_CL[]) => {
                names.forEach((n: SECURITY_CL) => {
                    this.fileAccessNames.push(n.GRIF_NAME);
                });
            }).catch(e => {
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
        }
    }
}
