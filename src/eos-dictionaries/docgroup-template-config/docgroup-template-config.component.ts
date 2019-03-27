import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs/Subscription';

import {
    PRJ_TEMPLATE_ELEMENTS,
    DOC_TEMPLATE_ELEMENTS,
    SINGLE_TEMPLATE_ITEM_EXPR,
    VALID_TEMPLATE_EXPR,
    VALID_PRJ_TEMPLATE_EXPR,
    ORDER_NUM_TEMPLATE_ITEM_EXPR,
    DGTplElement,
} from './docgroup-template-config.consts';

@Component({
    selector: 'eos-docgroup-template-config',
    templateUrl: 'docgroup-template-config.component.html',
})
export class DocgroupTemplateConfigComponent implements OnDestroy {
    @Input() dgTemplate: string;
    @Input() forProject: boolean;
    @Input() rcType: number;

    @Output() onSave: EventEmitter<string> = new EventEmitter<string>();

    availableItems: any[] = [];
    templateItems: any[] = [];
    selected: any[] = [null, null];
    separator: string;

    private subscriptions: Subscription[] = [];

    /**
     * @description constructor, subscribe on drop in dragulaService for highlighting selected field
     * @param dragulaService drag'n'drop service
     * @param bsModalRef reference to modal
     */
    constructor(
        private dragulaService: DragulaService,
        public bsModalRef: BsModalRef,
    ) {


        // declare namespace dragula {
        //     interface DragulaOptions {
        //         containers?: Element[];
        //         isContainer?: (el?: Element) => boolean;
        //         moves?: (el?: Element, container?: Element, handle?: Element, sibling?: Element) => boolean;
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
            copy: (el, source) => {
                return source.id !== 'selected' && !el.classList.contains('disabled');
            },
            removeOnSpill: true,
            copySortSource: true,
            ignoreInputTextSelection: true,
            invalid: (el?: Element, target?: Element) => {
                return el.classList.contains('disabled');
            },
            accepts: (el, target, source, sibling) => {
                if (target.id === 'availble' && target.id === source.id) {
                    return false;
                }
                return true;
            }
        });

        this.subscriptions.push(dragulaService.dropModel.subscribe(( [hz, el, target, source, sourceModel, targetModel, item] ) => {
            if (target.id === 'availble') {
            }
            this.updateTemplate();
        }));

        this.subscriptions.push(dragulaService.drag.subscribe(() => {
            this.selected = [null, null];
            this.separator = '';
        }));
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

    init(content: any) {
        this.selected = [null, null];
        if (content) {
            this.dgTemplate = content.dgTemplate;
            this.forProject = content.forProject;
            this.rcType = content.rcType;
        }

        this.parseTemplate();
        this.updateAvailableItems();
    }

    isEnabled(item: DGTplElement): boolean {
        // check if complex elements already in template
        if (((item.isNotUnique === void 0) || !item.isNotUnique) && this.templateItems.findIndex((elem) => elem.key === item.key) !== -1) {
            return false;
        }

        let res = this.templateItems.findIndex((elem) => SINGLE_TEMPLATE_ITEM_EXPR.test(elem.key)) === -1;
        if (res && this.templateItems.length) {
            // disable complex elements for non empty template
            res = !SINGLE_TEMPLATE_ITEM_EXPR.test(item.key);
        }
        if (res && this.forProject && item.key === '{7}') {
            res = this.templateItems.findIndex((elem) => elem.key === '{2}') > -1;
        }

        if (res && this.templateItems.findIndex((elem) => ORDER_NUM_TEMPLATE_ITEM_EXPR.test(elem.key)) !== -1) {
            res = !ORDER_NUM_TEMPLATE_ITEM_EXPR.test(item.key);
        }

        if (item.key === '{N}' && res) {
            res = (this.rcType === 3);
        }

        return res;
    }

    isSeparator(item: any) {
        return item.key.indexOf('{') + item.key.indexOf('}') === -2;
    }

    isTemplateValid(): boolean {
        if (this.forProject) {
            return VALID_PRJ_TEMPLATE_EXPR.test(this.dgTemplate);
        } else {
            return VALID_TEMPLATE_EXPR.test(this.dgTemplate);
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
        this.onSave.emit(this.dgTemplate);
        this.hideModal();
    }

    /**
     * @description move item from all fields (left) to custom fields (right)
     * use with arrows
     */
    addToTemplate() {
        if (this.selected[0] && this.isEnabled(this.selected[0])) {
            const obj = Object.assign(this.selected[0]);
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
        if (this.selected[1]) {
            const idx = this.templateItems.findIndex((elem) => elem === this.selected[1]);
            if (idx > -1) {
                this.templateItems.splice(idx, 1);
                this.selected[1] = null;
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
            this.selected[idx] = item;
            if (idx === 1) {
                this.separator = this.isSeparator(item) ? item.key : '';
            }
        }
    }

    update(event: any) {
        if (this.selected[1]) {
            event.target.value = event.target.value.replace(/([*{}])/g, '');
            this.selected[1].key = event.target.value;
            this.generateTemplate();
        }
    }

    private generateTemplate(): string {
        this.dgTemplate = this.templateItems.map((elem) => elem.key).join('');
        return this.dgTemplate;
    }

    private parseTemplate() {
        if (this.dgTemplate) {
            this.dgTemplate.split(/(\{.{1,2}\})/).forEach((key) => {
                if (key) {
                    const tplElem = DOC_TEMPLATE_ELEMENTS.find((elem) => elem.key === key);
                    if (tplElem) {
                        this.templateItems.push(Object.assign({}, tplElem));
                    } else {
                        this.templateItems.push(Object.assign({}, {
                            key: key,
                            title: 'Разделитель'
                        }));
                    }
                }
            });
        }
    }

    private updateAvailableItems() {
        const items = (this.forProject ? PRJ_TEMPLATE_ELEMENTS : DOC_TEMPLATE_ELEMENTS).slice(0);
        this.availableItems = items;
    }

    private updateTemplate() {
        this.updateAvailableItems();
        this.generateTemplate();
        this.separator = '';
    }
}
