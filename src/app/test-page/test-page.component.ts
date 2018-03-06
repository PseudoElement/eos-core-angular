import { Component, OnInit, OnChanges } from '@angular/core';

import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { DELO_BLOB } from '../../eos-rest/interfaces/structures';
import { IBaseInput } from 'eos-common/interfaces';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';

const TEST_INPUTS = <IBaseInput[]>[{
    controlType: 'string',
    key: 'data.string',
    label: 'string',
    required: true,
    invalidMessage: 'required',
    pattern: /\S+/,
    isUnic: false,
    unicInDict: false,
    forNode: false,
    value: 'no data',
}, {
    controlType: 'text',
    key: 'data.text',
    label: 'TEXT',
    required: false,
    invalidMessage: 'blablabla',
    height: '100'
}, {
    controlType: 'checkbox',
    key: 'data.checkbox',
    label: 'olololo',
    value: true
}, {
    controlType: 'select',
    key: 'data.select',
    label: 'select',
    required: true,
    options: [{
        value: 1,
        title: 'one'
    }, {
        value: 2,
        title: 'two'
    }, {
        value: 3,
        title: 'three'
    }]
}, {
    controlType: 'date',
    key: 'data.date',
    value: '01.01.2003',
    invalidMessage: 'Некорректная дата',
    label: 'date'
}];

@Component({
    selector: 'eos-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit, OnChanges {

    defaultImage = 'url(../assets/images/no-user.png)';

    date: Date = new Date();

    form: FormGroup;
    inputs: InputBase<any>[];
    data = {};

    constructor(
        private _messageService: EosMessageService,
        private pip: PipRX,
        private inputCtrlSrv: InputControlService
    ) {
        this.inputs = this.inputCtrlSrv.generateInputs(TEST_INPUTS);
        this.form = this.inputCtrlSrv.toFormGroup(this.inputs, false);
        this.form.valueChanges.subscribe((data) => {
            this.data = data;
        });
    }

    ngOnChanges() {
    }

    ngOnInit() {
    }

    addNewMessage() {
        this._messageService.addNewMessage({
            type: 'danger',
            title: 'Ошибка!',
            msg: 'что-то пошло не так',
            dismissOnTimeout: 5000,
        });
    }

    newImage(evt) {
        this.defaultImage = 'url(' + evt + ')';
        // send it on server
        let s = this.defaultImage;
        const pos = s.indexOf(',') + 1;
        // убрать последнюю скобку и преамбулу
        s = s.substr(pos, s.length - pos - 1);
        s = s.replace(/\s/g, '+');
        // TODO: из преамбулы получить правильное расширение файла

        const delo_blob = this.pip.entityHelper.prepareAdded<DELO_BLOB>({
            ISN_BLOB: this.pip.sequenceMap.GetTempISN(),
            EXTENSION: 'PNG' // TODO: правиольное расширение файла указать сюда
        }, 'DELO_BLOB');

        const chl = this.pip.changeList([delo_blob]);

        const content = { isn_target_blob: delo_blob.ISN_BLOB, data: s };
        PipRX.invokeSop(chl, 'DELO_BLOB_SetDataContent', content);


        this.pip.batch(chl, '').then(() => {
            // alert(this.pip.sequenceMap.GetFixed(delo_blob.ISN_BLOB));
            this._messageService.addNewMessage({
                type: 'danger',
                title: 'Ошибка сохранения фото на сервере:',
                msg: 'сервер ответил: ' + this.pip.sequenceMap.GetFixed(delo_blob.ISN_BLOB),
            });
        });
    }

    change(evt) {
        // console.warn('evt', evt);
        this.date = evt;
    }

    chooseCL(_evt) {
        const siteUrl = 'http://localhost/v175.WebSite.Publish/';
        const pageUrl = siteUrl + 'Pages/Classif/ChooseClassif.aspx?';
        const params = 'Classif=DEPARTMENT&value_id=__ClassifIds&skip_deleted=True&select_nodes=True&select_leaf=True&return_due=True';
        window.open(pageUrl + params, 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');
        window['endPopup'] = function (result) {
            console.warn(result);
        };
    }
}
