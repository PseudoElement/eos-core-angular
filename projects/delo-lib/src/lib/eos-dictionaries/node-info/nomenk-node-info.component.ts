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
        if (this.node) {
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
                } while (ptr && ptr.parent);
            }
        }

    }

}
