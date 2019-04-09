import { PipRX } from 'eos-rest';
import { NOMENKL_DICT } from './../../consts/dictionaries/nomenkl.const';
import { Component, OnDestroy, OnInit, OnChanges, NgZone, EventEmitter, Output } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { InputControlService } from 'eos-common/services/input-control.service';
import { EosDataConvertService } from 'eos-dictionaries/services/eos-data-convert.service';
import { EosDictionary } from 'eos-dictionaries/core/eos-dictionary';
import { DictionaryDescriptorService } from 'eos-dictionaries/core/dictionary-descriptor.service';

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

    initByNodeData () {
        const query = { criteries: {'ISN_LCLASSIF': '4057080'} };
        const req = { [NOMENKL_DICT.apiInstance]: query };
        this._apiSrv.read(req).then (data => {
            console.log(data[0]);
            this.data = this.dataSrv.convData(data[0]);// { rec: data };
            const dict = new EosDictionary(NOMENKL_DICT.id, this._descrSrv);
            const descr: any = dict.getEditDescriptor();
            this.inputs = this.dataSrv.getInputs(descr, this.data, false);
            console.log(this.inputs);
            this.form = this._inputCtrlSrv.toFormGroup(this.inputs);
            this.isUpdating = false;
        });

    }
    // private _openCreate(recParams: any) {
        // let data: {};
        // let editDescr: {};
        // let dictionary: EosDictionary;
        // const createWarning = this.dictionary.descriptor.preCreateCheck(this);
        // if (createWarning) {
        //     this._msgSrv.addNewMessage(createWarning);
        //     return;
        // }

        // if (this.dictionary.descriptor.id === 'broadcast-channel') {
        //     this.modalWindow = this._modalSrv.show(CreateNodeBroadcastChannelComponent, {class: 'creating-modal'});
        // } else {
        //     this.modalWindow = this._modalSrv.show(CreateNodeComponent, {class: 'creating-modal'});
        // }
        // dictionary = this._dictSrv.currentDictionary;
        // editDescr = dictionary.getEditDescriptor();
        // data = dictionary.getNewNode({rec: recParams}, this.treeNode);
        // this._dictSrv.clearCurrentNode();

        // this.modalWindow.content.fieldsDescription = editDescr;
        // this.modalWindow.content.dictionaryId = dictionary.id;
        // this.modalWindow.content.isNewRecord = true;
        // this.modalWindow.content.nodeData = data;

        // this.modalWindow.content.onHide.subscribe(() => {
        //     this.modalWindow.hide();
        // });
        // this.modalWindow.content.onOpen.subscribe(() => {
        //     this._openCreate(recParams);
        // });
    // }

}
