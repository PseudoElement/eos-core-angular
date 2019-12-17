import { Component, OnInit, OnChanges } from '@angular/core';

import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { DELO_BLOB } from '../../eos-rest/interfaces/structures';
import { IBaseInput } from 'eos-common/interfaces';
import { FormGroup } from '@angular/forms';
import { InputControlService } from 'eos-common/services/input-control.service';
import { InputBase } from 'eos-common/core/inputs/input-base';
import { FA_ICONS } from './fa-icons.const';
import { WaitClassifService } from 'app/services/waitClassif.service';
import { NADZORDICTIONARIES } from 'eos-dictionaries/consts/dictionaries/nadzor.consts';
import { ConfirmWindowService } from 'eos-common/confirm-window/confirm-window.service';
import { IConfirmWindow2 } from 'eos-common/confirm-window/confirm-window2.component';

const TEST_INPUTS = <IBaseInput[]>[{
//     controlType: 'string',
//     key: 'data.string',
//     label: 'string',
//     required: true,
//     pattern: /\S+/,
//     forNode: false,
//     value: 'no data!!!',
// }, {
//     controlType: 'text',
//     key: 'data.text',
//     label: 'TEXT',
//     required: true,
//     height: '100'
// }, {
//     controlType: 'checkbox',
//     key: 'data.checkbox',
//     label: 'check me',
//     // value: true
// }, {
//     controlType: 'select',
//     key: 'data.select',
//     label: 'select value',
//     disabled: false,
//     required: false,
//     options: [{
//         value: 1,
//         title: 'one'
//     }, {
//         value: 2,
//         title: 'two'
//     }, {
//         value: 3,
//         title: 'three'
//     }]
// }, {
    controlType: 'select2',
    key: 'data.select2',
    label: 'select2 value',
    disabled: false,
    required: false,
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
// }, {
//     controlType: 'date',
//     key: 'data.date',
//     value: new Date(),
//     label: 'date'
// }, {
//     controlType: 'buttons',
//     key: 'data.switch',
//     label: 'buttons',
//     options: [{
//         value: 1,
//         title: 'one',
//     }, {
//         value: 2,
//         title: 'two'
//     }, {
//         value: 3,
//         title: 'three'
//     }],
//     value: 1
}];

@Component({
    selector: 'eos-test-page',
    templateUrl: './test-page.component.html',
    styleUrls: ['./test-page.component.scss']
})
export class TestPageComponent implements OnInit, OnChanges {

    defaultImage = null;

    date: Date = new Date();

    form: FormGroup;
    inputs: InputBase<any>[];
    data = {};

    faIcons = FA_ICONS;

    testMessages = ['danger', 'warning', 'success', 'info'];

