import { IOpenClassifParams } from '../../eos-common/interfaces';
import { WaitClassifService } from './../../app/services/waitClassif.service';

import { Component, Injector, NgZone, OnChanges, SimpleChanges, OnInit, ViewChild, AfterViewInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BaseCardEditDirective } from './base-card-edit.component';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { SUCCESS_SAVE, WARN_NO_BINDED_ORGANIZATION } from '../consts/messages.consts';
import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { DynamicInputBaseDirective } from '../../eos-common/dynamic-form-input/dynamic-input-base';
import { Features } from '../../eos-dictionaries/features/features-current.const';
import { StampBlobFormComponent } from '../../eos-dictionaries/shablon-blob-form/stamp-blob-form.component';
import { BsModalService } from 'ngx-bootstrap';
import { EosAccessPermissionsService, APS_DICT_GRANT } from '../../eos-dictionaries/services/eos-access-permissions.service';
import { DEPARTMENTS_DICT } from '../../eos-dictionaries/consts/dictionaries/department.consts';
import { CONFIRM_DEPARTMENTS_DATES_FIX, BUTTON_RESULT_YES, CONFIRM_DEPARTMENTS_DATES_FIX1, CONFIRM_DEPCALENDAR_CREATE, CONFIRM_DEPCALENDAR_DELETE } from '../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { AppContext, PipRX } from '../../eos-rest';
import { AddControlsDirective } from '../../eos-common/directives/add-controls.directive';
import { EosCommonOverriveService } from '../../app/services/eos-common-overrive.service';
import { CalendarHelper, CALENDAR_CL_BY_DEP } from '../../eos-dictionaries/helpers/calendars.helper';
import { COMMON_FIELD_NAME } from '../../eos-dictionaries/consts/dictionaries/_common';
import { DepartmentCalendarComponent } from '../../eos-dictionaries/department-calendar/department-calendar.component';


@Component({
    selector: 'eos-departments-card-edit-department',
    templateUrl: 'departments-card-edit-department.component.html',
})
export class DepartmentsCardEditDepartmentComponent extends BaseCardEditDirective implements OnChanges, OnInit, AfterViewInit {
    @ViewChild(AddControlsDirective, { static: true }) addControl!: AddControlsDirective;
    @ViewChild("template", { static: true }) template!: TemplateRef<any>;
    @ViewChild("gas_ps", { static: true, read: ViewContainerRef }) gas_ps!: ViewContainerRef;

    calendarInfo = {
        hasOwn: false,
        statusText: '',
        refreshing: true,
    };
    featuresDep = Features.cfg.departments;
    isStampEnable = Features.cfg.departments.stamp;
    directGrant;
    showCalendar = Features.cfg.departments.calendar_depart;
    private _orgName = '';
    private previousValues: SimpleChanges;

    constructor(private injector: Injector,
        private _zone: NgZone,
        private _msgSrv: EosMessageService,
        private _confirmSrv: ConfirmWindowService,
        private _apiSrv: PipRX,
        private _waitClassifSrv: WaitClassifService,
        private _eosCommonOverride: EosCommonOverriveService,
        public apCtx: AppContext
    ) {
        super(injector);
        this.previousValues = {};
    }

    get hasStamp(): boolean {
        return this.getValue('rec.ISN_STAMP');
    }

    get hasCard(): boolean {
        return this.getValue('rec.CARD_FLAG');
    }

    get hasOrganization(): boolean {
        return this.getValue('rec.DUE_LINK_ORGANIZ');
    }

    get orgName(): string {
        if (this._orgName) {
            return this._orgName;
        } else if (this.data && this.data.organization) {
            return this.data.organization.CLASSIF_NAME;
        } else {
            return '';
        }
    }

