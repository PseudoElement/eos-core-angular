import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { REGISTRATION_REMASTER_USER, REGISTRATION_MAILRESIVE } from '../../../user-params-set/shared-user-param/consts/remaster-email.const';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { IFieldDescriptor } from 'eos-dictionaries/interfaces';
import { IUserSettingsModes } from '../../../shared/intrfaces/user-params.interfaces';
import { AccordionPanelComponent } from 'ngx-bootstrap';
import { SearchService } from '../.././shared-user-param/services/search-service';
import { AppContext } from 'eos-rest/services/appContext.service';
export interface TreeItem {
    title: string;
    key: string;
    isOpen: boolean;
    children: Array<any>;
    parent?: TreeItem;
}

export interface Accordion {
    title: string;
    tree: TreeItem[];
}

@Component({
    selector: 'eos-remaster-email',
    templateUrl: 'remaster-email.component.html',
    providers: [FormHelperService],
})

export class RemasterEmailComponent implements OnInit, OnDestroy, AfterViewInit {
    fieldsConst = REGISTRATION_REMASTER_USER;
    fieldsConstMailResive = REGISTRATION_MAILRESIVE;
    public preparedItemForInputs: any;
    public preparedItemForInputsMailREsive: any;
    public prepareInputs;
    public prepareInputsMailREsive;
    public sortedData;
    public prepareData;
    public prepareDataMailResive;
    public inputs;
    public inputsMailResive;
    public form: FormGroup;
    public formMailResuve: FormGroup;
    public listForAccordion: Array<Accordion> = [];
    public templRenderMailResive;
    public flagEdit: boolean = false;
    public templRender: TreeItem[] = [];
    public OpenParamsReg: boolean;
    @Input() appMode: IUserSettingsModes;
    @Input() userData;
    @Input() defaultValues;
    @Input() isCurrentSettings?: boolean;
    @Output() pushChenge = new EventEmitter<any>();
    public mapDefault: any = {};
    private hashKeyDBString = new Map();
    private mapNewValue = new Map();
    private mapNewValueMailResive = new Map();
    private setRcSend = new Set()
        .add('RCSEND_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO')
        .add('RCSEND_RESOLUTIONS_RADIO')
        .add('RCSEND_ADDRESSEES_RADIO');
    private stringRCSEND;
    private stringMailResive;
    private ErrorRcSend = false;
    private ErrorMailRecive = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    private prepareDefaultForm: any;
    private prepareDefaultFormMailREceive: any;

    private setMailResive = new Set()
        .add('MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO')
        .add('MAILRECEIVE_TAKE_RUBRICS_RK_RADIO');

    private _arPanels: AccordionPanelComponent[];
    @ViewChildren(AccordionPanelComponent) private _panels: QueryList<AccordionPanelComponent>;

