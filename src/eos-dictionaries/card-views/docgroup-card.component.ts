import {Component, Injector, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocgroupTemplateConfigComponent } from '../docgroup-template-config/docgroup-template-config.component';
import {Validators} from '@angular/forms';

const AUTO_REG_EXPR = /\{(9|A|B|C|@|1#|2#|3#)\}/;
const UNIQ_CHECK_EXPR = /\{2|E\}/;

@Component({
    selector: 'eos-docgroup-card',
    templateUrl: 'docgroup-card.component.html',
})
export class DocgroupCardComponent extends BaseCardEditComponent implements OnChanges, OnInit {

    private _prev = {};


    get isPrjFlag(): boolean {
        return this.getValue('rec.PRJ_NUM_FLAG');
    }

    get havesRC(): boolean {
        return (this.data['DOC_RC_List'] && this.data['DOC_RC_List'].length !== 0);
    }

    get isNode(): boolean {
        return (this.data.rec['IS_NODE'] !== undefined && this.data.rec['IS_NODE'] === 0);
        // return this.data.rec['IS_NODE'] === 1;
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

    ngOnInit(): void {
        super.ngOnInit();
        this.updateForm({});
        this._setRequired('rec.SHABLON', !this.isNode);
    }

    editTemplate(forProject = false) {
        this.templateModal = this.modalSrv.show(DocgroupTemplateConfigComponent, { class: 'docgroup-template-modal modal-lg' });
        const path = forProject ? 'rec.PRJ_SHABLON' : 'rec.SHABLON';
        const content = {
            forProject: forProject,
            dgTemplate: this.getValue(path),
            rcType: this.rcType * 1,
            allowEmpty: (forProject ? false : this.isNode),
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

    private _setRequired(path: string, isRequired: boolean) {
        const control = this.form.controls[path];
        if (control) {
            control.setValidators(isRequired ? Validators.required : null);
            control.updateValueAndValidity();
        }
    }

    private updateForm(formChanges: any) {
        this.unsubscribe();
        const updates = {};

        const tpl = formChanges['rec.SHABLON'];

        let isRcTypeChanged = this._isChanged('rec.RC_TYPE', formChanges);

        if (!this.isNode) {
            if (this._isChanged('rec.RC_TYPE_NODE', formChanges)) {
                this.setValue('rec.RC_TYPE', this.getValue('rec.RC_TYPE_NODE'));
                isRcTypeChanged = true;
            }
        } else {
            if (this._isChanged('rec.RC_TYPE', formChanges)) {
                this.setValue('rec.RC_TYPE_NODE', this.getValue('rec.RC_TYPE'));
                isRcTypeChanged = true;
            }
        }

        if (isRcTypeChanged) {
            if (this.rcType * 1 === 3) {
                this._restorePrevious('rec.SHABLON');
                this._restorePrevious('rec.PRJ_NUM_FLAG');
            } else {
                if (tpl) {
                    this.setValue('rec.SHABLON', tpl.replace('{N}', ''));
                }
                this.setValue('rec.PRJ_NUM_FLAG', null);
            }
        }

        if (isRcTypeChanged || this._isChanged('rec.PRJ_NUM_FLAG', formChanges)) {
            if (!this.isPrjFlag) {
                this.setValue('rec.PRJ_SHABLON', null);
            } else {
                this._restorePrevious('rec.PRJ_SHABLON');
            }
        }

        this._setRequired('rec.PRJ_SHABLON', !this.isNode && this.isPrjFlag);
        // TODO: избавиться от костыля в виде RC_TYPE_NODE

        // toggle auto register flag
        this.toggleInput(this.isPrjFlag && !AUTO_REG_EXPR.test(tpl), 'rec.PRJ_AUTO_REG', formChanges, updates);

        // toggle auto remove flag
        this.toggleInput(this.isPrjFlag, 'rec.PRJ_DEL_AFTER_REG', formChanges, updates);

        this.setValue('rec.RC_TYPE_NODE', this.getValue('rec.RC_TYPE'));

        if (this.eDocument && this.getValue('rec.IS_COPYCOUNT')) {
            this.setValue('rec.IS_COPYCOUNT', false);
        }

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
