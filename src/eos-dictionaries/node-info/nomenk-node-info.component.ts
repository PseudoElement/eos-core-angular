import {Component, OnChanges} from '@angular/core';
import { NodeInfoComponent } from './node-info.component';

@Component({
    selector: 'eos-nomenk-node-info',
    templateUrl: 'nomenk-node-info.component.html',
})

export class NomenkNodeInfoComponent extends NodeInfoComponent implements OnChanges {

    public depTitle: string;

    ngOnChanges () {
        super.ngOnChanges();
        this.depTitle = '';
        let ptr = this.node.dictionary.descriptor.getParentFor(this.node.data['rec']['DUE']);
        if (ptr) {
            do {
                if (this.depTitle !== '') {
                    this.depTitle = ptr.title + ' >\n' + this.depTitle;
                } else {
                    this.depTitle = ptr.title;
                }

                ptr = this.node.dictionary.descriptor.getParentFor(ptr.parent);
            } while (ptr.parent);
        }

    }

    // value(key): string {
    //     let res = this.nodeDataFull.rec[key];

    //     const field = this.fieldsDescriptionFull.rec[key];

    //     if ((field.type === this.fieldTypes.select || field.type === this.fieldTypes.buttons ) && field.options.length) {
    //         const f = field.options.find((op) => op.value === res);
    //         if (f) {
    //             res = f.title;
    //         }
    //     }

    //     return res;
    // }
}
