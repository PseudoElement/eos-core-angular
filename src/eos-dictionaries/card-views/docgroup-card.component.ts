import {Component, Injector, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DocgroupTemplateConfigComponent } from '../docgroup-template-config/docgroup-template-config.component';
import { Validators } from '@angular/forms';
import { RK_TYPE_OPTIONS } from '../consts/dictionaries/docgroup.consts';
import { CB_FUNCTIONS } from 'eos-rest/services/appContext.service';
import { Features } from 'eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from 'eos-dictionaries/features/features.interface';
import { EosUtils } from 'eos-common/core/utils';
import { SelectorListItem } from 'eos-dictionaries/dict-forms/list-selector-modal/list-selector-form.component';
import { SHABLON_DETAIL } from 'eos-rest';

const AUTO_REG_EXPR = /\{(9|A|B|C|@|1#|2#|3#)\}/;
const UNIQ_CHECK_EXPR = /\{2|E\}/;

@Component({
    selector: 'eos-docgroup-card',
    templateUrl: 'docgroup-card.component.html',
})
export class DocgroupCardComponent extends BaseCardEditComponent implements OnChanges, OnInit {
    isSignatura: boolean;
    private _prev = {};


    get isPrjFlag(): boolean {
        return this.getValue('rec.PRJ_NUM_FLAG');
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
    get accessMode() {
        return this.getValue('rec.ACCESS_MODE');
    }

    private modalSrv: BsModalService;
    private templateModal: BsModalRef;

    constructor(
        injector: Injector,
    ) {
        super(injector);
        this.modalSrv = injector.get(BsModalService);
        this.appctx.get99UserParms('ANCUD').then((value) => {
            this.isSignatura = value && value.PARM_VALUE === 'SIGNATURA';
        });

    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.form) {
            this._setRcTypeOptions();

            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.updateForm({});
        this._setRequired('rec.SHABLON', !this.isNode);

        this.isCBBase = this.appctx.getParams(CB_FUNCTIONS) === 'YES';
        this.isNadzor = Features.cfg.variant === EOSDICTS_VARIANT.Nadzor;
    }

    dataShablonDetail (): [] {
        if (!this.data['SHABLON_DETAIL_List']) {
            this.data['SHABLON_DETAIL_List'] = [];
        }

        return this.data['SHABLON_DETAIL_List']/*.filter( rec => rec['CONSTR_TYPE'] === 'L')*/.map(rec =>
            <SelectorListItem>Object.assign({}, {key: rec['ISN_LCLASSIF'], CONSTR_TYPE: rec['CONSTR_TYPE'], element: rec['ELEMENT'].trim(), title: '', obj: null }
        ));
    }

    editTemplate(forProject = false) {
        this.templateModal = this.modalSrv.show(DocgroupTemplateConfigComponent, { class: 'docgroup-template-modal modal-lg' });
        const path = forProject ? 'rec.PRJ_SHABLON' : 'rec.SHABLON';
        const modalObj = (<DocgroupTemplateConfigComponent>this.templateModal.content);
        modalObj.forProject = forProject;
        const additionalData = Object.assign ({},
                { SHABLON_DETAIL_List: this.dataShablonDetail(), },
                forProject ? { COPY_NUMBER_FLAG_PRJ: this.getValue('rec.COPY_NUMBER_FLAG_PRJ') || 0} : {COPY_NUMBER_FLAG: this.getValue('rec.COPY_NUMBER_FLAG') || 0}
            );
        modalObj.additionalData = additionalData;
        modalObj.dgTemplate = this.getValue(path);
        modalObj.rcType = this.rcType * 1;
        modalObj.allowEmpty = (forProject ? false : this.isNode);
        modalObj.init();
        modalObj.onSave.subscribe(([template, outdata]) => {
            if (outdata && !EosUtils.isObjEmpty(outdata)) {
                for (const key in outdata) {
                    if (outdata.hasOwnProperty(key)) {
                        if (key === 'SHABLON_DETAIL_List') {
                            if (!this.data[key]) {
                                this.data[key] = [];
                            }
                            // добавленные
                            outdata[key].forEach( d => {
                                const ex = this.data[key].find ( saved =>
                                    saved['ELEMENT'].trim() === d.element &&
                                    saved['CONSTR_TYPE'] === d.CONSTR_TYPE &&
                                    saved['ISN_LCLASSIF'] === d.key
                                    );
                                if (!ex) {
                                    this.data[key].push(<SHABLON_DETAIL>{
                                        CONSTR_TYPE: d.CONSTR_TYPE,
                                        DUE: this.data.rec['DUE'],
                                        ELEMENT: d.element + ' ', // так в базе зачем-то
                                        ISN_LCLASSIF: d.key,
                                    });
                                } else {
                                    // проверить на метку deleted
                                }
                            });
                            // удаленные
                            this.data[key].forEach (saved => {
                                const ex = outdata[key].find ( d =>
                                    saved['ELEMENT'].trim() === d.element &&
                                    saved['CONSTR_TYPE'] === d.CONSTR_TYPE &&
                                    saved['ISN_LCLASSIF'] === d.key
                                    );
                                if (!ex) {

                                }
                            });

                        } else {
                            const value = outdata[key];
                            this.setValue('rec.' + key, value);
                        }
                    }
                }
            }

            this.setValue(path, template);
        });
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

    private _setRcTypeOptions() {
        const rkTypeInput = this.inputs['rec.RC_TYPE'];
        if (rkTypeInput && !this.isNode) {
                rkTypeInput.options = RK_TYPE_OPTIONS;
        }
    }

    private updateForm(formChanges: any) {
        this.unsubscribe();
        const updates = {};

        const tpl = formChanges['rec.SHABLON'];

        const isRcTypeChanged = this._isChanged('rec.RC_TYPE', formChanges);

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

        // toggle auto register flag
        this.toggleInput(this.isPrjFlag && !AUTO_REG_EXPR.test(tpl), 'rec.PRJ_AUTO_REG', formChanges, updates);

        // toggle auto remove flag
        this.toggleInput(this.isPrjFlag, 'rec.PRJ_DEL_AFTER_REG', formChanges, updates);

        if (this.eDocument && this.getValue('rec.IS_COPYCOUNT')) {
            this.setValue('rec.IS_COPYCOUNT', false);
        }

        if (UNIQ_CHECK_EXPR.test(tpl)) {
            this.setValue('rec.TEST_UNIQ_FLAG', false);
        }

        if (Object.keys(updates).length) {
            this.form.patchValue(updates);
        }
        if (!formChanges['rec.ACCESS_MODE'] && formChanges.hasOwnProperty('rec.ACCESS_MODE')) {
            this.setValue('rec.ACCESS_MODE_FIXED', false);
        }

        Object.assign(this._prev, formChanges);
        this.formChanges$ = this.form.valueChanges.subscribe((fc) => this.updateForm(fc));
    }
}