    constructor(
        private formHelp: FormHelperService,
        private dataSrv: EosDataConvertService,
        private inputCtrlSrv: InputControlService,
        private _RemasterService: RemasterService,
        private _searchService: SearchService,
        private _appContext: AppContext,
    ) {
        this._RemasterService.cancelEmit
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                this.cancel();
            });
        this._RemasterService.defaultEmit
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((tab) => {
                if (tab === 'Эл. почта') {
                    this.default();
                }
            });
        this._RemasterService.submitEmit
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                this.setNewValInputs();
                this.flagEdit = false;
                this.form.disable({ emitEvent: false });
                this.formMailResuve.disable({ emitEvent: false });
            });
        this._RemasterService.editEmit
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(data => {
                this.flagEdit = true;
                this.form.enable({ emitEvent: false });
                this.formMailResuve.enable({ emitEvent: false });
                this.disableFormMailResive();
                this.disableForm();
                this.alwaysDisabledMethod();
            });
    }

    ngAfterViewInit() {
        this._arPanels = this._panels.toArray();
        this._searchService.emailExtChangeObservable.pipe( // открытие панели
            takeUntil(this.ngUnsubscribe)
        )
            .subscribe(panelIndex => {
                setTimeout(() => {
                    this._arPanels[panelIndex].isOpen = true;
                }, 100);
            });
    }

    ngOnInit() {
        this.initEmail();
        this.initMailResive();
        this.itCurrentSettingsCheck();
        this.stringRCSEND = this.userData['RCSEND'];
        this.stringMailResive = this.userData['MAILRECEIVE'];
        this.mapDefault = {
            RCSEND: this.defaultValues['RCSEND'],
            MAILRECEIVE: this.defaultValues['MAILRECEIVE'],
            RECEIP_EMAIL: this.defaultValues['RECEIP_EMAIL'],
        };
    }

    itCurrentSettingsCheck() {
        if (this.isCurrentSettings) {
            this.disableFormMailResive();
            this.disableForm();
            this.alwaysDisabledMethod();
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    setNewValInputs() {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
    }
    initEmail() {
        if (!this._appContext.cbBase) {
            this.fieldsConst.fields.splice(4, 0,
                {
                    key: 'RCSEND1',
                    type: 'boolean',
                    title: 'Организации',
                    keyPosition: 171,
                    parent: null,
                },
                {
                    key: 'RCSEND2',
                    type: 'boolean',
                    title: 'Гражданину',
                    keyPosition: 172,
                    parent: null,
                }
            );
        }
        this.preparedItemForInputs = this.parse_Create(this.fieldsConst.fields, 'userData', 'RCSEND');
        this.prepareInputs = this.formHelp.getObjectInputFields(this.fieldsConst.fields);
        this.prepareData = this.formHelp.convData(this.preparedItemForInputs);
        this.inputs = this.dataSrv.getInputs(this.prepareInputs, { rec: this.preparedItemForInputs });
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);
        if (this.isCurrentSettings) {
            this.form.enable({ emitEvent: false });
        } else {
            this.form.disable({ emitEvent: false });
        }
        this.templRender = this.createTree(this.fieldsConst.fields);
        this.sliceArrayForTemplate();
        this.subscriberFormRcSend();
    }
    initMailResive() {
        this.preparedItemForInputsMailREsive = this.parse_Create(this.fieldsConstMailResive.fields, 'userData', 'MAILRECEIVE');
        this.prepareInputsMailREsive = this.formHelp.getObjectInputFields(this.fieldsConstMailResive.fields);
        this.prepareDataMailResive = this.formHelp.convData(this.preparedItemForInputsMailREsive);
        this.inputsMailResive = this.dataSrv.getInputs(this.prepareInputsMailREsive, { rec: this.preparedItemForInputsMailREsive });
        this.formMailResuve = this.inputCtrlSrv.toFormGroup(this.inputsMailResive);
        if (this.isCurrentSettings) {
            this.formMailResuve.enable({ emitEvent: false });
        } else {
            this.formMailResuve.disable({ emitEvent: false });
        }
        this.templRenderMailResive = this.createTree(this.fieldsConstMailResive.fields);
        this.subscriberFormMailResive();
    }

    parse_Create(fields, nameProperty: string, nameFieldDB: string) {
        const obj = {};
        fields.forEach((field: IFieldDescriptor) => {
            this.hashKeyDBString.set(field.key, field.keyPosition);
            if (field.type === 'radio') {
                this.parseRadioType(obj, field, nameProperty, nameFieldDB);
            } else if (field.type === 'string') {
                obj[field.key] = this[nameProperty]['RECEIP_EMAIL'] ? this[nameProperty]['RECEIP_EMAIL'] : '';
            } else {
                const keyValue = this[nameProperty][nameFieldDB].charAt(field.keyPosition);
                obj[field.key] = keyValue === '0' || keyValue === '' ? false : true;
            }
        });
        return obj;
    }

    parseRadioType(obj, field: IFieldDescriptor, nameProperty: string, nameFieldDB: string) {
        const mapValue = new Map();
        const parseKeyPositionRadio = String(field.keyPosition).split('.');
        parseKeyPositionRadio.forEach(val => {
            mapValue.set(val, this[nameProperty][nameFieldDB].charAt(val));
        });

        if (parseKeyPositionRadio.length > 2) {
            const parentKey_1 = String(mapValue.get(parseKeyPositionRadio[0]));
            const parentKey_2 = String(mapValue.get(parseKeyPositionRadio[1]));
            const parentKey_3 = String(mapValue.get(parseKeyPositionRadio[2]));
            if (parentKey_1 === '0' && parentKey_2 === '0' && parentKey_3 === '1') {
                obj[field.key] = String(-1);
            }
            if (parentKey_1 === '0' && parentKey_2 === '1' && parentKey_3 === '0') {
                obj[field.key] = String(1);
            }
            if (parentKey_1 === '1' && parentKey_2 === '0' && parentKey_3 === '0') {
                obj[field.key] = String(0);
            }
            if (parentKey_1 === '0' && parentKey_2 === '0' && parentKey_3 === '0') {
                obj[field.key] = String('');
            }
        } else {
            if (mapValue.get(parseKeyPositionRadio[0]) === '0' && mapValue.get(parseKeyPositionRadio[1]) === '1') {
                obj[field.key] = String(1);
            }
            if (mapValue.get(parseKeyPositionRadio[0]) === '1' && mapValue.get(parseKeyPositionRadio[1]) === '0') {
                obj[field.key] = String(0);
            }
            if (mapValue.get(parseKeyPositionRadio[0]) === '0' && mapValue.get(parseKeyPositionRadio[1]) === '0') {
                obj[field.key] = String('');
            }
            if (mapValue.get(parseKeyPositionRadio[0]) === '1' && mapValue.get(parseKeyPositionRadio[1]) === '1') {
                obj[field.key] = String(1);
            }
        }
    }
    returnClass(node, form: FormGroup): string {
        let str = '';
        let key = 'rec.' + node.key;
        if (key === 'rec.RCSEND_REGISTRATION_NUMBER') {
            key = 'rec.RCSEND_DOCUMENT_AUTHOR';
        }
        if (node.isOpen) {
            if (!form.controls[key].disabled) {
                str = 'eos-adm-icon-open-folder-blue';
            } else {
                str = 'eos-adm-icon-open-folder-grey';
            }
        } else {
            if (!form.controls[key].disabled) {
                str = 'eos-adm-icon-close-folder-blue';
            } else {
                str = 'eos-adm-icon-close-folder-grey';
            }
        }
        return str;
    }
    createTree(fields) {
        const TreeObj: TreeItem[] = [];
        let tree;
        fields.forEach(field => {
            tree = this.getTree(TreeObj, field);
        });
        return tree;
    }
    getTree(TreeObj: TreeItem[], field: IFieldDescriptor) {
        if (field.parent === null) {
            TreeObj.push({
                title: field.title,
                key: field.key,
                isOpen: false,
                children: [],
                parent: null
            });
        } else {
            TreeObj.forEach((item: TreeItem) => {
                this.checkItem(item, field);
            });
        }
        return TreeObj;
    }
    checkItem(item: TreeItem, field: IFieldDescriptor) {
        if (item.key === field.parent) {
            item.children.push({
                title: field.title,
                key: field.key,
                isOpen: false,
                children: [],
                parent: item
            });
        } else {
            if (item.children.length) {
                item.children.forEach((child: TreeItem) => {
                    this.checkItem(child, field);
                });
            }
        }
    }
    sliceArrayForTemplate(): void {
        let count = 8;
        if (!this._appContext.cbBase) {
            count = 10;
        }
        // @task165408 убирание настроек толстяка
        // изначально this.listForAccordion.push({ title: 'Общие параметры отправки сообщения', tree: this.templRender.slice(0, 8) });
        this.listForAccordion.push({ title: 'Общие параметры отправки сообщения', tree: this.templRender.slice(1, count) });
        this.listForAccordion.push({ title: 'Правила формирования паспорта', tree: this.templRender.slice(8, 13) });
        this.listForAccordion.push({ title: 'Реквизиты РК для отправки', tree: this.templRender.slice(13) });
    }
    triggerNode(node: TreeItem): void {
        node.isOpen = !node.isOpen;
    }

    triggerChildren(node: TreeItem): void {
        const key = node.key;
        const value = this.form.controls['rec.' + key].value;
        this.setValueChildren(node, value);
        if (value) {
            this.setParent(node, value);
        }
    }
    triggerMailReceive(node: TreeItem) {
        if (node.key === 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT' || node.key === 'MAILRECEIVE_TAKE_RUBRICS_RK') {
            this.enabelDisabelMailResive(node);
        }
    }
    setParent(node: TreeItem, val?) {
        if (!val) {
            val = this.form.controls['rec.' + node.key].value;
        }
        if (node.parent && val) {
            const key = node.parent.key;
            this.form.controls['rec.' + key].patchValue(val);
            this.setParent(node.parent, val);
        }
        if (node.key === 'RCSEND_ADDRESSEES' || node.key === 'RCSEND_RESOLUTIONS') {
            this.enabelDisabelRcSend(node);
        }
    }
    disableForm() {
        const addresInput = this.form.controls['rec.RCSEND_ADDRESSEES'].value;
        const resolutionInput = this.form.controls['rec.RCSEND_RESOLUTIONS'].value;
        if (!addresInput) {
            this.form.controls['rec.RCSEND_ADDRESSEES_RADIO'].disable({ emitEvent: false });
        } else {
            this.form.controls['rec.RCSEND_ADDRESSEES_RADIO'].enable({ emitEvent: false });
        }
        if (!resolutionInput) {
            this.form.controls['rec.RCSEND_RESOLUTIONS_RADIO'].disable({ emitEvent: false });
        } else {
            this.form.controls['rec.RCSEND_RESOLUTIONS_RADIO'].enable({ emitEvent: false });
        }
    }

    disableFormMailResive() {
        const addresInput = this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT'].value;
        const resolutionInput = this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK'].value;
        if (!addresInput) {
            this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].disable({ emitEvent: false });
        } else {
            this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].enable({ emitEvent: false });
        }
        if (!resolutionInput) {
            this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].disable({ emitEvent: false });
        } else {
            this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].enable({ emitEvent: false });
        }
    }

    getDefaultValue(key: string, type: 'rcSend' | 'mailReceive') {
        if (type === 'rcSend') {
            if (!this.prepareDefaultForm) {
                this.prepareDefaultForm = this.parse_Create(this.fieldsConst.fields, 'mapDefault', 'RCSEND');
            }
            return this.prepareDefaultForm[key].toString();
        }
        if (type === 'mailReceive') {
            if (!this.prepareDefaultFormMailREceive) {
                this.prepareDefaultFormMailREceive = this.parse_Create(this.fieldsConstMailResive.fields, 'mapDefault', 'MAILRECEIVE');
            }
            return this.prepareDefaultFormMailREceive[key].toString();
        }
    }

    enabelDisabelRcSend(tree: TreeItem) {
        const value = this.form.controls['rec.' + tree.key].value;

        if (tree.key === 'RCSEND_ADDRESSEES') {
            if (value) {
                const defaultValue = this.getDefaultValue('RCSEND_ADDRESSEES_RADIO', 'rcSend');
                this.form.controls['rec.RCSEND_ADDRESSEES_RADIO'].enable();
                this.form.controls['rec.RCSEND_ADDRESSEES_RADIO'].patchValue(defaultValue);
            } else {
                this.form.controls['rec.RCSEND_ADDRESSEES_RADIO'].patchValue('');
                this.form.controls['rec.RCSEND_ADDRESSEES_RADIO'].disable();
            }
        }
        if (tree.key === 'RCSEND_RESOLUTIONS') {
            if (value) {
                const defaultValue = this.getDefaultValue('RCSEND_RESOLUTIONS_RADIO', 'rcSend');
                this.form.controls['rec.RCSEND_RESOLUTIONS_RADIO'].enable();
                this.form.controls['rec.RCSEND_RESOLUTIONS_RADIO'].patchValue(defaultValue);
            } else {
                this.form.controls['rec.RCSEND_RESOLUTIONS_RADIO'].patchValue('');
                this.form.controls['rec.RCSEND_RESOLUTIONS_RADIO'].disable();
            }
        }
    }

    enabelDisabelMailResive(tree: TreeItem) {
        const value = this.formMailResuve.controls['rec.' + tree.key].value;
        if (tree.key === 'MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT') {
            if (value) {
                const defaultValue = this.getDefaultValue('MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO', 'mailReceive');
                this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].enable();
                this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].patchValue(defaultValue === '' ? '0' : defaultValue);
            } else {
                this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].patchValue('');
                this.formMailResuve.controls['rec.MAILRECEIVE_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO'].disable();
            }
        }
        if (tree.key === 'MAILRECEIVE_TAKE_RUBRICS_RK') {
            if (value) {
                const defaultValue = this.getDefaultValue('MAILRECEIVE_TAKE_RUBRICS_RK_RADIO', 'mailReceive');
                this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].enable();
                this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].patchValue(defaultValue === '' ? '0' : defaultValue);
            } else {
                this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].patchValue('');
                this.formMailResuve.controls['rec.MAILRECEIVE_TAKE_RUBRICS_RK_RADIO'].disable();
            }
        }
    }
    setValueChildren(node: TreeItem, val: boolean) {
        if (val) {
            this.form.controls['rec.' + node.key].patchValue(true);
        } else {
            this.form.controls['rec.' + node.key].patchValue(false);
        }
        node.children.forEach((field: TreeItem) => {
            this.setValueChildren(field, val);
        });
    }
    alwaysDisabledMethod() {
        this.fieldsConst.disabledFields.forEach(key => {
            this.form.controls['rec.' + key].disable({ emitEvent: false });
        });
    }

    subscriberFormRcSend() {
        this.form.valueChanges.subscribe(data => {
            Object.keys(data).forEach(key => {
                if (data[key] !== this.inputs[key].value) {
                    this.mapNewValue.set(key, data[key]);
                    this.createNewStringRcSend(key, data[key]);
                } else {
                    if (this.mapNewValue.has(key)) {
                        this.createNewStringRcSend(key, data[key]);
                        this.mapNewValue.delete(key);
                    }
                }
            });
            const dataVal = this.userData !== null ? this.userData : this.defaultValues;
            if (dataVal['RCSEND'] !== this.stringRCSEND || this.mapNewValue.size > 0) {
                this.ErrorRcSend = true;
            } else {
                this.ErrorRcSend = false;
            }
            this.emitChange();
        });
    }


    subscriberFormMailResive() {
        this.formMailResuve.valueChanges.subscribe(data => {
            Object.keys(data).forEach(key => {
                if (data[key] !== this.inputsMailResive[key].value) {
                    this.mapNewValueMailResive.set(key, data[key]);
                    this.createNewStringMailResive(key, data[key]);
                } else {
                    if (this.mapNewValueMailResive.has(key)) {
                        this.createNewStringMailResive(key, data[key]);
                        this.mapNewValueMailResive.delete(key);
                    }
                }
            });
            const dataVal = this.userData !== null ? this.userData : this.defaultValues;
            if (dataVal['MAILRECEIVE'] !== this.stringMailResive) {
                this.ErrorMailRecive = true;
            } else {
                this.ErrorMailRecive = false;
            }
            this.emitChange();
        });

    }
    createNewStringRcSend(key, value) {
        const position = this.hashKeyDBString.get(key.substring(4));
        if (this.setRcSend.has(key.substring(4))) {
            this.updateStringRcSendKeyParentMoreOne(position, value);
        } else {
            this.updateStringRcSend(position, value, 'stringRCSEND');
        }
    }
    updateStringRcSend(pos, val, nameProperty) {
        const rc = this[nameProperty].split('');
        rc.splice(pos, 1, val ? 1 : 0);
        this[nameProperty] = rc.join('');
    }
    updateStringRcSendKeyParentMoreOne(pos, val) {
        const position = String(pos).split('.');
        if (val === '0') {
            this.updateStringRcSend(+position[0], true, 'stringRCSEND');
            this.updateStringRcSend(+position[1], false, 'stringRCSEND');
        } else if (val === '') {
            this.updateStringRcSend(+position[0], false, 'stringRCSEND');
            this.updateStringRcSend(+position[1], false, 'stringRCSEND');
        } else {
            this.updateStringRcSend(+position[0], false, 'stringRCSEND');
            this.updateStringRcSend(+position[1], true, 'stringRCSEND');
        }
    }

    createNewStringMailResive(key, value) {
        const position = this.hashKeyDBString.get(key.substring(4));
        if (this.setMailResive.has(key.substring(4))) {
            this.updateStringMailResiveKeyParentMoreOne(position, value);
        } else {
            this.updateStringRcSend(position, value, 'stringMailResive');
        }
    }

    updateStringMailResiveKeyParentMoreOne(pos, value) {
        const position = String(pos).split('.');
        if (position.length > 2) {
            if (value === '0') {
                this.upSrtMailREsiveToolog(position, true, false, false);
            }
            if (value === '1') {
                this.upSrtMailREsiveToolog(position, false, true, false);
            }
            if (value === '-1') {
                this.upSrtMailREsiveToolog(position, false, false, true);
            }
            if (value === '') {
                this.upSrtMailREsiveToolog(position, false, false, false);
            }
        } else {
            if (value === '0') {
                this.updateStringRcSend(+position[0], true, 'stringMailResive');
                this.updateStringRcSend(+position[1], false, 'stringMailResive');
            } else if (value === '') {
                this.updateStringRcSend(+position[0], false, 'stringMailResive');
                this.updateStringRcSend(+position[1], false, 'stringMailResive');
            } else {
                this.updateStringRcSend(+position[0], false, 'stringMailResive');
                this.updateStringRcSend(+position[1], true, 'stringMailResive');
            }
        }
    }

    upSrtMailREsiveToolog(position, bool1, bool2, bool3): void {
        this.updateStringRcSend(+position[0], bool1, 'stringMailResive');
        this.updateStringRcSend(+position[1], bool2, 'stringMailResive');
        this.updateStringRcSend(+position[2], bool3, 'stringMailResive');
    }
    emitChange() {
        const obj = {
            'rec.RCSEND': this.stringRCSEND,
            'rec.MAILRECEIVE': this.stringMailResive,
            'rec.RECEIP_EMAIL': this.form.controls['rec.RECEIP_EMAIL'].value,
        };
        if (this.ErrorMailRecive || this.ErrorRcSend) {
            this.pushChenge.emit([[
                {
                    key: 'RCSEND',
                    value: this.stringRCSEND
                },
                {
                    key: 'MAILRECEIVE',
                    value: this.stringMailResive
                },
                {
                    key: 'RECEIP_EMAIL',
                    value: this.form.controls['rec.RECEIP_EMAIL'].value,
                },
            ], obj]);
        } else {
            this.pushChenge.emit(false);
        }
    }
    CancelForm() {
        Object.keys(this.formMailResuve.controls).forEach(inp => {
            if (this.inputsMailResive[inp].value !== this.formMailResuve.controls[inp].value) {
                this.formMailResuve.controls[inp].patchValue(this.inputsMailResive[inp].value, { emitEvent: false });
            }
        });
        Object.keys(this.form.controls).forEach(inp => {
            if (this.inputs[inp].value !== this.form.controls[inp].value) {
                this.form.controls[inp].patchValue(this.inputs[inp].value, { emitEvent: false });
            }
        });
        this.form.disable({ emitEvent: false });
        this.formMailResuve.disable({ emitEvent: false });
        this.sliceArrayForTemplate();
        this.OpenParamsReg = false;
    }
    cancel() {
        this.CancelForm();
        this.alwaysDisabledMethod();
        this.ErrorRcSend = false;
        this.ErrorMailRecive = false;
        this.flagEdit = false;
        this.mapNewValue.clear();
        this.mapNewValueMailResive.clear();
    }

    isOpenChangeReciveAc(event: boolean) {
        if (event) {
            this.OpenParamsReg = true;
        } else {
            this.OpenParamsReg = false;
        }
    }

    default() {
        this.prepareDefaultForm = this.prepareDefaultForm ? this.prepareDefaultForm : this.parse_Create(this.fieldsConst.fields, 'mapDefault', 'RCSEND');
        this.prepareDefaultFormMailREceive = this.prepareDefaultFormMailREceive ? this.prepareDefaultFormMailREceive : this.parse_Create(this.fieldsConstMailResive.fields, 'mapDefault', 'MAILRECEIVE');
        this.fillFormDefaultValues();
        this.fillFormMailReceive();
        setTimeout(() => {
            this.disableForm();
            this.disableFormMailResive();
        });
    }
    fillFormDefaultValues() {
        Object.keys(this.prepareDefaultForm).forEach((item: string) => {
            this.form.controls['rec.' + item].patchValue(this.prepareDefaultForm[item]);
        });
    }
    fillFormMailReceive() {
        Object.keys(this.prepareDefaultFormMailREceive).forEach((item: string) => {
            this.formMailResuve.controls['rec.' + item].patchValue(this.prepareDefaultFormMailREceive[item]);
        });
    }

}
