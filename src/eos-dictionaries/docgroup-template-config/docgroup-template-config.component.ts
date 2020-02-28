import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

import { Features } from 'eos-dictionaries/features/features-current.const';
import { DGTplElement, DGTplAdditionalControl } from 'eos-dictionaries/helpers/numcreation-template.interface';
import { ListSelectorFormComponent, SelectorListItem } from 'eos-dictionaries/dict-forms/list-selector-modal/list-selector-form.component';
import { PipRX } from 'eos-rest';
import { DG_TPL_SEPARATOR } from 'eos-dictionaries/features/docgroups/docgroup-template-base.consts';

const FTemplates = Features.cfg.docgroups.templates;

interface DGTplElementEdit extends DGTplElement {
    editKey: string;
    additionalControls?: DGTplAddControl[];
    // shablon_detail?: ShablonDetailRecord[];
}

interface DGTplAddControl extends DGTplAdditionalControl {
    item: DGTplElementEdit;
    editValue: any;
}
@Component({
    selector: 'eos-docgroup-template-config',
    templateUrl: 'docgroup-template-config.component.html',
})

export class DocgroupTemplateConfigComponent implements OnDestroy {

    @Input() dgTemplate: string;
    @Input() additionalData: any;
    @Input() forProject: boolean;
    @Input() rcType: number;
    @Input() allowEmpty: boolean;

    @Output() onSave: EventEmitter<any[]> = new EventEmitter<any[]>();

    availableItems: DGTplElement[] = [];
    templateItems: DGTplElementEdit[] = [];
    selection: {left: DGTplElement, right: DGTplElementEdit};
    separator: string;
    cb1: null;
    shablon_detail: any = { L: [], R: []};
    // additionalControls: DGTplAddControl[] = [];

    private subscriptions: Subscription[] = [];
    // private _cachedLinks: any[];
    private _cachedLinks1: SelectorListItem[];

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(
        private dragulaService: DragulaService,
        public bsModalRef: BsModalRef,
        private _apiSrv: PipRX,
    ) {

        this._selectionReset();
        // declare namespace dragula {
        //     interface DragulaOptions {
        //         containers?: Element[];
        //         isContainer?: (el?: Element) => boolean;
        //         moves?: (el?: Element, container?: Element, handle?: Element, sibling?: Element) => boolean; MOVABLE!!!
        //         accepts?: (el?: Element, target?: Element, source?: Element, sibling?: Element) => boolean;
        //         invalid?: (el?: Element, target?: Element) => boolean;
        //         direction?: string;
        //         copy?: ((el: Element, source: Element) => boolean) | boolean;
        //         revertOnSpill?: boolean;
        //         removeOnSpill?: boolean;
        //         delay?: boolean | number;
        //         mirrorContainer?: Element;
        //         ignoreInputTextSelection?: boolean;
        //     }
        dragulaService.setOptions('template-bag', {
            revertOnSpill: true,
            moves: (el, source) => { //
                return true;
            },
            copy: (el, source) => {
                return source.id === 'availble';
            },
            delay: 100,
            removeOnSpill: true,
            copySortSource: false,
            ignoreInputTextSelection: true,
            invalid: (el?: Element, target?: Element) => {
                return el.classList.contains('disabled');
            },
            accepts: (el, target, source, sibling) => {
                return true;
            }
        });

        this.subscriptions.push(dragulaService.dropModel.subscribe(([bagname, el, target, source, sourceModel, targetModel, item]) => {
            if (bagname === 'template-bag') {
                this.updateTemplate();
            }
        }));

        this.subscriptions.push(dragulaService.dragend.subscribe(([bagname, el, target, source, sourceModel, targetModel, item]) => {
            if (bagname === 'template-bag') {
                this.updateTemplate();
                this._selectionReset();
            }
        }));
        // this.subscriptions.push(dragulaService.drop.subscribe(([bagname, el, target, source, sourceModel, targetModel, item]) => {

        // }));
        // this.subscriptions.push(dragulaService.removeModel.subscribe(([hz, el, target, source, sourceModel, targetModel, item]) => {

        // }));

        const req = { LINK_CL: { orderby: 'CLASSIF_NAME' /*'WEIGHT'*/}};
        this._apiSrv.read(req).then((data) => {

            if (data && data.length) {

                const list1: SelectorListItem[] = data.map (rec => {
                    const pair = data.find (d => d['ISN_LCLASSIF'] === rec['ISN_PARE_LINK']);
                    return Object.assign({}, {
                        key: rec['ISN_LCLASSIF'],
                        CONSTR_TYPE: rec['CONSTR_TYPE'],
                        title: rec['CLASSIF_NAME'] + (pair ? ' - ' + pair['CLASSIF_NAME'] : ''),
                        obj: rec });

                });
                this._cachedLinks1 = list1;

                this.additionalControls.filter( c => c.storeInInfo === 'L').forEach( (ctrl: DGTplAddControl) => {

                    const list2: SelectorListItem[] = [].concat (... this.additionalData['SHABLON_DETAIL_List']
                        .filter(s => s['element'] === this._getLetter(ctrl.item) && s.CONSTR_TYPE === 'L'));
                    list2.forEach ( l => {
                        const obj = data.find( d => d['ISN_LCLASSIF'] === l.key);
                        if (obj) {
                            const pair = data.find (d => d['ISN_LCLASSIF'] === obj['ISN_PARE_LINK']);
                            // l['CONSTR_TYPE'] = obj['CONSTR_TYPE'];
                            l.obj = obj;
                            l.title = obj['CLASSIF_NAME'] + (pair ? ' - ' + pair['CLASSIF_NAME'] : '');
                        }
                    });
                    ctrl.editValue = list2;

                });
            }

        });

    }

