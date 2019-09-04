import { Component, Input, OnInit, /*  OnInit, HostListener, OnDestroy, Output, EventEmitter */ } from '@angular/core';
 import { ActivatedRoute, Router } from '@angular/router';
// import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
// import { Subscription } from 'rxjs';

@Component({
    selector: 'eos-template-tree',
    templateUrl: 'template-tree.component.html'
})

export class TemplateTreeComponent implements OnInit {
    @Input() data;
    nodeId: number;
    constructor(
        private _routeActiv: ActivatedRoute,
        private _router: Router,
       // private _dictSrv: EosDictService,
        ) {
    }
    ngOnInit() {
        this._routeActiv.params.subscribe(data => {
            if (data.nodeId) {
                this.nodeId = data.nodeId;
            }
        });
    }
    getPadding(level) {
        return 32 * level;
    }
    onExpand($event, node) {
        $event.stopPropagation();
        node.isExpanded = !node.isExpanded;
    }
    onSelect($event, node) {
       this._router.navigate([node.path]);
    }

    getNodeWidth(level) {
        return 200;
    }
}
