import {Component, EventEmitter, Injector, Input, OnDestroy, Output} from '@angular/core';
import {DropdownInput} from '../../eos-common/core/inputs/select-input';
import {FormGroup} from '@angular/forms';
import {InputControlService} from '../../eos-common/services/input-control.service';
import {ISelectOption} from '../../eos-common/interfaces';
import {AR_CATEGORY, AR_DESCRIPT, AR_DOCGROUP, DOCGROUP_CL, PipRX} from '../../eos-rest';
import {BaseCardEditComponent} from '../card-views/base-card-edit.component';
import {TextInput} from '../../eos-common/core/inputs/text-input';
import {StringInput} from '../../eos-common/core/inputs/string-input';
import {DateInput} from '../../eos-common/core/inputs/date-input';
import {CheckboxInput} from '../../eos-common/core/inputs/checkbox-input';
import {Subscription} from 'rxjs/Subscription';
import {EosUtils} from '../../eos-common/core/utils';
import {SUCCESS_SAVE} from '../consts/messages.consts';
import {EosMessageService} from '../../eos-common/services/eos-message.service';

const PADDING_W = 20;

@Component({
    selector: 'eos-additional-fields',
    templateUrl: 'additional-fields.component.html',
    styleUrls: ['./additional-fields.component.scss']
})

export class AdditionalFieldsComponent extends BaseCardEditComponent implements OnDestroy {
    @Input() showDeleted: boolean;
    @Input() nodeDescription: string;
    @Input() isnNode: number;
    @Output() formChanged: EventEmitter<any> = new EventEmitter<any>();


    form: FormGroup;
    nodes: any[];
    inputs: any;
    newData: any = {};
    w = 240;

    inputType = new DropdownInput({
        key: 'type',
        label: '',
        options: this._getSrchArHier(),
        required: false,
        forNode: true,
        value: '3',
        disabled: false,
    });

    private subscriptions: Subscription[];
    private isn_ar_keys;
    private isn_nodes;
    private isn_ar_descrs;
    private ar_values;
    private _nodes;


    constructor(
        private _msgSrv: EosMessageService,
        private _inputCtrlSrv: InputControlService,
        private _apiSrv: PipRX,
        injector: Injector,
    ) {
        super(injector);
        this.subscriptions = [];
    }

    init(type) {
        this.nodes = [];
        this.isn_ar_descrs = [];
        this.isn_nodes = {};
        this.isn_ar_keys = {};
        this.ar_values = {};
        this.inputs = {};

        this.ngOnDestroy();

        this._nodes = new Map<string, any>();
        this._getArCategories(type)
            .then((records) => {
                this._recordsToNodes(records);
                this._getValues()
                    .then((values) => {
                        this._recordsToValues(values);
                        this._getDescriptions()
                            .then((descripts) => {
                                this._recordsToInputs(descripts);
                                this.inputType.value = type;
                                this.inputs['type'] = this.inputType;

                                this.data = EosUtils.setValueByPath(this.data, 'type', type);

                                this.nodes = this._getTree(this._nodes).children;
                                this.form = this._inputCtrlSrv.toFormGroup(this.inputs, true);

                                this._subscribeToChanges();
                            });
                    });
            });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }

    onSelect(evt: Event, node: any) {
        evt.stopPropagation();
        if (node.expandable) {
            this._expandNode(node);
        } else {
            this._markNode(node);
        }
    }

    onExpand(evt: Event, node: any) {
        evt.stopPropagation();
        this._expandNode(node);
    }

    onMark(node: any) {
        this._markNode(node);
    }

