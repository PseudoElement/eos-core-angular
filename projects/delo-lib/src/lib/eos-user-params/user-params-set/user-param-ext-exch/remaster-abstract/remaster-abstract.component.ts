import { Inject, Component, OnInit, Input, Output, EventEmitter, OnDestroy, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccordionPanelComponent } from 'ngx-bootstrap';

import { InputControlService } from '../../../../eos-common/services/input-control.service';
import { EosDataConvertService } from '../../../../eos-dictionaries/services/eos-data-convert.service';
import { FormHelperService } from '../../../shared/services/form-helper.services';
import { RemasterService } from '../../shared-user-param/services/remaster-service';
import { SearchService } from '../../shared-user-param/services/search-service';

import { IFieldDescriptor } from '../../../../eos-dictionaries/interfaces';
import { IBaseUsers, IUserSettingsModes } from '../../../shared/intrfaces/user-params.interfaces';
import { TreeItem, Accordion, ConfigChannelCB } from '../../shared-user-param/interface/email-tree.interface';

@Component({
    template: '',
    providers: [FormHelperService],
})

export class RemasterAbstractComponent implements OnInit, OnDestroy, AfterViewInit {
    public MAILRECEIVE: string;
    public RCSEND: string;

    public fieldsConst: IBaseUsers;
    public fieldsConstMailResive: IBaseUsers;

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
    private setRcSend = new Set();
    private stringRCSEND;
    private stringMailResive;
    private ErrorRcSend = false;
    private ErrorMailRecive = false;
    private ngUnsubscribe: Subject<any> = new Subject();
    private prepareDefaultForm: any;
    private prepareDefaultFormMailREceive: any;
    private maxLength = 0;
    private setMailResive = new Set();

