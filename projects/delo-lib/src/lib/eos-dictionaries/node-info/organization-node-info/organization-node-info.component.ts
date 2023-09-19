import { Component, Input } from '@angular/core';
import { EosDictionaryNode } from '../../../eos-dictionaries/core/eos-dictionary-node';
import { CarmaHttp2Service } from '../../../app/services/camaHttp2.service';

@Component({
    selector: 'eos-organization-node-info',
    styleUrls:['./organization-node-info.component.scss'],
    templateUrl: './organization-node-info.component.html'
})

export class OrganizationNodeInfoComponent {
    @Input() node: EosDictionaryNode;

    constructor(
        private CarmaHttp2Service: CarmaHttp2Service,
    ) {}

    get title() {
        return this.node.data.rec.CLASSIF_NAME || '...';
    }

    get note() {
        return this.node.data.rec.NOTE || '...';
    }

    get vertex() {
        return this.node.isNode;
    }

    get region() {
        if(this.node.data.rec.ISN_REGION && this.node.data.REGION_Ref[0]) {
            return this.node.data.REGION_Ref[0].CLASSIF_NAME;
        } else {
            return '...';
        }
    }

    get zipcode() {
        return this.node.data.rec.ZIPCODE || '...';
    }

    get city() {
        return this.node.data.rec.CITY || '...';
    }

    get address() {
        return this.node.data.rec.ADDRESS || '...';
    }

    get e_mail() {
        return this.node.data.rec.E_MAIL || '...';
    }

    get global_id() {
        return this.node.data?.sev?.GLOBAL_ID || '...';
    }

    get id_certificate() {
        return this.node.data.CONTACT_List[0]?.ID_CERTIFICATE || '...';
    }

    showCert() {
        this.CarmaHttp2Service.showCertInfo(this.id_certificate);
    }
}