    ngOnInit() {
        // super.ngOnInit();
        const v = this._eosCommonOverride.updateValidator(this.form) || [];
        if (this.form.controls['rec.DEPARTMENT_INDEX'].validator) {
            v.push(this.form.controls['rec.DEPARTMENT_INDEX'].validator);
        }
        this.form.controls['rec.DEPARTMENT_INDEX'].setValidators(v);
        const _eaps = this.injector.get(EosAccessPermissionsService);
        if (this.isNewRecord) {
            this.directGrant = APS_DICT_GRANT.denied;
        } else {
            this.directGrant = _eaps.isAccessGrantedForDictionary(DEPARTMENTS_DICT.id, this.data.rec.DUE);
        }

        if (this.isCBBase && this.isNewRecord) {
            const control = this.form.controls['rec.START_DATE'];
            if (control) {
                this.inputs['rec.START_DATE'].required = true;
                control.setValidators(
                    [control.validator, Validators.required]
                );
            }
        }
        const viewRef = this.addControl.viewContainerRef;
        viewRef.clear();
        this._eosCommonOverride.controlsCardDepartments.forEach(name => {
            const component = viewRef.createEmbeddedView(this.template);
            component.context = { node: name, editMode: this.editMode }
        })

        this._eosCommonOverride.controlsCardDepartments2.forEach(name => {
            const component = this.gas_ps.createEmbeddedView(this.template);
            component.context = { node: name, editMode: this.editMode }
        })
        this._refreshCalendarInfo();
    }

