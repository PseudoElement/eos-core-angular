import {Component} from '@angular/core';
import {BaseNodeInfoComponent} from './base-node-info';

@Component({
    selector: 'eos-node-info',
    templateUrl: 'node-info.component.html',
})

export class NodeInfoComponent extends BaseNodeInfoComponent {
    value(key): string {
        let res = this.nodeDataFull.rec[key];

        const field = this.fieldsDescriptionFull.rec[key];

        if ((field.type === this.fieldTypes.select || field.type === this.fieldTypes.buttons ) && field.options.length) {
            const f = field.options.find((op) => op.value === res);
            if (f) {
                res = f.title;
            }
        }

        return res;
    }
}
