import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EosDictService } from '../services/eos-dict.service';
import { EosDictionaryNode } from 'eos-dictionaries/core/eos-dictionary-node';

@Component({
    selector: 'eos-node-info-switcher',
    templateUrl: 'node-info-switcher.component.html',
})
export class NodeInfoSwitcherComponent implements OnDestroy {

    node: EosDictionaryNode;
    private ngUnsubscribe: Subject<any> = new Subject();

    constructor(private _dictSrv: EosDictService) {
        this._dictSrv.openedNode$
            .pipe(
                takeUntil(this.ngUnsubscribe)

            )
            .subscribe((node) => {
                this.node = node;
            });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
