import { Component, Injector } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { CarmaHttpService, Istore } from 'app/services/carmaHttp.service';

@Component({
    selector: 'eos-param-web',
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent extends BaseParamComponent {
    carmaStores: Istore[] = [];
    listCertStores: string = ''; // Пока не используется
    constructor(
        private carmaService: CarmaHttpService,
        injector: Injector
    ) {
        super( injector, WEB_PARAM);
        this.init()
        .then(() => {
            const listStore = this.form.controls['rec.CERT_APPSRV_STORES'].value.split('\t');
            this.createCarmaStores(listStore);
            this.carmaService.init(null, this.carmaStores);
            return listStore;
        })
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
    btnTest() {
        // this.carma.EnumStores('sss', 'localhost').subscribe(list => console.log(list));
        // this.carma.EnumCertificates('sslm', '', 'CA').subscribe(list => console.dir(list));
    }

    createCarmaStores(listStore: string[]) {
        this.carmaStores = [];
        listStore.forEach((str: string) => {
            const arr = str.split(':');
            this.carmaStores.push({
                Location: arr[0],
                Address: '',
                Name: arr[1]
            });
        });
    }
}
