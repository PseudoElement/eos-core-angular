import { Input, Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, /* AsyncValidatorFn, AbstractControl, ValidationErrors */ } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { REF_FILE, PipRX, DOCGROUP_CL } from 'eos-rest';
import { CONFIRM_REPLACE_SAME_FILE } from '../../../app/consts/confirms.const';
import { ConfirmWindowService } from '../../../eos-common/confirm-window/confirm-window.service';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'eos-templates-card',
    templateUrl: './templates-card.component.html',
    styleUrls: ['./templates-card.component.scss'],
})
export class TemplatesCardComponent implements OnInit, OnDestroy {
    @Input() form: FormGroup;
    @Input() inputs: any;
    @Input() data: any;
    @Input() editMode: boolean;
    @Input() isNewRecord: boolean;
    @Input() dutysList: string[];
    @Input() fullNamesList: string[];
    public upload = false;
    public newFile: REF_FILE;
    public showDocGrList: boolean;
    public prevValues: any[];
    public showDoc: boolean;
    public docGroupList: DOCGROUP_CL[] = [];
    public flagSort: boolean = false;
    @ViewChild('inp') inp;
    @ViewChild('dom') dom: ElementRef<any>;
    protected formChanges$: Subscription;
    // private originName: string;
    private frDatas;
    // private _ngUnsubscribe: Subject<any> = new Subject();
    get showClass() {
        return this.showDoc ? 'eos-icon-open-folder-blue' : 'eos-icon-close-folder-blue';
    }
    get classSort() {
        return this.flagSort ? 'eos-icon-arrow-blue-top' : 'eos-icon-arrow-blue-bottom';
    }
    constructor(
        protected _dictSrv: EosDictService,
        private _ref: ChangeDetectorRef,
        private _pipRx: PipRX,
        private _confirmSrv: ConfirmWindowService,
        //    private _mess: EosMessageService,
    ) {
        this.showDoc = false;
    }
    ngOnInit() {
        this.initFiles();
        this.getGocGroupForTemplates();
    }
    getCardTitle(): any {
        return null;
    }

    addFileDocTemplates(data, $event) {
        this.data.rec.CHANGED_FILE = true; // флаг для загрузки одноименных файлов
        this._dictSrv.currentDictionary.descriptor['dataNewFile'] = data;
        this.newFile = data;
        this.setNameFile(this.newFile.DESCRIPTION, $event);
    }
    sameFileCheck() {
        const frame = document.getElementsByTagName('iframe')[0];
        const frameDoc = frame.contentWindow.document;
        const fileDiv = frameDoc.getElementById('UpFile');
        const replace = Object.assign({}, CONFIRM_REPLACE_SAME_FILE);

        try {
            frame.contentWindow['fire'].apply(null, [false, [], false, false, false, true, '',
                -10000, 701, 1, 1]);
        } catch (e) {
            document.location.assign('../login.aspx');
        }

        fileDiv.addEventListener('input', ($event) => {
            this.upload = true;
            this._ref.detectChanges();
            this.frDatas.promise.always((data: REF_FILE[]) => {
                try {
                    if (data.length) {
                        if (this.form.controls['rec.NAME_TEMPLATE'].value) {
                            replace.body = `Заменить "${this.form.controls['rec.NAME_TEMPLATE'].value}" на "${data[0].DESCRIPTION}"? `;
                            setTimeout(() => {
                                this.dom.nativeElement.lastElementChild.click();
                            }, 0);
                            this._confirmSrv.confirm2(replace).then(ans => {
                                if (ans && ans.result === 2) {
                                    this.addFileDocTemplates(data[0], $event);
                                }
                            });

                        } else {
                            this.addFileDocTemplates(data[0], $event);
                        }
                    } else {
                        delete this._dictSrv.currentDictionary.descriptor['dataNewFile'];
                        this.newFile = null;
                    }
                    this.frDatas.promise = new window['$']['Deferred']();
                    this.upload = false;
                    this._ref.detectChanges();
                } catch (e) {
                    this._dictSrv.errHandler(e);
                }

            });
        });
    }

