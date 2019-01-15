import {Component, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
    selector: 'eos-sev-rules-select',
    templateUrl: 'sev-rules-select.component.html',
})

export class RulesSelectComponent {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    listNodes: any[];
    usedNodes: any[];
    private _listSelected: any;
    private _usedSelected: any;


    constructor(
        public bsModalRef: BsModalRef,
    ) {
        this.isUpdating = true;
    }
    public initbyLists (list: any, used: any) {
        this.listNodes = list;
        this.usedNodes = used;
        this.isUpdating = false;
    }

    // public initbyNodeData(dndata: any) {
    //     this.isUpdating = true;
    //     this._dep_node = dndata;
    //     this.added_nodes = [];
    //     const query = ALL_ROWS;
    //     const req = {[SEV_RULES_TABLE_NAME]: query};
    //     this.apiSrv.read(req).then((cnts) => {
    //         this.rule_nodes = cnts;
    //         const rdata = dndata[SEV_RULES_LIST_NAME];
    //         if (rdata && rdata.length) {
    //             rdata.forEach(el => {
    //                 const n = this.rule_nodes.find( e => el.ISN_RULE === e.ISN_LCLASSIF);
    //                 if (n) {
    //                     this.added_nodes.push(n);
    //                 }
    //             });
    //         }
    //         this.isUpdating = false;
    //         return cnts;
    //     }).catch(err => this._errHandler(err));

    // }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    public save() {
        this.hideModal();
        this.onChoose.emit({list: this.listNodes, used: this.usedNodes});
    }

    public rowRuleClick(node: any) {
        this.listNodes.forEach (n => n.isActive = false);
        node.isActive = true;
        this._listSelected = node;
    }

    public rowAddedClick(node: any) {
        this.usedNodes.forEach (n => n.isAddedActive = false);
        node.isAddedActive = true;
        this._usedSelected = node;
    }

    btnAddClick () {
        if (this._listSelected) {
            this._markUsesSelect(this._listSelected);
            const i = this.usedNodes.indexOf(this._listSelected);
            if (i === -1) {
                this.usedNodes.push(this._listSelected);
            }
        }
    }

    btnDelClick () {
        if (this._usedSelected) {
            this._usedSelected.isAddedActive = false;
            this.usedNodes.splice(
                this.usedNodes.indexOf(this._usedSelected),
                1
            );
            this._usedSelected = null;
        }
    }

    btnSortUpClick () {
        if (this._usedSelected) {
            const i = this.usedNodes.indexOf(this._usedSelected);
            if (i > 0 ) {
                const t = this.usedNodes.splice(i - 1, 1);
                this.usedNodes.splice(i, 0, t[0]);
            }
        }
    }

    btnSortDnClick () {
        if (this._usedSelected && (this.usedNodes.length > 1)) {
            const i = this.usedNodes.indexOf(this._usedSelected);
            if (i < this.usedNodes.length - 1) {
                const t = this.usedNodes.splice(i + 1, 1);
                this.usedNodes.splice(i, 0, t[0]);
            }
        }

    }

    private _markUsesSelect (node: any) {
        this._usedSelected = node;
        this.usedNodes.forEach (n => n.isAddedActive = false);
        this._usedSelected.isAddedActive = true;
    }

}
