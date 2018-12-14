import {Component, Injector, OnChanges, SimpleChanges} from '@angular/core';
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

    private _prev = {};

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

    ngOnChanges(changes: SimpleChanges) {
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
            rcType: this.rcType * 1
        };

        this.templateModal.content.init(content);

        this.templateModal.content.onSave.subscribe((template) => this.setValue(path, template));
    }

    private _isChanged(path, changes): boolean {
        return this._prev[path] !== changes[path];
    }

    private _restorePrevious(path) {
        if (this._prev[path]) {
            this.setValue(path, this._prev[path]);
        }
    }

    private updateForm(formChanges: any) {
        this.unsubscribe();
        const updates = {};

        const tpl = formChanges['rec.SHABLON'];

        if (this._isChanged('rec.RC_TYPE', formChanges)) {
            if (this.rcType * 1 === 3) {
                this._restorePrevious('rec.SHABLON');
                this._restorePrevious('rec.PRJ_NUM_FLAG');
            } else {
                this.setValue('rec.SHABLON', this.getValue('rec.SHABLON').replace('{N}', ''));
                this.setValue('rec.PRJ_NUM_FLAG', null);
            }
        }

        if (this._isChanged('rec.RC_TYPE', formChanges) || this._isChanged('rec.PRJ_NUM_FLAG', formChanges)) {
            if (!this.isPrjFlag) {
                this.setValue('rec.PRJ_SHABLON', null);
            } else {
                this._restorePrevious('rec.PRJ_SHABLON');
            }
        }

        this.inputs['rec.PRJ_SHABLON'].required = this.isPrjFlag;
        this.toggleInput(this.isPrjFlag, 'rec.PRJ_SHABLON', formChanges, updates);

        // toggle auto register flag
        this.toggleInput(this.isPrjFlag && !AUTO_REG_EXPR.test(tpl), 'rec.PRJ_AUTO_REG', formChanges, updates);

        // toggle auto remove flag
        this.toggleInput(this.isPrjFlag, 'rec.PRJ_DEL_AFTER_REG', formChanges, updates);

        if (UNIQ_CHECK_EXPR.test(tpl)) {
            this.setValue('rec.TEST_UNIQ_FLAG', false);
        }

        if (Object.keys(updates).length) {
            this.form.patchValue(updates);
        }

        Object.assign(this._prev, formChanges);
        this.formChanges$ = this.form.valueChanges.subscribe((fc) => this.updateForm(fc));
    }
}
