import { PipRX } from 'eos-rest';
import { Component, OnDestroy, OnInit, OnChanges, NgZone, EventEmitter, Output } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { EosDictionary } from 'eos-dictionaries/core/eos-dictionary';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';

// Реквизит "Срок исполнения" может быть заполнен только в одном месте

@Component({
    selector: 'eos-record-view',
    templateUrl: 'record-view.component.html',
})

export class RecordViewComponent implements OnDestroy, OnInit, OnChanges {
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    nodes: any[];
    // dataController: AdvCardRKDataCtrl;
    form: FormGroup;
    inputs: any[];
    data: any;
    dictid: string;

    private subscriptions: Subscription[];

    constructor(
        public dataSrv: EosDataConvertService,
        public bsModalRef: BsModalRef,
        public zone: NgZone,
        private _inputCtrlSrv: InputControlService,
        private _descrSrv: DictionaryDescriptorService,
        private _apiSrv: PipRX,
    ) {
        this.isUpdating = true;
        this.subscriptions = [];
    }

    ngOnChanges() {
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscr) => {
            if (subscr) {
                subscr.unsubscribe();
            }
        });
        this.subscriptions = [];
    }

    cancel(): void {
        this.bsModalRef.hide();
    }

    public hideModal(): void {
        this.bsModalRef.hide();
    }

    initByNodeData (query: any, dictD: IDictionaryDescriptor) {
        this.dictid = dictD.id;
        const req = { [dictD.apiInstance]: query };
        this._apiSrv.read(req).then (data => {
            this.data = this.dataSrv.convData(data[0]);
            const dict = new EosDictionary(dictD.id, this._descrSrv);
            const descr: any = dict.getEditDescriptor();
            this.inputs = this.dataSrv.getInputs(descr, this.data, false);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            this.isUpdating = false;
        });

    }
}