    save(): void {
        this._apiSrv
            .read<DOCGROUP_CL>({
                DOCGROUP_CL: PipRX.criteries({'ISN_NODE': this.data.rec['ISN_NODE'].toString()}),
                expand: 'AR_DOCGROUP_List',
                foredit: true,
            })
            .then(([docGroup]) => {
                this._apiSrv.entityHelper.prepareForEdit(docGroup);

                this.keys(this.inputs).forEach((key) => {
                    const input = this.inputs[key];
                    if (input.visible && input.key !== 'type') {
                        let value = EosUtils.getValueByPath(this.data, input.key, false);

                        if (input.options) {
                            const opt = input.options.find((option) => option.value.toString() === value);
                            value = opt.title;
                        }

                        const ar = docGroup.AR_DOCGROUP_List.find((arl) => this.isn_ar_keys[arl.ISN_AR_DESCRIPT] === input.key);
                        if (ar) {
                            if (ar.DEF_VALUE !== value) {
                                ar.DEF_VALUE = value;
                                ar._State = 'MERGE';
                            }
                        } else {
                            const isn_node = this.isn_nodes[input.isn.toString()];
                            const newAr = <AR_DOCGROUP>{
                                _State: 'POST',
                                DEF_VALUE: value
                            };
                            Object.assign(newAr, this._nodes.get(isn_node.toString()).data);
                            docGroup.AR_DOCGROUP_List.push(newAr);
                        }
                    }
                });

                docGroup.AR_DOCGROUP_List.forEach((ar) => {
                    if (!this.inputs[this.isn_ar_keys[ar.ISN_AR_DESCRIPT]].visible) {
                        ar._State = 'DELETE';
                    }
                });

                const changes = this._apiSrv.changeList([docGroup]);
                this._apiSrv.batch(changes, '')
                    .then(() => {
                        this._msgSrv.addNewMessage(SUCCESS_SAVE);
                    })
                    .catch((err) => {
                        this._msgSrv.addNewMessage({msg: err.message, type: 'danger', title: 'Ошибка записи'});
                    });
            });
    }

    getPadding(level: number): number {
        return PADDING_W * level;
    }

    getNodeWidth(level: number): number {
        return this.w - (PADDING_W * level) - 42;
    }

    private _getTree(input) {
        input.forEach((item) => {
            if (item.ISN_HIGH_NODE || item.ISN_HIGH_NODE === 0) {
                const parent = input.get(item.ISN_HIGH_NODE.toString());
                if (parent) {
                    parent.children.push(item);
                }
            }
        });
        return input.get('0');
    }

    private _markNode(node) {
        node.marked = !node.marked;
        const isn_desc = node['ISN_AR_DESCRIPT'];
        const key = this.isn_ar_keys[isn_desc];
        this.inputs[key].visible = node.marked;
    }

    private _expandNode(node) {
        node.isExpanded = !node.isExpanded;
    }

    private _getSrchArHier(): ISelectOption[] {
        const options: ISelectOption[] = [];
        this._apiSrv
            .read({'SRCH_AR_HIER': PipRX.criteries({'HIER_USAGE': '%docgr%'})})
            .then((records) => records
                .forEach((record) => options.push(...[{value: record['HIER_KIND'], title: record['HIER_NAME']}])));
        return options;
    }

    private _getArCategories(type): Promise<any> {
        return this._apiSrv
            .read<AR_CATEGORY>({AR_CATEGORY: PipRX
                    .criteries({DELETED: '0', KIND: type.toString()})});
    }

    private _getValues(): Promise<any> {
        return this._apiSrv
            .read<AR_DOCGROUP>({AR_DOCGROUP: PipRX
                    .criteries({ISN_DOCGROUP: this.data.rec['ISN_NODE'].toString()})});
    }

    private _getDescriptions(): Promise<any> {
       return this._apiSrv
           .read<AR_DESCRIPT>({AR_DESCRIPT: PipRX
                   .criteries({ISN_AR_DESCRIPT: this.isn_ar_descrs.join('|')}), expand: 'AR_VALUE_LIST_List'});
    }

