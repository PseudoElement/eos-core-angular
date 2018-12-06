import {Component, Injector, OnChanges, OnInit} from '@angular/core';
import { BaseCardEditComponent } from './base-card-edit.component';
import {PipRX} from '../../eos-rest';

@Component({
    selector: 'eos-nomenkl-card',
    templateUrl: 'nomenkl-card.component.html',
})
export class NomenklCardComponent extends BaseCardEditComponent implements OnChanges, OnInit {

    constructor(
        injector: Injector,
        private _apiSrv: PipRX,
    ) {
        super(injector);
    }
    ngOnInit(): void {
        const i = this.inputs['rec.SECURITY'];
        i.options = [];
        const req = {'SECURITY_CL': []};
        this._apiSrv
            .read(req)
            .then((rdata: any[]) => {
                rdata.forEach((d) => {
                    i.options.push({ title: d['CLASSIF_NAME'], value: d['CLASSIF_NAME']});
                });
            });
    }

    ngOnChanges() {
    }
}
