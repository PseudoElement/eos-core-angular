import { Component, OnChanges } from '@angular/core';
import { NodeInfoComponent } from '../node-info.component';
import { RESOLVE_DESCRIPTIONS } from 'eos-dictionaries/consts/dictionaries/sev/templates-sev.consts';

@Component({
    selector: 'eos-sev-collisions-node-info',
    templateUrl: './sev-collisions-node-info.component.html',
})
export class SevCollisionsNodeInfoComponent extends NodeInfoComponent implements OnChanges {
    fieldsResolveType: Array<{ title: string, default: boolean }> = [];
    ngOnChanges() {
        super.ngOnChanges();
        console.log(this);
        this.fillFields();
    }

    fillFields() {
        this.fieldsResolveType = [];
        if (this.node && this.node.data.rec['ALLOWED_RESOLVE_TYPES']) {
            const values: number[] = this.node.data.rec['ALLOWED_RESOLVE_TYPES'].split(',');
            values.forEach((n) => {
                let v = +n;
                --v;
                this.fieldsResolveType.push({
                    default: +RESOLVE_DESCRIPTIONS[v].value === this.node.data.rec['RESOLVE_TYPE'],
                    title: RESOLVE_DESCRIPTIONS[v].title,
                });
            });
        }
    }


}