    private _recordsToNodes(records) {
        records.forEach((record) => {
            this._nodes.set(record['ISN_NODE'].toString(), Object.assign({}, record, {
                children: [],
                isNode: true,
                isActive: false,
                isSelected: true,
                data: record,
                expandable: !record['IS_NODE'],
                marked: false,
                isExpanded: true,
                title: record['CLASSIF_NAME']
            }));
            this._nodes.set('0', {children: [], ISN_NODE: 0});

            const isn_ar = record['ISN_AR_DESCRIPT'];
            if (isn_ar) {
                this.isn_ar_descrs.push(isn_ar);
                this.isn_nodes[isn_ar] = record['ISN_NODE'];
            }
        });
    }

    private _recordsToValues(values) {
        this.data['addFields'] = values;
        values.forEach((value) => {
            this.ar_values[value['ISN_AR_DESCRIPT']] = value['DEF_VALUE'];
        });
    }

    private _recordsToInputs(descripts) {
        descripts.forEach((descript) => {
            const isn_ar = descript['ISN_AR_DESCRIPT'];
            const key = 'addFields.' + descript['API_NAME'];
            this.isn_ar_keys[isn_ar] = key;

            const commonParams = {
                key: key,
                label: descript['UI_NAME'],
                required: false,
                forNode: true,
                value: this.ar_values[isn_ar],
                isUnique: false,
                uniqueInDict: false,
                readonly: false,
                disabled: false,
                dict: 'addFields',
                pattern: undefined,
                length: undefined,
            };

            this.data = EosUtils.setValueByPath(this.data, key, this.ar_values[isn_ar]);

            if (descript['ISN_CLS_CONTROL']) {
                this.inputs[key] = new StringInput(commonParams);
            } else if (descript['USE_LIST_FLAG']) {
                const options = [];
                descript['AR_VALUE_LIST_List'].forEach((option) => {
                    options.push({
                        value: option['ISN_AR_VALUE_LIST'],
                        title: option['VALUE']
                    });
                    if (this.ar_values[isn_ar] === option['VALUE']) {
                        commonParams.value = option['ISN_AR_VALUE_LIST'];
                    }
                });

                this.inputs[key] = new DropdownInput(Object.assign({}, commonParams, {
                    options: options,
                }));
            } else if (descript['IS_MULTILINE']) {
                this.inputs[key] = new TextInput(commonParams);
            } else if (descript['AR_TYPE'] === 'decimal') {
                this.inputs[key] = new StringInput(commonParams);
            } else if (descript['AR_TYPE'] === 'date') {
                this.inputs[key] = new DateInput(commonParams);
            } else if (descript['AR_TYPE'] === 'flag') {
                this.inputs[key] = new CheckboxInput(commonParams);
            } else {
                this.inputs[key] = new StringInput(commonParams);
            }

           const hasValue = !!this.ar_values[isn_ar];
            Object.assign(this.inputs[key], {
                visible: hasValue,
                isn: isn_ar,
            });

            const isn_node = this.isn_nodes[this.inputs[key].isn];
            const node = this._nodes.get(isn_node.toString());
            node.marked = hasValue;
        });
    }

    private _subscribeToChanges() {
        this.subscriptions.push(this.form.valueChanges.subscribe((newVal) => {
            let changed = false;
            Object.keys(newVal).forEach((path) => {
                if (this._changeByPath(path, newVal[path])) {
                    changed = true;
                }
            });
            this.formChanged.emit(changed);
        }));
    }

    private _changeByPath(path: string, value: any) {
        let _value = null;
        if (typeof value === 'boolean') {
            _value = +value;
        } else if (value === 'null') {
            _value = null;
        } else if (value instanceof Date) {
            _value = EosUtils.dateToString(value);
        } else if (value === '') { // fix empty strings in IE
            _value = null;
        } else {
            _value = value;
        }
        this.newData = EosUtils.setValueByPath(this.newData, path, _value);
        const oldValue = EosUtils.getValueByPath(this.data, path, false);

        if (oldValue !== _value) {
            this.data = EosUtils.setValueByPath(this.data, path, _value);
            if (path === 'type') {
                this.init(_value);
            }
            // console.warn('changed', path, oldValue, 'to', _value, this.data.rec);
        }

        return _value !== oldValue;
    }
}