    setNameFile(name, $event?) {
        this.form.controls['rec.NAME_TEMPLATE'].patchValue(name);
        if ($event) {
            // после выбора файла и записи в TEMPLATE_NAME не меняется туллтип (например если значение не уникальное)
            try {
                // this.inp.inpstring.onInput($event);
                document.getElementById('rec.NAME_TEMPLATE').focus();
            } catch (e) {
                this._dictSrv.errHandler(e);
            }
        }
    }
    deleteFile() {
        this.frDatas.promise = new window['$']['Deferred']();
        this._dictSrv.currentDictionary.descriptor.deleteTempRc();
        this.upload = false;
        this.newFile = null;
        this.setNameFile(null, { stopPropagation: () => { } });
        this._ref.detectChanges();
    }
    getGocGroupForTemplates() {
        this.showDocGrList = false;
        if (this.inputs && this.inputs['rec.CATEGORY'].value === 'Файлы документов') {
            const crit1 = this._pipRx.read({
                DOCGROUP_CL: {
                    criteries: {
                        'DOC_DEFAULT_VALUE.DEFAULT_ID': 'FILE',
                        'DOC_DEFAULT_VALUE.VALUE': `${this.data['rec']['ISN_TEMPLATE']}`
                    }
                }
            });
            const crit2 = this._pipRx.read({
                DOCGROUP_CL: {
                    criteries: {
                        'PRJ_DEFAULT_VALUE.DEFAULT_ID': 'FILE',
                        'PRJ_DEFAULT_VALUE.VALUE': `${this.data['rec']['ISN_TEMPLATE']}`
                    }
                }
            });
            Promise.all([crit1, crit2]).then((data: Array<any>) => {
                const d = [...data[0], ...data[1]];
                if (d.length) {
                    const map = new Map();
                    d.forEach((f: DOCGROUP_CL) => {
                        map.set(f.ISN_NODE, f);
                    });
                    this.showDocGrList = true;
                    this.docGroupList = Array.from(map).map(v => v[1]);
                    this.sortDoc(false);
                }
                return;
            }).catch(error => {
                this.showDocGrList = false;
                this._dictSrv.errHandler(error);
            });
        }
    }
    ngOnDestroy() {
        if (this._dictSrv.currentDictionary && this._dictSrv.currentDictionary.descriptor['dataNewFile']) {
            this._dictSrv.currentDictionary.descriptor.deleteTempRc();
        }
        this._ref.detach();
    }
    public sortDoc(flag) {
        this.docGroupList = this.docGroupList.sort((a: DOCGROUP_CL, b: DOCGROUP_CL) => {
            return (this.flagSort ? 1 : -1) * a.CLASSIF_NAME.localeCompare(b.CLASSIF_NAME);
        });
    }
    public confirmSave(): Promise<boolean> {
        return Promise.resolve(true);
    }
    private initFiles() {
        window['_metadata'].merge({
            TEMP_RC: {
                pk: 'ISN_TEMP_RC',
                properties: {
                    EXPIRATION_DATE: 'd',
                    INS_DATE: 'd',
                    INS_WHO: 'i',
                    ISN_TEMP_RC: 'i',
                    OPERATION_KEY: 's',
                    WAPI_SESSION_SID: 's',
                },
                readonly: [
                    'INS_WHO',
                    'INS_DATE'
                ],
                relations: [
                    { name: 'REF_FILE_List', __type: 'REF_FILE', sf: 'ISN_TEMP_RC', tf: 'ISN_REF_DOC' }
                ]
            },
        });
        this.frDatas = window['Uploader'].Current();
        this.frDatas.promise = new window['$']['Deferred']();
        this.frDatas.getF();
        const ds = new window['D']['DataSource']();
        ds.pipe = new window['D']['Pipe']('../OData.svc/');
        window['ds'] = ds;
    }

}
