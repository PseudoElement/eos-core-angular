import { Component, Injector, OnChanges, OnDestroy } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { Subscription } from 'rxjs/Subscription';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocgroupTemplateConfigComponent } from '../docgroup-template-config/docgroup-template-config.component';

const AUTO_REG_EXPR = /\{(9|A|B|C|@|1#|2#|3#)\}/;
const UNIQ_CHECK_EXPR = /\{2\}/;

@Component({
    selector: 'eos-docgroup-card',
    templateUrl: 'docgroup-card.component.html',
})
export class DocgroupCardComponent extends BaseCardEditComponent implements OnChanges, OnDestroy {

    get isPrjFlag(): boolean {
        return this.getValue('rec.PRJ_NUM_FLAG');
    }

    private formChanges$: Subscription;
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
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => {
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
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    editTemplate(forProject = false) {
        this.templateModal = this.modalSrv.show(DocgroupTemplateConfigComponent, { class: 'docgroup-template-modal modal-lg' });
        const path = forProject ? 'rec.PRJ_SHABLON' : 'rec.SHABLON';
        const content = {
            forProject: forProject,
            dgTemplate: this.getValue(path)
        };

        this.templateModal.content.init(content);

        this.templateModal.content.onSave.subscribe((template) => this.setValue(path, template));
    }

    private toggleInput(enable: boolean, path: string, formChanges: any, updates: any) {
        if (this.form.controls[path]) {
            if (enable) {
                if (this.form.controls[path].disabled) {
                    this.form.controls[path].enable();
                }
            } else {
                if (this.form.controls[path].enabled) {
                    this.form.controls[path].disable();
                    if (formChanges[path]) {
                        updates[path] = null;
                    }
                }
            }
        }
    }

    private unsubscribe() {
        if (this.formChanges$) {
            this.formChanges$.unsubscribe();
        }
    }
}