    constructor(
        private _messageService: EosMessageService,
        private pip: PipRX,
        private inputCtrlSrv: InputControlService,
        private _waitClassifSrv: WaitClassifService,
        private _confirmSrv: ConfirmWindowService,
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
        [
            'Линейный список — разновидность структуры данных.',
            'Формулярный список (формуляр) в Российской империи — послужной список…',
            'Кондуитный список в Российской империи — книга с отметками о поведении учеников в школе, списки офицеров со сведениями о поведении…',
            'Послужной список',
            'Белый список — список, в который заносятся желательные элементы',
            'Чёрный список — список, в который заносятся нежелательные элементы',
            'Серый список',
            'Избирательный список (список избирателей) — документ, определяющий круг лиц, имеющих право принимать участие в голосовании в данном избирательном округе (участке).',
            'Список кандидатов на выборах — список лиц, выдвинутых для избрания на какую-либо должность.',
            'Список доступа — список объектов, которым разрешен доступ к информационному ресурсу.',
            'Список с векселя — воспроизведение существенных частей вексельного текста, отличающих данный вексель от других.',
            'Список рассылки (список почтовой рассылки, лист рассылки) в компьютерных сетях — механизм, который позволяет разослать почтовое сообщение некоторой группе подписчиков.',
            'Трудовой список в СССР в 1926—1938 — документ, в который заносились сведения о прохождении службы в государственных учреждениях, кооперативных и общественных организациях.',
            'Список архивных фондов — учетный документ, содержащий перечень официальных наименований хранящихся, выбывших и поступающих архивных фондов в порядке возрастания присвоенных им номеров.',
            'Библиографический список — библиографическое пособие простой структуры без вспомогательного аппарата.',
            'Список стратегических товаров — перечень товаров, экспорт которых из страны запрещается, ограничивается или контролируется с целью предотвращения ущерба её национальной безопасности.',
            'Командный список',
            'Список предметных рубрик — совокупность предметных рубрик и связанного с ними ссылочно-справочного аппарата предметного каталога или указателя.',
            'Партийные списки',
            'Соединение списков — правило избирательной системы, согласно которому голоса, поданные за списки блокирующихся партий, должны рассматриваться как поданные за их общий список.',
            'Обработка списков — программирование процессов изменения структур данных, состоящих из однородных позиций, связанных указателями.',
            'Списки страхователей — поручение лиц, изъявивших желание заключить договор группового страхования.',
            'Боярские списки в Российском государстве со второй половины XVI века — именные перечни по чинам членов Государева двора с пометами об их служебных назначениях, пожалованиях, ',
            'Статейные списки — вид официальной делопроизводственной документации в России XV — начала XVIII вв., составлявшейся по статьям или отдельным вопросам',
            'Титульные списки в СССР — поимённый перечень строящихся и реконструируемых (расширяемых) объектов, включаемых в план капитальных вложений.',
            'Список Сводеша — инструмент для оценки степени родства между различными языками по такому признаку, как схожесть наиболее устойчивого базового словаря.',
        ].forEach ( (v, i) => {
            TEST_INPUTS[3].options.push({value: 100 + i, title: v} );
        });



    }

    addNewMessage(type: 'danger' | 'warning' | 'info' | 'success') {
        this._messageService.addNewMessage({
            type: type,
            title: type.toUpperCase(),
            msg: 'Южно-эфиопский грач увёл мышь за хобот на съезд ящериц.',
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

        let dddd: string = evt.data;
        // dddd = dddd.replace(/\+/g, '%2B');
        // dddd = dddd.replace(/\//g, '_');
//         string converted = base64String.Replace('-', '+');
// converted = converted.Replace('_', '/');
        dddd = encodeURIComponent(dddd);
        const content = { isn_target_blob: delo_blob.ISN_BLOB, data: dddd };
        PipRX.invokeSop(chl, 'DELO_BLOB_SetDataContent', content, 'POST', false);


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

        const fff = NADZORDICTIONARIES;
        fff.forEach(n => {
            console.log(n.apiInstance + ' ' + n.title);
        });


        const siteUrl = '../';
        const pageUrl = siteUrl + 'Pages/Classif/ChooseClassif.aspx?';
        const params = 'Classif=DEPARTMENT&value_id=__ClassifIds&skip_deleted=True&select_nodes=True&select_leaf=True&return_due=True';
        window.open(pageUrl + params, 'clhoose', 'width=1050,height=800,resizable=1,status=1,top=20,left=20');
        window['endPopup'] = function (result) {
            console.warn(result);
        };
    }
    chooseUserLists() {
        this._waitClassifSrv.openClassif({classif: 'TECH_LISTS'})
        .then(result => {
            console.log('result: ', result);
        })
        .catch(err => {
            console.log('window closed');
        });
    }

    testClick1() {

        const testc: IConfirmWindow2 = {
            title: 'asdgdsgasgsagasdg',
            body: 'dshsdfhdfghfdgjfdgj fdg jfdgj ',
            buttons: [
                {title: 'Ok', result: 1, },
                {title: 'not', result: 2, },
                {title: 'cancel', result: 3, },
            ],
        };
        // this.updating = true;
        this._confirmSrv
            .confirm2(testc)
            .then((confirmed) => {
                console.log(confirmed);
                if (confirmed) {
                    // return this._deskSrv.removeDesk(desk);
                }
            })
            .then(() => {
                // this.updating = false;
            });

        // const modalWindow = this._modalSrv.show(RecordViewComponent, {class: 'eos-record-view modal-lg'});
        // modalWindow.content.initByNodeData(null);

        // if (modalWindow) {
        //     const subscription = modalWindow.content.onChoose.subscribe(() => {
        //         subscription.unsubscribe();
        //     });
        // }

    }

}
