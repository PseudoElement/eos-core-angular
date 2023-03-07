import {Component, OnChanges, } from '@angular/core';
import { NodeInfoComponent } from '../node-info.component';


@Component({
    selector: 'eos-sev-participant-node-info',
    templateUrl: 'sev-participant-node-info.component.html',
})
export class SevParticiantNodeInfoComponent extends NodeInfoComponent implements OnChanges {
    isnChannel: number;
    ngOnChanges() {
        super.ngOnChanges();
        if (this.node) {
           this.isnChannel = this.node.data.rec['ISN_CHANNEL'];
        }
    }
    showIcon(key: string) {
        return key === 'ISN_CHANNEL';
    }
    getTypeShowIcon(key: string) {
        if (key !== 'ISN_CHANNEL') {
            return '';
        }
        let flag = false;
        if (this.fieldsDescriptionFull.rec[key] && this.fieldsDescriptionFull.rec[key].options[0]) {
            const newData = this.fieldsDescriptionFull.rec[key].options[0]['data'];
            newData.forEach((item) => {
                if (item['ISN_LCLASSIF'] === this.isnChannel && item['CHANNEL_TYPE'] === 'email') {
                    flag = true;
                }
            });
        }
        return flag ? 'eos-adm-icon-A-Black' : 'eos-adm-icon-folder-black';
    }
}