    validatorNumcreationFlag(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let error = null;
            if (this.form.controls['rec.NUMCREATION_FLAG'].value) {
                if (!this.form.controls['rec.DEPARTMENT_INDEX'].value) {
                    error = 'Отсутствует индекс при активном "Номерообразовании НП"';
                }
            }
            return error ? { valueError: error } : null;
        };
    }

    public confirmSave(): Promise<boolean> {
        const parent = this.dictSrv.treeNode || this.dictSrv.currentNode.parent;
        let isNeedCorrectStart = false;
        let isNeedCorrectEnd = false;
        if (parent.data.rec['START_DATE']) {
            if (!this.data.rec['START_DATE']) {
                isNeedCorrectStart = true;
            } else {
                const sd1 = new Date(this.data.rec['START_DATE']);
                const sd2 = new Date(parent.data.rec['START_DATE']);
                if (sd1 < sd2) {
                    isNeedCorrectStart = true;
                }
            }
        }
        if (parent.data.rec['END_DATE']) {
            if (!this.data.rec['END_DATE']) {
                isNeedCorrectEnd = true;
            } else {
                const sd1 = new Date(this.data.rec['END_DATE']);
                const sd2 = new Date(parent.data.rec['END_DATE']);
                if (sd1 > sd2) {
                    isNeedCorrectEnd = true;
                }
            }
        }

        if (isNeedCorrectEnd || isNeedCorrectStart) {
            return this._confirmSrv.confirm2(CONFIRM_DEPARTMENTS_DATES_FIX).then((button) => {
                if (button.result === BUTTON_RESULT_YES) {
                    if (isNeedCorrectStart) {
                        this.setValue('rec.START_DATE', new Date(parent.data.rec['START_DATE']));
                        this.data.rec['START_DATE'] = parent.data.rec['START_DATE'];
                    }
                    if (isNeedCorrectEnd) {
                        this.setValue('rec.END_DATE', new Date(parent.data.rec['END_DATE']));
                        this.data.rec['END_DATE'] = parent.data.rec['END_DATE'];
                    }
                    return true;
                }
                return false;
            });
        } else {
            // const startDate = this.data.rec['START_DATE'] ? new Date(this.data.rec['START_DATE']).toLocaleDateString().replace(/\./g, '/') : null;
            // const endDate = this.data.rec['END_DATE'] ? new Date(this.data.rec['END_DATE']).toLocaleDateString().replace(/\./g, '/') : null;
            // const criteries1 = {
            //     DEPARTMENT: {
            //         criteries: {
            //             DUE: this.data.rec['DUE'] + '_%',
            //             START_DATE: `^${startDate} : ${endDate}`,
            //         }
            //     }
            // };
            // const criteries2 = {
            //     DEPARTMENT: {
            //         criteries: {
            //             DUE: this.data.rec['DUE'] + '_%',
            //             END_DATE: `^${startDate} : ${endDate}`,
            //         }
            //     }
            // };
            // const query1 = this._apiSrv.read<DEPARTMENT>(criteries1);
            // const query2 = this._apiSrv.read<DEPARTMENT>(criteries2);
            // return Promise.all([query1, query2]).then((result: Array<DEPARTMENT[]>) => {
            //     if (result[0].length || result[1].length) {
            //         return this._confirmSrv.confirm2(CONFIRM_DEPARTMENTS_DATES_FIX1).then(button => {
            //             if (button.result === BUTTON_RESULT_YES) {
            //                 return true;
            //             }
            //             return false;
            //         });
            //     } else {
            //         return true;
            //     }
            // }).catch(e => {
            //     console.log(e);
            //     return Promise.resolve(true);
            // });

            const changes = [];
            const startDate = this.data.rec['START_DATE'] ? new Date(this.data.rec['START_DATE']).toLocaleDateString().replace(/[^0-9\.]/g, '').replace(/\./g, '/') : null;
            const endDate = this.data.rec['END_DATE'] ? new Date(this.data.rec['END_DATE']).toLocaleDateString().replace(/[^0-9\.]/g, '').replace(/\./g, '/') : null;
            PipRX.invokeSop(changes, 'DepartmentDateTests',
                {
                    'due': this.data.rec['DUE'], 'date1': startDate, 'date2': endDate
                }, 'POST', false);
            return this._apiSrv.batch(changes, '').then((answer) => {
                if (answer.length && answer[0].value === 'incompatible') {
                    return this._confirmSrv.confirm2(CONFIRM_DEPARTMENTS_DATES_FIX1).then(button => {
                        if (button.result === BUTTON_RESULT_YES) {
                            return true;
                        }

                        return false;
                    });
                } else {
                    return true;
                }
            }).catch(e => {
                this._msgSrv.addNewMessage({
                    type: 'warning',
                    title: 'Предупреждение:',
                    msg: e.message
                });
                return true;
            });
        }
    }

    stampClick() {
        this.tooltipsHide();
        const isn = this.data.rec['ISN_STAMP'];
        const _modalSrv = this.injector.get(BsModalService);
        const config = {
            ignoreBackdropClick: true,
            class: 'department-stamp-form',
        };
        const modalWindow = _modalSrv.show(StampBlobFormComponent, config);
        (<StampBlobFormComponent>modalWindow.content).init(isn);
        if (modalWindow) {
            const hideWaitSubscr = _modalSrv.onHide.subscribe(() => {
                this.tooltipsRestore();
                hideWaitSubscr.unsubscribe();
            });
            const subscription = (<StampBlobFormComponent>modalWindow.content).onClose.subscribe((savedisn) => {
                subscription.unsubscribe();
                this.setValue('rec.ISN_STAMP', savedisn);
            });
        }
    }

    clickNumcreation() {
        const dib: DynamicInputBaseDirective = this.inputs['rec.indexDep'].dib;
        dib.forceTooltip();
        const c = this.form.controls['rec.DEPARTMENT_INDEX'];
        c.markAsDirty();
    }

    chooseOrganiz() {
        const OPEN_CLASSIF_ORGANIZ_DEP: IOpenClassifParams = {
            classif: 'CONTACT',
            skipDeleted: true,
            selectMulty: false,
            selectLeafs: true,
            selectNodes: false,
            return_due: true
        };

        this._zone.runOutsideAngular(() => {
            return this._waitClassifSrv.openClassif(OPEN_CLASSIF_ORGANIZ_DEP)
            .then((due: string) => {
                if (!due || due === '') {
                    return;
                }
                this._zone.run(() => this.bindOrganization(due));
            })
            .catch(() => {
                console.log('window closed');
            });
        });
    }

    bindOrganization(orgDue: string) {
        const dues = orgDue ? orgDue.split('|') : [''];
        this.dictSrv.bindOrganization(dues[0])
            .then((org) => {
                if (org) {
                    if (this.isNewRecord || !this.data.__relfield) {
                        this.data.__relfield = {};
                    }
                    this.data.__relfield['ORGANIZ_CL'] = org;
                    this._orgName = org['CLASSIF_NAME'];
                    this.setValue('rec.DUE_LINK_ORGANIZ', org.DUE);
                }
            });
    }

    unbindOrganization() {
        if (this.hasOrganization) {
            this.dictSrv.unbindOrganization();
            this._orgName = '';
            this.data.organization = null;
            this.data.__relfield['ORGANIZ_CL'] = null;
            this.setValue('rec.DUE_LINK_ORGANIZ', null);
        } else {
            this._msgSrv.addNewMessage(WARN_NO_BINDED_ORGANIZATION);
        }
    }

    ngOnChanges() {
        if (this.form) {
            this.unsubscribe();
            this.formChanges$ = this.form.valueChanges.subscribe((formChanges) => this.updateForm(formChanges));
        }
    }
    createCalendar() {
        const _confirmSrv = this.injector.get(ConfirmWindowService);
        _confirmSrv.confirm2(CONFIRM_DEPCALENDAR_CREATE).then((button) => {
            if (button && button.result === BUTTON_RESULT_YES) {
                this._openFormCalendar();
            }
        });
    }

    editCalendar() {
        this._openFormCalendar();
    }

    clearCalendar() {
        const _confirmSrv = this.injector.get(ConfirmWindowService);
        const _apiSrv = this.injector.get(PipRX);
        _confirmSrv.confirm2(CONFIRM_DEPCALENDAR_DELETE).then((button) => {
            if (button && button.result === BUTTON_RESULT_YES) {
                const due = this.data.rec['DUE'];
                CalendarHelper.clearHardCalendarForDue(_apiSrv, due).then((result) => {
                    if (result === null) {

                    } else if (result === true) {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                    } else {
                        this._msgSrv.addNewMessage({ msg: result.message, type: 'danger', title: 'Ошибка записи' });

                    }
                    this._refreshCalendarInfo();
                });
            }
        });
    }

    private _openFormCalendar() {
        const due = this.data.rec['DUE'];
        const title = this.data.rec[COMMON_FIELD_NAME.key];
        const _modalSrv = this.injector.get(BsModalService);
        const modalWindow = _modalSrv.show(DepartmentCalendarComponent, { class: 'department-calendar-modal' });
        (<DepartmentCalendarComponent>modalWindow.content).init(due, title);
        if (modalWindow) {
            const subscription = (<DepartmentCalendarComponent>modalWindow.content).onClose.subscribe((hasChanges) => {
                subscription.unsubscribe();
                if (hasChanges) {
                    this._refreshCalendarInfo();
                }
            });
        }
    }

    private _refreshCalendarInfo() {
        // if (this.directGrant <= APS_DICT_GRANT.denied) {
        //     return;
        // }
        this.calendarInfo.refreshing = true;
        this._readCalendarInfo().then(() => {
            this.calendarInfo.refreshing = false;
        }).catch(() => {
            this.calendarInfo.refreshing = false;
        });
    }

    private _readCalendarInfo(): Promise<any> {
        const apiSrv = this.injector.get(PipRX);
        const due = this.data.rec['DUE'];
        return CalendarHelper.readDB(apiSrv, due).then((dates: CALENDAR_CL_BY_DEP[]) => {
            let foundOwn = false;
            for (let i = 0; i < dates.length; i++) {
                const el = dates[i];
                if (el.OWNER_ID === due) {
                    foundOwn = true;
                    break;
                }
            }
            this.calendarInfo.hasOwn = foundOwn;
            if (foundOwn) {
                this.calendarInfo.statusText = 'Используется календарь подразделения';
            } else {
                this.calendarInfo.statusText = 'Используется вышестоящий календарь';
            }
        });
    }
    private updateForm(formChanges: any) {
        if (this.previousValues['rec.CARD_FLAG'] !== formChanges['rec.CARD_FLAG']) {
            this.previousValues['rec.CARD_FLAG'] = formChanges['rec.CARD_FLAG'];
            const cardNameControl = this.form.controls['rec.CARD_NAME']
            if (!formChanges['rec.CARD_FLAG']) {
                if (!!this.hasOrganization) {
                    this._zone.run(() => this.unbindOrganization());
                }
                cardNameControl.clearValidators()
            } else {
                cardNameControl.addValidators(Validators.required)
            }
            cardNameControl.updateValueAndValidity()
        }
        this._eosCommonOverride.updateForm(this, formChanges);

        if (this.previousValues['rec.NUMCREATION_FLAG'] !== formChanges['rec.NUMCREATION_FLAG']) {
            this.previousValues['rec.NUMCREATION_FLAG'] = formChanges['rec.NUMCREATION_FLAG'];
            this.form.controls['rec.DEPARTMENT_INDEX'].updateValueAndValidity();
        }
    }

}
