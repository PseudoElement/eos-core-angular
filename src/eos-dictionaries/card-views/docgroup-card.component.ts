import { Component, Injector, OnChanges } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocgroupTemplateConfigComponent } from '../docgroup-template-config/docgroup-template-config.component';

const AUTO_REG_EXPR = /\{(9|A|B|C|@|1#|2#|3#)\}/;
const UNIQ_CHECK_EXPR = /\{2|E\}/;

@Component({
    selector: 'eos-docgroup-card',
    templateUrl: 'docgroup-card.component.html',
})
export class DocgroupCardComponent extends BaseCardEditComponent implements OnChanges {

    get isPrjFlag(): boolean {
        return this.getValue('rec.PRJ_NUM_FLAG');
    }

    get isNode(): boolean {
        return this.getValue('rec.IS_NODE');
    }

    get eDocument(): boolean {
        return this.getValue('rec.E_DOCUMENT');
    }

    get rcType(): number {
        return this.getValue('rec.RC_TYPE');
    }

    private modalSrv: BsModalService;
    private templateModal: BsModalRef;

    constructor(
        injector: Injector,
    ) {
        super(injector);
        this.modalSrv = injector.get(BsModalService);
    }

    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    editTemplate(forProject = false) {
        this.templateModal = this.modalSrv.show(DocgroupTemplateConfigComponent, { class: 'docgroup-template-modal modal-lg' });
        const path = forProject ? 'rec.PRJ_SHABLON' : 'rec.SHABLON';
        const content = {
            forProject: forProject,
            dgTemplate: this.getValue(path),
            rcType: this.rcType
        };

        this.templateModal.content.init(content);

        this.templateModal.content.onSave.subscribe((template) => this.setValue(path, template));
    }

    private updateForm(formChanges: any) {
        const updates = {};
        const flags: any = {};
        const tpl = formChanges['rec.SHABLON'];
        flags.isPrjFlagVisible = (formChanges['rec.RC_TYPE'] * 1 === 3);

        // toggle progect flag
        this.toggleInput(flags.isPrjFlagVisible, 'rec.PRJ_NUM_FLAG', formChanges, updates);
        flags.prjTemplate = flags.isPrjFlagVisible && formChanges['rec.PRJ_NUM_FLAG'];

        // toggle project template
        this.toggleInput(flags.prjTemplate, 'rec.PRJ_SHABLON', formChanges, updates);
        this.inputs['rec.PRJ_SHABLON'].required = flags.prjTemplate;

        // toggle auto register flag
        this.toggleInput(flags.prjTemplate && !AUTO_REG_EXPR.test(tpl),
            'rec.PRJ_AUTO_REG', formChanges, updates);

        // toggle auto remove flag
        this.toggleInput(flags.prjTemplate, 'rec.PRJ_DEL_AFTER_REG', formChanges, updates);

        // toggle check uniqueness flag
        this.toggleInput(!UNIQ_CHECK_EXPR.test(tpl),
            'rec.TEST_UNIQ_FLAG', formChanges, updates);

        if (Object.keys(updates).length) {
            this.form.patchValue(updates);
        }
    }
}