    /**
     * @description unsubscribe from dragulaService,
     * destroy dragula bags
     */
    ngOnDestroy() {
        if (!!this.dragulaService.find('template-bag')) {
            this.dragulaService.destroy('template-bag');
        }
        this.subscriptions.forEach((s) => s.unsubscribe());
    }

    get visibleAddControlsL(): DGTplAddControl[] {
        return this.visibleAddControls.filter( c => c.storeInInfo === 'L');
    }
    get visibleAddControlsR(): DGTplAddControl[] {
        return this.visibleAddControls.filter( c => c.storeInInfo === 'R');
    }
    get visibleAddControls(): DGTplAddControl[] {
        if (this.selection.right) {
            return this.selection.right.additionalControls || [];
        } else if (this.templateItems.length === 1) {
            return this.templateItems[0].additionalControls || [];
        }
        return [];
    }

    get additionalControls() {
        return [].concat(... this.templateItems.filter(ti => ti.additionalControls).map(ti => ti.additionalControls));
    }

    hasAdditionalControls(): boolean {
        return this.visibleAddControls.length > 0;
    }

    tooltipSave (): string {
        return this.isTemplateValid() ? null :
            (this.forProject ? FTemplates.prj.invalidText : FTemplates.doc.invalidText);
    }

    init() {
        this._selectionReset();
        this.parseTemplate();
        this.updateTemplate();
    }

    isValid(item: DGTplElement): boolean {
        // item - dragula рубит почемуто regexp при перетаскивании.
        // ищем в aviableItems
        const avItem = this.availableItems.find( i => i.key === item.key);

        if (!avItem) { return false; }

        return avItem.possibleRKType ? avItem.possibleRKType.test(String(this.rcType)) : true;
    }
    getListText(item: DGTplAddControl) {
        if (item.editValue && item.editValue instanceof Array) {
            return item.editValue.map( i => i.title).join('; ');
        }
        return  '';
    }

    isEnabled(item: DGTplElement): boolean {
        // check if complex elements already in template
        if (!item.isNotUnique && this.templateItems.findIndex((elem) => elem.key === item.key) !== -1) {
            return false;
        }

        if (item.possibleRKType && !item.possibleRKType.test(String(this.rcType))) {
             return false;
        }

        if (item.enabledMask && this.dgTemplate !== null && !item.enabledMask.test(this.dgTemplate)) {
            return false;
        }

        return true;
    }

    isEditCheckbox() {
        return this.templateItems.length && this.templateItems[0].key === '{@}';
    }

    isEditSeparator() {
        return this.separator && this.selection.right && this.isSeparator(this.selection.right);
    }

    isSeparator(item: any) {
        return item.key.indexOf('{') + item.key.indexOf('}') === -2;
    }

    isTemplateValid(): boolean {
        if (this.allowEmpty && (!this.dgTemplate || !this.dgTemplate.length)) {
            return true;
        }

        if (this.forProject) {
            return FTemplates.prj.validationExpr.test(this.dgTemplate);
        } else {
            return FTemplates.doc.validationExpr.test(this.dgTemplate);
        }
    }

    clearTemplate() {
        this.templateItems = [];
        this.updateTemplate();
    }

    /**
     * @description hide modal
     */
    hideModal(): void {
        this.bsModalRef.hide();
    }

    /**
     * @description emit custom fields and hide modal
     */
    save() {
        if (!this.isTemplateValid()) {
            return;
        }
        // clear unused data
        const unusedControls = [].concat(... this.availableItems.filter( t => t.additionalControls)
        .filter(a => !this.templateItems.find(t => a.key === t.key))
        .map(t => t.additionalControls));
        unusedControls.
        filter(c => this.additionalData.hasOwnProperty(c.key)).
        forEach( c => this.additionalData[c.key] = c.hasOwnProperty('valueIfUnused') ? c.valueIfUnused : null );

        const list = [].concat(... this.additionalControls.map( c => c.editValue).filter( d => d !== ''), );
        this.additionalData['SHABLON_DETAIL_List'] = list;

        this.onSave.emit([this.dgTemplate, this.additionalData]);
        this.hideModal();
    }

