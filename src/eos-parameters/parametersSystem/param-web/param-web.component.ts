import { Component, Injector } from '@angular/core';
import { WEB_PARAM } from '../shared/consts/web.consts';
import { BaseParamComponent } from '../shared/base-param.component';
import { CarmaHttpService } from 'app/services/carmaHttp.service';

@Component({
    selector: 'eos-param-web',
    templateUrl: 'param-web.component.html'
})
export class ParamWebComponent extends BaseParamComponent {
    constructor(
        private carma: CarmaHttpService,
        injector: Injector
    ) {
        super( injector, WEB_PARAM);
        this.init()
        .then(() => {
            this.carma.init('SERVER="http://localhost:8080"', [
                {
                    Location: 'sslm',
                    Address: '',
                    Name: 'MY'
                },
                {
                    Location: 'sslm',
                    Address: '',
                    Name: 'Root'
                }
            ]);
        })
        .catch(err => {
            if (err.code !== 434) {
                console.log(err);
            }
        });
    }
    btnTest() {
        this.carma.EnumStores('sss', 'localhost').subscribe(list => console.log(list));
        // this.carma.EnumCertificates('sslm', '', 'CA').subscribe(list => console.dir(list));
    }
}
