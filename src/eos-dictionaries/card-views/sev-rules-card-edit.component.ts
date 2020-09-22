import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import { WaitClassifService } from 'app/services/waitClassif.service';
import {
    OPEN_CLASSIF_LINK_CL,
    OPEN_CLASSIF_SECURITY_CL,
    OPEN_CLASSIF_ORGANIZ_CL,
    OPEN_CLASSIF_DEPARTMENT_SEV,
    OPEN_CLASSIF_DEPARTMENT_SEV_FULL,
    OPEN_CLASSIF_DOCGR_LEAFS,
    OPEN_CLASSIF_DOCGR_SEV,
} from 'eos-user-select/shered/consts/create-user.consts';
import { CABINET, DELIVERY_CL, DEPARTMENT, DOCGROUP_CL, LINK_CL, ORGANIZ_CL, SECURITY_CL, USER_LISTS } from 'eos-rest';
import { ErrorHelperServices } from 'eos-user-params/shared/services/helper-error.services';
import { BsModalRef } from 'ngx-bootstrap';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EosMessageService } from '../../eos-common/services/eos-message.service';

@Component({
    selector: 'eos-sev-rules-card-edit',
    templateUrl: 'sev-rules-card-edit.component.html',
    styleUrls: ['./sev-rules-card-edit.component.scss'],
})
export class SevRulesCardEditComponent extends BaseCardEditComponent implements OnInit, OnDestroy {
    public linkTypeListNames = [];
    public fileAccessNames = [];
    public fieldNotUpdate = ['rec.CLASSIF_NAME', 'rec.NOTE', 'rec.type', 'rec.RULE_KIND', 'rec.kind', 'rec.DUE_DEP', 'rec.organizationNow', 'rec.fileAccessListRk'];
    public securityLink = [];
    public organizationNow = '';
    public organization = '';
    public modalRef: BsModalRef;
    public modalRefAdd: BsModalRef;
    public departmentUser = '';
    public groupDocument = [];
    public groupDocumentTemplate = [];
    public checkItemForDelet: number = null;
    public departmentReceiveInput: string = '';
    private ngUnsubscribe: Subject<any> = new Subject();
    private _errorHelper: ErrorHelperServices;
    constructor(injector: Injector,
                private _waitClassif: WaitClassifService,
                private msgSrv: EosMessageService,
    ) {
        super(injector);
        this._errorHelper = injector.get(ErrorHelperServices);
    }
    get filterConfig(): string {
        return this.getValue('rec.filterConfig');
    }
    get typeOrganiz(): string {
        return this.getValue('rec.OrganizationFolderInput');
    }
    get executive(): string {
        return this.getValue('rec.executiveInput');
    }
    get executor(): string {
        return this.getValue('rec.executor');
    }
    get progectRegistration(): string {
        return this.getValue('rec.progectRegistration');
    }
    get departmentReceive(): string {
        return this.getValue('rec.departmentReceive');
    }
    get dueDep(): string {
        return this.getValue('rec.DUE_DEP');
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
    get controlOrganization() {
        return this.getControl('rec.OrganizationFolderInput');
    }
    get controlFilterConfig() {
        return this.getControl('rec.filterConfig');
    }
    get controlExecutiveConfig() {
        return this.getControl('rec.executiveInput');
    }
    get controlExecutor() {
        return this.getControl('rec.executor');
    }
    get controlRegistration() {
        return this.getControl('rec.progectRegistration');
    }
    get controlsDepartmentReceive() {
        return this.getControl('rec.departmentReceive');
    }
    ngOnInit() {
        super.ngOnInit();
        this.updateLabel(+this.form.controls['rec.RULE_KIND'].value);
        // если открываем новую карточку то поля должны быть заполнены
        if (!this.inputs['rec.CLASSIF_NAME'].value) {
            this.updateOnDefaultValue();
        }
        this.afterGetFrom();
        this.form.controls['rec.type'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            this.updateRule_Kind(+value);
            this.loadGrifsNames(value);
            this.updateInputDue_doc();
        });
        this.form.controls['rec.kind'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            this.updateOnlyKind(+value);
        });
        // для снятия чекбоксов с задизейбленых элементов
        // Адрес субъекта документа
        this.form.controls['rec.address'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.region'].setValue(false);
            }
        });
        // Резолюции
        this.form.controls['rec.resolution'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.taskCategory'].setValue(false);
                this.form.controls['rec.taskController'].setValue(false);
                this.form.controls['rec.taskNote'].setValue(false);
            }
        });

        // Поручения
        this.form.controls['rec.orders'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.taskCategory'].setValue(false);
                this.form.controls['rec.noteOrders'].setValue(false);
            }
        });

        // Доклад о работе с документом (ввод резолюций)
        this.form.controls['rec.consideration'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.textConsideration'].setValue(false);
                this.form.controls['rec.categoryConsideration'].setValue(false);
                this.form.controls['rec.noteConsideration'].setValue(false);
                this.form.controls['rec.controlConsideration'].setValue(false);
                this.form.controls['rec.planConsideration'].setValue(false);
                // this.form.controls['rec.Controller'].setValue(false);
                this.form.controls['rec.controllerMission'].setValue(false);
                this.form.controls['rec.Summary'].setValue(false);
                this.form.controls['rec.FactDate'].setValue(false);
                this.form.controls['rec.Status'].setValue(false);
                this.form.controls['rec.Resume'].setValue(false);
                this.form.controls['rec.executors'].setValue(false);
            }
        });
        // Доклад об исполнении поручений
        this.form.controls['rec.NotificationConfigReport'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.executorFile'].setValue(false);
            }
        });
        // Редактировать набор отправляемых уведомлений и докладов после повторного документа СЭВ
        this.form.controls['rec.editSet'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.calcDate'].setValue(false);
            }
        });
        // Отчет об исполнении в 'Поручение'
        this.form.controls['rec.reportExecution'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.executorFile'].setValue(false);
                this.form.controls['rec.address'].setValue(false); // а он уже закроет тот подчинённый
                // this.form.controls['rec.executorFile'].setValue(false);
            }
        });
        // Информация о визировании/подписании в РКПД
        this.form.controls['rec.reportExecution'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.executorFile'].setValue(false);
                this.form.controls['rec.address'].setValue(false); // а он уже закроет тот подчинённый
            }
        });
        // Визы visa
        this.form.controls['rec.visa'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.VisaInfo'].setValue(false);
                this.form.controls['rec.visaForward'].setValue(false);
            }
        });
        // Информация о визе VisaInfo
        this.form.controls['rec.VisaInfo'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.VisaFile'].setValue(false);
            }
        });
        // Направить на визирование
        this.form.controls['rec.visaForward'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.visaDays'].setValue(false);
            } else {
                this.form.controls['rec.visaDays'].setValue(true);
            }
        });
        // Подписи signatures
        this.form.controls['rec.signatures'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.signaturesInfo'].setValue(false);
                this.form.controls['rec.signatureForward'].setValue(false);
            }
        });
        this.form.controls['rec.signaturesInfo'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.signaturesFile'].setValue(false);
            }
        });
        // Направить на подпись
        this.form.controls['rec.signatureForward'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.signatureDays'].setValue(false);
            } else {
                this.form.controls['rec.signatureDays'].setValue(true);
            }
        });
        // Доклад о визировании
        this.form.controls['rec.reportVisa'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.VisaFile'].setValue(false);
            }
        });
        // Доклад о подписании
        this.form.controls['rec.reportSign'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.signaturesFile'].setValue(false);
            }
        });
        // Информация о визировании/подписании в РКПД
        this.form.controls['rec.infoVisaign'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.fileVisaign'].setValue(false);
            }
        });
        // Связки рк
        this.form.controls['rec.link'].valueChanges
        .pipe(
            takeUntil(this.ngUnsubscribe)
        )
        .subscribe(value => {
            if (!value) {
                this.form.controls['rec.linkKind'].setValue(0);
            }
        });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
    afterGetFrom() {
        this.loadLinksNames();
        this.loadGrifsNames(this.typeDoc);
        this.loadOrganizatiomNames(this.typeOrganiz);
        this.loadDepartmentNames(this.executive);
        this.inputExecutorNames();
        this.loadDepartmentNamesAll(this.dueDep);
        this.inputGroupElem();
        this.updateInputDue_doc();
        this.inputDepartSelect();
        // this.checkKind();
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
    openSecurityCl(value, flag?) {
        if (!flag) {
            this.openClassiSecurity(value);
        }
    }
    openDepartmentCl(value, flag?) {
        const classif = flag ? Object.assign({}, OPEN_CLASSIF_DEPARTMENT_SEV_FULL)  : Object.assign({}, OPEN_CLASSIF_DEPARTMENT_SEV);
        if (this.linkTypeListControl.value && this.linkTypeListControl.value !== 'null') {
            classif.selected = this.linkTypeListControl.value;
        }
        const control = this.form.controls[value];
        this._waitClassif.openClassif(classif, true)
        .then(data => {
            control.patchValue(data);
            if (flag) {
                this.loadDepartmentNamesAll(data);
            } else {
                this.loadDepartmentNames(data);
            }
        }).catch(e => {
            if (e) {
                this._errorHelper.errorHandler(e);
            }
        });
    }

    openTemplateGroup(template, value) {
        this.groupDocumentTemplate = this.groupDocument.filter(elem => true);
        this.modalRef = this.modalService.show(template);
    }
    cancelTemplate() {
        this.modalRef.hide();
        this.inputGroupElem();
    }
    createUpdate() {
        const newElem = this.groupDocumentTemplate.filter(elem => Boolean(elem)).join('|');
        this.inputs['rec.groupDocument'].value = newElem;
        this.form.controls['rec.groupDocument'].setValue(newElem);
        this.inputGroupElem();
        this.modalRef.hide();
    }
    onKey($event, item, i) {
        this.groupDocumentTemplate[i] = $event['srcElement'].value;
    }
    clickForItem(item, i) {
        this.checkItemForDelet = i;
    }
    addGroup() {
        this.groupDocument.push('');
    }
    deletGroup() {
        this.groupDocument.splice(this.checkItemForDelet, 1);
        this.checkItemForDelet = null;
    }
    public openOrganizCl(value, flag) {
        if (!flag) {
            const control = this.form.controls[value];
            this._waitClassif.openClassif(OPEN_CLASSIF_ORGANIZ_CL, true)
            .then(data => {
                control.patchValue(data);
                this.loadOrganizatiomNames(data);
            }).catch(e => {
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
        }
    }
    openDocGroupCl() {
        this.openClassifDocGroup();
    }
    public deleteFieldsNames(name, flag?) {
        if (!flag) {
            switch (name) {
                case 'rec.linkTypeList':
                    this.linkTypeListControl.patchValue('');
                    this.linkTypeListNames = [];
                    break;
                case 'rec.fileAccessList':
                    this.fileAcces.patchValue('');
                    this.fileAccessNames = [];
                    break;
                case 'rec.executiveInput':
                    this.controlExecutiveConfig.patchValue('');
                    this.departmentUser = '';
                    break;
                case 'rec.OrganizationFolderInput':
                    this.controlOrganization.patchValue('');
                    this.organization = '';
                    break;
                case 'rec.groupDocument':
                    this.form.controls['rec.groupDocument'].patchValue('');
                    this.groupDocument = [];
                    break;
                case 'rec.DUE_DEP':
                    this.form.controls['rec.DUE_DEP'].patchValue(null);
                    this.departmentReceiveInput = '';
                    break;
                case 'rec.fileAccessListRk':
                    this.fileAccessNames = [];
                    this.form.controls['rec.fileAccessListRk'].patchValue(null);
                    break;
            }
        }
    }

    private updateRule_Kind(value: number): void {
        const formRuleKind = this.form.controls['rec.RULE_KIND'];
        const formKind = this.form.controls['rec.kind'].value;
        const type = this.form.controls['rec.type'].value;
        this.form.controls['rec.departmentReceive'].setValue(1);
        if (+type === 1) {
            formRuleKind.patchValue(+formKind);
        } else {
            formRuleKind.patchValue(+formKind + 4);
        }
        this.updateOnDefaultValue(); // обновляем все поля
    }
     private updateOnlyKind(value: number): void {
         const type = this.form.controls['rec.type'].value;
         const kind = this.form.controls['rec.RULE_KIND'];
         if (+type === 1) {
             kind.patchValue(+value);
         } else {
             kind.patchValue(+value + 4);
         }
         this.updateLabel(value);
         this.form.controls['rec.departmentReceive'].setValue(1);
         this.updateOnDefaultValue(); // обновляем все поля
    }
    private updateLabel(value: number) {
        if (value % 2 === 0) {
            this.inputs['rec.DUE_DEP'].label = 'Получатель';
         } else {
            this.inputs['rec.DUE_DEP'].label = 'Отправитель';
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
    private openClassifDocGroup() {
        const classif = +this.ruleKind === 2 ? Object.assign({}, OPEN_CLASSIF_DOCGR_LEAFS) : Object.assign({}, OPEN_CLASSIF_DOCGR_SEV);
        this._waitClassif.openClassif(classif, true)
        .then(data => {
            this.form.controls['rec.DUE_DOCGROUP'].patchValue(data);
            this.updateInputDue_doc();
            // this.loadOrganizatiomNames(data);
        }).catch(e => {
            if (e) {
                this._errorHelper.errorHandler(e);
            }
        });
    }
    private updateInputDue_doc() {
        const due = this.form.controls['rec.DUE_DOCGROUP'].value;
        if (due) {
            this.dictSrv.currentDictionary.descriptor.loadNames('DOCGROUP_CL', due).then((data: DOCGROUP_CL[]) => {
                if (this.form.controls['rec.kind'].value === '2' && data[0].RC_TYPE === 3 || this.form.controls['rec.type'].value === '2' && !data[0].PRJ_NUM_FLAG) {
                    this.msgSrv.addNewMessage({
                        type: 'warning',
                        title: 'Предупреждение:',
                        msg: `Для приема документов нельзя использовать группу документов типа "Исходящие"`
                    });
                    this.form.controls['rec.DUE_DOCGROUP'].patchValue('');
                    return;
                }
                this.form.controls['rec.DUE_DOCGROUP_NAME'].patchValue(data.length ? data[0].CLASSIF_NAME : '');
            }).catch(e => {
                this._errorHelper.errorHandler(e);
            });
        }
    }
    private inputDepartSelect() {
        const query = {
            DEPARTMENT: {
                criteries: {
                    CARD_FLAG: 1,
                },
            }

        };
        this.dictSrv.currentDictionary.descriptor.readDepartmentLists(query)
        .then((ans: DEPARTMENT[]) => {
            const lists = [];
            ans.forEach(elem => {
                lists.push({value: elem.DEPARTMENT_DUE, title: elem.CARD_NAME});
            });
            this.inputs['rec.cardFile'].options = lists;
            this.inputCabinetSelect(this.form.controls['rec.cardFile'].value, false);
            // this.form.controls['rec.cardFile'].setValue({emitEvent: false});
        })
        .catch(er => {
            console.log('er', er);
        });
    }
    private inputCabinetSelect(value, flag?) {
        const query = {
            CABINET: {
                criteries: {'CABINET.DEPARTMENT.DEPARTMENT_DUE': `${value}`},
            }
        };
        this.dictSrv.currentDictionary.descriptor.readCabinetLists(query)
        .then((ans: CABINET[]) => {
            const lists = [];
            ans.forEach(elem => {
                lists.push({value: elem.ISN_CABINET, title: elem.CABINET_NAME});
            });
            this.inputs['rec.cabinetFile'].options = lists;
            if (flag) {
                this.form.controls['rec.cabinetFile'].setValue('');
            }
        })
        .catch(er => {
            console.log('er', er);
        });
    }
    private loadOrganizatiomNames(value) {
        const control = this.controlOrganization;
        if (control.value && control.value !== 'null') {
            this.dictSrv.currentDictionary.descriptor.loadNames('ORGANIZ_CL', value).then((ORG: ORGANIZ_CL[]) => {
                if (ORG.length > 0) {
                    this.organization = ORG[0]['CLASSIF_NAME'];
                }
            }).catch(e => {
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
        }
    }
    private loadDepartmentNames(value) {
        const control = this.controlExecutiveConfig;
        if (control.value && control.value !== 'null') {
            this.dictSrv.currentDictionary.descriptor.loadNames('DEPARTMENT', value).then((DEP: DELIVERY_CL[]) => {
                if (DEP.length > 0) {
                    this.departmentUser = DEP[0]['CLASSIF_NAME'];
                }
            }).catch(e => {
                if (e) {
                    this._errorHelper.errorHandler(e);
                }
            });
        }
    }
    private loadDepartmentNamesAll(value) {
        if (value && value !== '0.') {
            const control = this.controlsDepartmentReceive;
            if (control.value && control.value !== 'null') {
                this.dictSrv.currentDictionary.descriptor.loadNames('DEPARTMENT', value).then((DEP: DELIVERY_CL[]) => {
                    if (DEP.length > 0) {
                        this.departmentReceiveInput = DEP[0]['CLASSIF_NAME'];
                    }
                }).catch(e => {
                    if (e) {
                        this._errorHelper.errorHandler(e);
                    }
                });
            }
        }
    }
    private inputExecutorNames() {
        const query = {
            USER_LISTS: {
                criteries: {
                    ISN_LCLASSIF: -99,
                    CLASSIF_ID: 104
                },
            }

        };
        this.dictSrv.currentDictionary.descriptor.readUserLists(query)
        .then((ans: USER_LISTS[]) => {
            const lists = [];
            ans.forEach(elem => {
                lists.push({value: elem.ISN_LIST, title: elem.NAME});
            });
            this.inputs['rec.executor'].options = lists;
            // this.form.controls['rec.executor'].setValue({emitEvent: false});
        })
        .catch(er => {
            console.log('er', er);
        });
    }
    private inputGroupElem() {
        if (this.inputs['rec.groupDocument'] && this.inputs['rec.groupDocument'].value) {
            const all: any[] = this.inputs['rec.groupDocument'].value.split('|');
            this.groupDocument = all.filter(elem => Boolean(elem));
        }
    }
    private updateOnDefaultValue() {
        Object.keys(this.inputs).forEach(key => {
            if (this.inputs['rec.RULE_KIND'] === this.form.controls['rec.RULE_KIND']) {
                if (this.fieldNotUpdate.indexOf(key) === -1) {
                    this.form.controls[key].setValue(this.inputs[key].descriptor['value'], {emitEvent: false});
                }
            } else {
                if (this.fieldNotUpdate.indexOf(key) === -1) {
                    this.form.controls[key].setValue(this.inputs[key].descriptor['default'], {emitEvent: false});
                }

            }
        });
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