    private _arPanels: AccordionPanelComponent[];
    @ViewChildren(AccordionPanelComponent) private _panels: QueryList<AccordionPanelComponent>;
    constructor(
        private formHelp: FormHelperService,
        private dataSrv: EosDataConvertService,
        private inputCtrlSrv: InputControlService,
        private _RemasterService: RemasterService,
        private _searchService: SearchService,
        @Inject(Object) private configChannel : ConfigChannelCB
    ) {
        this.fieldsConst = JSON.parse(JSON.stringify(this.configChannel.fieldsConst));

        if (this.configChannel.fieldsConstMailResive) {
            this.fieldsConstMailResive = JSON.parse(JSON.stringify(this.configChannel.fieldsConstMailResive));
            this.fieldsConstMailResive.fields.forEach((field) => {
                if (typeof(field.keyPosition) === 'number' && field.keyPosition > this.maxLength) {
                    this.maxLength = field.keyPosition;
                }
            });
        }
        this.RCSEND = `RCSEND_${this.configChannel.nameEN}`;
        this.MAILRECEIVE = `MAILRECEIVE_${this.configChannel.nameEN}`;

        this.fieldsConst.fields.forEach(el => {
            el.key = this.RCSEND + '_' + el.key;
            el.parent = el.parent ? this.RCSEND + '_' + el.parent : el.parent;

            if(el.key === this.RCSEND + '_EMAIL') {
                el.title = el.title.replace('e-mail', this.configChannel.nameRU )
            }
        })
        if (this.fieldsConstMailResive) {
            this.fieldsConstMailResive.fields.forEach(el => {
                el.key = this.MAILRECEIVE + '_' + el.key
                el.parent = el.parent ? this.MAILRECEIVE + '_' + el.parent : el.parent;
            })
        }

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
                if (tab === this.configChannel.nameRU) {
                    this.default();
                }
            });

        this._RemasterService.submitEmit
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(() => {
                if(!this.isCurrentSettings){
                    this.flagEdit = false;
                    this.form.disable({ emitEvent: false });
                    this.formMailResuve?.disable({ emitEvent: false });
                }
                this.setNewValInputs();
            });

        this._RemasterService.editEmit
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(data => {
                this.flagEdit = true;
                this.form.enable({ emitEvent: false });
                this.formMailResuve?.enable({ emitEvent: false });
                this.disableFormMailResive();
                this.disableForm();
                this.alwaysDisabledMethod();
            });
    }

    setNewValInputs() {
        Object.keys(this.form.controls).forEach(inp => {
            this.inputs[inp].value = this.form.controls[inp].value;
        });
    }

    ngAfterViewInit() {
        this._arPanels = this._panels.toArray();
        this._searchService.emailExtChangeObservable
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe(panelIndex => {
                setTimeout(() => {
                    this._arPanels[panelIndex].isOpen = true;
                }, 100);
            });
    }

    ngOnInit() {
        if (this.fieldsConstMailResive) {
            this.setMailResive
            .add(`${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`)
            .add(`${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`);
        }
        this.setRcSend
        .add(`${this.RCSEND}_FOR_MULTIPOINT_DOCUMENTS_SEND_RADIO`)
        .add(`${this.RCSEND}_RESOLUTIONS_RADIO`)
        .add(`${this.RCSEND}_ADDRESSEES_RADIO`);

        this.initEmail();
        if (this.fieldsConstMailResive) {
            this.initMailResive();
        }
        this.itCurrentSettingsCheck();

        this.stringRCSEND = this.userData[`${this.RCSEND}`];
        this.stringMailResive = !this.userData[`${this.MAILRECEIVE}`] || this.userData[`${this.MAILRECEIVE}`].length === this.maxLength ? this.userData[`${this.MAILRECEIVE}`] : this.userData[`${this.MAILRECEIVE}`] + '0'.repeat(this.maxLength - this.userData[`${this.MAILRECEIVE}`].length);
        this.mapDefault = {
            [`${this.RCSEND}`]: this.defaultValues[`${this.RCSEND}`],
            [`${this.MAILRECEIVE}`]: this.defaultValues[`${this.MAILRECEIVE}`],
        };
    }
    itCurrentSettingsCheck() {
        if (this.isCurrentSettings) {
            if (this.fieldsConstMailResive) {
                this.disableFormMailResive();
            }
            this.disableForm();
            this.alwaysDisabledMethod();
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

    initEmail() {
        this.preparedItemForInputs = this.parse_Create(this.fieldsConst.fields, 'userData', `${this.RCSEND}`);
        this.prepareInputs = this.formHelp.getObjectInputFields(this.fieldsConst.fields);

        this.prepareData = this.formHelp.convData(this.preparedItemForInputs);
        this.inputs = this.dataSrv.getInputs(this.prepareInputs, { rec: this.preparedItemForInputs });

        this.form = this.inputCtrlSrv.toFormGroup(this.inputs);

        this.isCurrentSettings ? this.form.enable({ emitEvent: false }) :
                                 this.form.disable({ emitEvent: false });

        this.templRender = this.createTree(this.fieldsConst.fields);

        this.sliceArrayForTemplate();
        this.subscriberFormRcSend();
    }

    initMailResive() {
        if(this.fieldsConstMailResive){
            this.preparedItemForInputsMailREsive = this.parse_Create(this.fieldsConstMailResive.fields, 'userData', `${this.MAILRECEIVE}`);
            this.prepareInputsMailREsive = this.formHelp.getObjectInputFields(this.fieldsConstMailResive.fields);
            this.prepareDataMailResive = this.formHelp.convData(this.preparedItemForInputsMailREsive);
            this.inputsMailResive = this.dataSrv.getInputs(this.prepareInputsMailREsive, { rec: this.preparedItemForInputsMailREsive });
            this.formMailResuve = this.inputCtrlSrv.toFormGroup(this.inputsMailResive);

            this.isCurrentSettings ? this.formMailResuve.enable({ emitEvent: false }):
                                     this.formMailResuve.disable({ emitEvent: false });
            this.templRenderMailResive = this.createTree(this.fieldsConstMailResive.fields);
            this.subscriberFormMailResive();
        }
    }

    parse_Create(fields: IFieldDescriptor[], nameProperty: string, nameFieldDB: string) {
        const obj = {};

        fields.forEach((field: IFieldDescriptor) => {

            this.hashKeyDBString.set(field.key, field.keyPosition);

            if (field.type === 'radio') {
                this.parseRadioType(obj, field, nameProperty, nameFieldDB);
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
        if (key === `rec.${this.RCSEND}_REGISTRATION_NUMBER`) {
            key = `rec.${this.RCSEND}_DOCUMENT_AUTHOR`;
        }
        if (node.isOpen) {
            if (!form.controls[key].disabled) {
                str = `eos-adm-icon-open-folder-blue`;
            } else {
                str = `eos-adm-icon-open-folder-grey`;
            }
        } else {
            if (!form.controls[key].disabled) {
                str = `eos-adm-icon-close-folder-blue`;
            } else {
                str = `eos-adm-icon-close-folder-grey`;
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
        const readonly = field.readonly || false;
        if (field.parent === null) {
            TreeObj.push({
                title: field.title,
                key: field.key,
                isOpen: false,
                children: [],
                parent: null,
                readonly
            });
        } else {
            TreeObj.forEach((item: TreeItem) => {
                this.checkItem(item, field);
            });
        }
        return TreeObj;
    }

    checkItem(item: TreeItem, field: IFieldDescriptor) {
        const readonly = field.readonly || false;
        if (item.key === field.parent) {
            item.children.push({
                title: field.title,
                key: field.key,
                isOpen: false,
                children: [],
                parent: item,
                readonly
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
        let count = 4;
        let separator = 9;
        if (this.configChannel.nameEN === 'LK' || this.configChannel.nameEN === 'EPVV') {
            count = 3;
            separator = 8;
        }

        this.listForAccordion = [];
        this.listForAccordion.push({ title: 'Общие параметры отправки сообщения', tree: this.templRender.slice(0, count) });
        this.listForAccordion.push({ title: 'Правила формирования паспорта', tree: this.templRender.slice(count, separator) });
        this.listForAccordion.push({ title: 'Реквизиты РК для отправки', tree: this.templRender.slice(separator) });
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
            if (dataVal[`${this.RCSEND}`] !== this.stringRCSEND || this.mapNewValue.size > 0) {
                this.ErrorRcSend = true;
            } else {
                this.ErrorRcSend = false;
            }
            this.emitChange();
        });
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
        if (node.key === `${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT` || node.key === `${this.MAILRECEIVE}_TAKE_RUBRICS_RK`) {
            this.enabelDisabelMailResive(node);
        }
    }

    enabelDisabelMailResive(tree: TreeItem) {
        const value = this.formMailResuve.controls['rec.' + tree.key].value;
        if (tree.key === `${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT`) {
            if (value) {
                const defaultValue = this.getDefaultValue(`${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`, 'mailReceive');
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`].enable();
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`].patchValue(defaultValue === '' ? '0' : defaultValue);
            } else {
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`].patchValue('');
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`].disable();
            }
        }
        if (tree.key === `${this.MAILRECEIVE}_TAKE_RUBRICS_RK`) {
            if (value) {
                const defaultValue = this.getDefaultValue(`${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`, 'mailReceive');
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`].enable();
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`].patchValue(defaultValue === '' ? '0' : defaultValue);
            } else {
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`].patchValue('');
                this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`].disable();
            }
        }
    }

    setParent(node: TreeItem, value?: boolean) {
        if (!value) {
            value = this.form.controls['rec.' + node.key].value;
        }
        if (node.parent && value) {
            const key = node.parent.key;
            this.form.controls['rec.' + key].patchValue(value);
            this.setParent(node.parent, value);
        }
        if (node.key === `${this.RCSEND}_ADDRESSEES` || node.key === `${this.RCSEND}_RESOLUTIONS`) {
            this.enabelDisabelRcSend(node);
        }
    }

    disableForm() {
        const resolutionInput = this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS`].value;

        (!resolutionInput) ? this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS_RADIO`].disable({ emitEvent: false }) :
                             this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS_RADIO`].enable({ emitEvent: false });
    }

    disableFormMailResive() {
        if (this.fieldsConstMailResive) {
            const addresInput = this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT`].value;
            const resolutionInput = this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK`].value;
            (!addresInput) ? this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`].disable({ emitEvent: false }) :
                            this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_NOTIFY_ABOUT_REGISTRATION_OR_REFUSAL_FROM_IT_RADIO`].enable({ emitEvent: false });

            (!resolutionInput) ? this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`].disable({ emitEvent: false }) :
                                 this.formMailResuve.controls[`rec.${this.MAILRECEIVE}_TAKE_RUBRICS_RK_RADIO`].enable({ emitEvent: false });
        }
    }

    getDefaultValue(key: string, type: 'rcSend' | 'mailReceive') {
        if (type === 'rcSend') {
            if (!this.prepareDefaultForm) {
                this.prepareDefaultForm = this.parse_Create(this.fieldsConst.fields, 'mapDefault', `${this.RCSEND}`);
            }
            return this.prepareDefaultForm[key].toString();
        }
        if (type === 'mailReceive' && this.fieldsConstMailResive) {
            if (!this.prepareDefaultFormMailREceive) {
                this.prepareDefaultFormMailREceive = this.parse_Create(this.fieldsConstMailResive.fields, 'mapDefault', `${this.MAILRECEIVE}`);
            }
            return this.prepareDefaultFormMailREceive[key].toString();
        }
    }

    enabelDisabelRcSend(tree: TreeItem) {
        const value = this.form.controls['rec.' + tree.key].value;
        if (tree.key === `${this.RCSEND}_RESOLUTIONS`) {
            if (value) {
                const defaultValue = this.getDefaultValue(`${this.RCSEND}_RESOLUTIONS_RADIO`, 'rcSend');
                this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS_RADIO`].enable();
                this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS_RADIO`].patchValue(defaultValue);
            } else {
                this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS_RADIO`].patchValue('');
                this.form.controls[`rec.${this.RCSEND}_RESOLUTIONS_RADIO`].disable();
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
        this.fieldsConst.disabledFields?.forEach(key => {
            this.form.controls['rec.' + key].disable({ emitEvent: false });
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
            if (dataVal[`${this.MAILRECEIVE}`] !== this.stringMailResive) {
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
        if (this.fieldsConstMailResive) {
            const position = this.hashKeyDBString.get(key.substring(4));
            if (this.setMailResive.has(key.substring(4))) {
                this.updateStringMailResiveKeyParentMoreOne(position, value);
            } else {
                this.updateStringRcSend(position, value, 'stringMailResive');
            }
        }
    }

    updateStringMailResiveKeyParentMoreOne(pos, value) {
        if (this.fieldsConstMailResive) {
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
    }

    upSrtMailREsiveToolog(position, bool1, bool2, bool3): void {
        this.updateStringRcSend(+position[0], bool1, 'stringMailResive');
        this.updateStringRcSend(+position[1], bool2, 'stringMailResive');
        this.updateStringRcSend(+position[2], bool3, 'stringMailResive');
    }

    emitChange() {
        const obj = {
            [`rec.${this.RCSEND}`]: this.stringRCSEND,
            [`rec.${this.MAILRECEIVE}`]: this.stringMailResive,
        };
        if (this.ErrorMailRecive || this.ErrorRcSend) {
            this.pushChenge.emit([[
                {
                    key: `${this.RCSEND}`,
                    value: this.stringRCSEND
                },
                {
                    key: `${this.MAILRECEIVE}`,
                    value: this.stringMailResive
                },
            ], obj]);
        } else {
            this.pushChenge.emit(false);
        }
    }

    CancelForm() {
        if (this.fieldsConstMailResive) {
            Object.keys(this.formMailResuve.controls).forEach(inp => {
                if (this.inputsMailResive[inp].value !== this.formMailResuve.controls[inp].value) {
                    this.formMailResuve.controls[inp].patchValue(this.inputsMailResive[inp].value, { emitEvent: false });
                }
            });
            this.formMailResuve.disable({ emitEvent: false });
        }
        Object.keys(this.form.controls).forEach(inp => {
            if (this.inputs[inp].value !== this.form.controls[inp].value) {
                this.form.controls[inp].patchValue(this.inputs[inp].value, { emitEvent: false });
            }
        });
        this.form.disable({ emitEvent: false });
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
        this.prepareDefaultForm = this.prepareDefaultForm ?
                                    this.prepareDefaultForm :
                                    this.parse_Create(this.fieldsConst.fields, 'mapDefault', `${this.RCSEND}`);

        this.prepareDefaultFormMailREceive = this.prepareDefaultFormMailREceive ?
                                                this.prepareDefaultFormMailREceive :
                                                this.parse_Create(this.fieldsConstMailResive.fields, 'mapDefault', `${this.MAILRECEIVE}`);
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
        if (this.fieldsConstMailResive) {
            Object.keys(this.prepareDefaultFormMailREceive).forEach((item: string) => {
                this.formMailResuve.controls['rec.' + item].patchValue(this.prepareDefaultFormMailREceive[item]);
            });
        }
    }

}