    /**
     * @description move item from all fields (left) to custom fields (right)
     * use with arrows
     */
    addToTemplate() {
        if (this.selection.left && this.isEnabled(this.selection.left)) {
            const obj = Object.assign(this.selection.left);
            this.select(obj, 1);
            this.templateItems.push(obj);
            this.updateTemplate();
        }

        // IE fix for hidding elements... hate this
        const element: HTMLElement = document.getElementById('selected');
        const parent = element.parentElement;
        parent.removeChild(element);
        parent.appendChild(element);

    }

    /**
     * @description move item from custom fields (right) to all fields (left)
     * use with arrows
     */
    removeFromTemplate() {
        if (this.selection.right) {
            const idx = this.templateItems.findIndex((elem) => elem === this.selection.right);
            if (idx > -1) {
                this.templateItems.splice(idx, 1);
                this.selection.right = null;
                this.separator = '';
                this.updateTemplate();
            }
        }
    }

    /**
     * @description highlight selected item
     * @param item highlighted item
     * @param idx indicates where item is placed
     */
    select(item: any, idx: number) {
        if (idx > 0 || this.isEnabled(item)) {
            if (idx === 1) {
                this.selection.right = item;
                this.separator = this.isSeparator(item) ? item.editKey || item.key : '';
            } else {
                this.selection.left = item;
            }
        }
    }
    valueForControl (item) {
        return this.additionalData[item.key] || (item.editValue.length ? item.editValue : false );
    }

    cbChange(control: DGTplAddControl, event: any) {

        if (event.target.id && this.additionalData.hasOwnProperty(event.target.id)) {
            this.additionalData[event.target.id] = event.target.checked ? 1 : 0;
        }

        const item =  control.item;

        if (item && item.infoL && control && control.storeInInfo === 'R') {
            // this._setShablonInfo(item, control.storeInInfo, event.target.checked);
            control.editValue = event.target.checked ? [{ CONSTR_TYPE: 'R', element: this._getLetter(item) }] : [];
            item.editKey = this._setL(item.editKey, event.target.checked);
        }
        this.generateTemplate();
    }

    // _setShablonInfo(item: DGTplElementEdit, type: 'L' | 'R', value: any) {
    //     // const exist = this.shablon_detail
    //     if (!item.shablon_detail) {
    //         item.shablon_detail = [];
    //     }

    //     const exist = item.shablon_detail.find(s => s.CONSTR_TYPE === type);
    //     if (exist && type === 'L' && !value) {
    //         item.shablon_detail = item.shablon_detail.filter (d => d !== exist);
    //     } else if (!exist && type === 'L' && value) {
    //         item.shablon_detail.push(<ShablonDetailRecord>{
    //             ELEMENT: this._getLetter(item),
    //             CONSTR_TYPE: type,
    //             ISN_LCLASSIF: null,
    //          });
    //     }
    // }

    _getLetter(item: DGTplElementEdit) {
        return item.key.replace(/([*{}])/g, '');
    }

    keyUpSeparator(event: any) {
        if (this.selection.right) {
            event.target.value = event.target.value.replace(/([*{}])/g, '');
            this.selection.right.editKey = event.target.value;
            this.generateTemplate();
        }
    }

    itemCButtonClick(item: DGTplAddControl, $event) {

        const req = { LINK_CL: { orderby: 'CLASSIF_NAME' /*'WEIGHT'*/}};
        this._apiSrv.read(req).then((data) => {
            if (data && data.length) {
                const list1 = [... this._cachedLinks1];
                const list2 = [].concat(item.editValue || []);

                const modalObj: ListSelectorFormComponent = ListSelectorFormComponent.showModal('Типы связок', list1, list2);

                const s1 = modalObj.onSave.subscribe(([list]) => {
                    list.filter( l => !l.element).forEach(l => {
                        l.element = this._getLetter(item.item);
                    });

                    item.editValue = list;
                    item.item.editKey = this._setR(item.item.editKey, list && list.length);
                    s1.unsubscribe();
                });

                const s2 = modalObj.onClose.subscribe(() => {
                    s2.unsubscribe();
                });
            }
        });
    }

    private _setL(editKey: string, value: any): string {
        if (value && editKey.charAt(0) === '{' && editKey.charAt(1) !== '*') {
            editKey = '{*' + editKey.substr(1);
        } else if (!value && editKey.charAt(0) === '{' && editKey.charAt(1) === '*') {
            editKey = '{' + editKey.substr(2);
        }
        return editKey;
    }

