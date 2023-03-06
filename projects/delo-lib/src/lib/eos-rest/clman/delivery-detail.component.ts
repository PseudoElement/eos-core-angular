import { Component, Input } from '@angular/core';

import { DELIVERY_CL } from '../interfaces/structures';
import { PipRX } from '../services/pipRX.service';
import { _ES } from '../core/consts';

@Component({
    selector: 'eos-delivery-detail',
    templateUrl: './delivery-detail.component.html'
})
export class DeliveryDetailComponent {
    item: DELIVERY_CL;

    @Input()
    set it(it: DELIVERY_CL) {
        // this.item = it;
        if (!it) {
            this.item = undefined;
            return;
        }
        if (it.ISN_LCLASSIF > 0) {
            this.read(it.ISN_LCLASSIF);
        } else {
            // создание, может его логичнее здесь делать, чем снаружи?
            // create()
            this.item = it;
        }
    }

    constructor(private pip: PipRX) { }

    /*
    //create() {
    //       this.item = { ISN_LCLASSIF: -10000, CLASSIF_NAME: '' };
    //}
    */

    read(isn: number) {
        this.pip.read<DELIVERY_CL>({ 'DELIVERY_CL': [isn] })
            .then(r => {
                this.pip.entityHelper.prepareForEdit(r[0]);
                this.item = r[0];
            });
    }

    onSave() {
        const chl = this.pip.changeList([this.item]);
        this.pip.batch(chl, '').then(() => {
            alert(this.pip.sequenceMap.GetFixed(this.item.ISN_LCLASSIF));
        });

    }

    onDel() {
        // tslint:disable-next-line:no-debugger
        debugger;
        this.item._State = _ES.Deleted;
        const chl = this.pip.changeList([this.item]);
        this.pip.batch(chl, '').then((r) => {
            alert(r);
        });
    }
}