    private _setR(editKey: string, value: any): string {
        const closeIndex = editKey.indexOf('}');
        if (closeIndex > 0) {
            if (value && editKey.charAt(closeIndex - 1) !== '*') {
                editKey = editKey.substr(0, closeIndex) + '*}';
            } else if (!value && editKey.charAt(closeIndex - 1) === '*') {
                editKey = editKey.substr(0, closeIndex - 1) + '}';
            }
        }
        return editKey;
    }

    private _selectionReset() {
        this.selection = { left: null, right: null };
    }

    private generateTemplate(): string {
        this.dgTemplate = this.templateItems.map((elem) => elem.editKey).join('');
        return this.dgTemplate;
    }

    private parseTemplate() {
        if (this.dgTemplate) {
            this.dgTemplate.split(/(\{.{1,2}\})/).forEach((key) => {
                if (key) {
                    const cleanKey = key.replace(/\*/g, '');
                    const tplElem = (this.forProject ? FTemplates.prj.list : FTemplates.doc.list).find((elem) => elem.key === cleanKey);
                    if (tplElem) {
                        const item = this._cloneToEditable(tplElem);
                        item.editKey = key;

                        this.templateItems.push(item);

                        this._checkControlsValuesR(item);

                    } else {
                        this.templateItems.push(Object.assign({editKey: key}, <DGTplElementEdit>DG_TPL_SEPARATOR));
                    }
                }
            });
        }
    }
    private _checkControlsValuesR(item: DGTplElementEdit) {
        const letter = this._getLetter(item);
        const list = this.additionalData['SHABLON_DETAIL_List'].filter (d => d.CONSTR_TYPE === 'R' && d.element === letter);
        item.additionalControls.forEach( control => {
            if (control.storeInInfo === 'R') {

                control.editValue = list;
                item.editKey = this._setR(item.editKey, !!list);
            }
        });
    }

    private updateAvailableItems() {
        const items = (this.forProject ? FTemplates.prj.list : FTemplates.doc.list).slice(0);
        this.availableItems = items;

        // пересоздадим по ключу, ибо драгула теряет поля при драгдропе.
        // this.templateItems = this.templateItems
        // .map( t => {
        //     // - для измененных separator оставляем то что было.
        //     if (t.editKey === void 0) { // там где отсутствует editKey - свежий значит.
        //         const etalon = items.find( i => i.key === t.key );
        //         if (!etalon) {
        //             return t;
        //         } else {
        //             const item = Object.assign({editKey: etalon.key }, etalon);
        //             return item;
        //         }

        //     }
        //     return t;
        // });
    }

    private updateTemplate() {
        // только что добавленные
        this._detectAdded();
        // удаленные.
        // const deletedList = this.additionalControls.filter (ac => !this.templateItems.find(ti => ac.item === ti));
        // if (deletedList && deletedList.length) {
        //     this.additionalControls = [].concat(... this.templateItems.filter( t => t.additionalControls).map( t => t.additionalControls));
        // }


        // for (let i = 0; i < this.additionalControls.length; i++) {
        //     const a = this.additionalControls[i];
        //     const t = this.templateItems.find( i => i === a.item);
        //     if (!t) {

        //     }
        // }

        setTimeout(() => { // Надо посортировать попозже, ибо бутстрап.

            this.templateItems = this.templateItems.sort((a, b) => {
                const res = ((a.onlyPos || 0) - (b.onlyPos || 0));
                return res < 0 ? -1 : res > 0 ? 1 : 0;
            });

            // this.additionalControls = [].concat(... this.templateItems.filter( t => t.additionalControls).map(t =>
            //     t.additionalControls.map(a => {
            //         // if (a.item === void 0) {

            //             return Object.assign({ item: t, editValue: ''}, a);
            //         // } else {
            //             // return a;
            //         // }
            //     }
            // )));

            this.updateAvailableItems();
            this.generateTemplate();
            this.separator = '';
        }, 10);
    }

    private _detectAdded() {
        for (let i = 0; i < this.templateItems.length; i++) {
            const t = this.templateItems[i];
            if (t.editKey === void 0) {
                // const index = this.templateItems.indexOf(t);
                const etalon = this.availableItems.find( e => e.key === t.key );
                const newitem: DGTplElementEdit = this._cloneToEditable(etalon);
                this.templateItems[i] = newitem;
            }
        }
    }
    private _cloneToEditable(etalon: DGTplElement): DGTplElementEdit {
        const result = Object.assign(
            { editKey: etalon.key },
            etalon,
            { additionalControls: []});
        if (etalon.additionalControls) {
            result.additionalControls = etalon.additionalControls.map (a => Object.assign({ item: result, editValue: ''}, a));
        }
        return result;
    }
}
