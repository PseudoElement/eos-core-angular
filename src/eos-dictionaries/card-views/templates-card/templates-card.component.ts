import { Input, Component, OnDestroy, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, /* AsyncValidatorFn, AbstractControl, ValidationErrors */ } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EosDictService } from 'eos-dictionaries/services/eos-dict.service';
import { REF_FILE, /* PipRX */ } from 'eos-rest';
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
    upload = false;
    newFile: REF_FILE;
    frDatas;
    public prevValues: any[];
    @ViewChild('inp') inp;
    @ViewChild('dom') dom: ElementRef<any>;
    protected formChanges$: Subscription;
   // private originName: string;
    // private _ngUnsubscribe: Subject<any> = new Subject();
    constructor(
        protected _dictSrv: EosDictService,
        private _ref: ChangeDetectorRef,
       /*  private _pipRx: PipRX, */
        //    private _mess: EosMessageService,
    ) {
    }
    getCardTitle(): any {
        return null;
    }
    addFileDocTemplates() {
        const frame = document.getElementsByTagName('iframe')[0];
        const frameDoc = frame.contentWindow.document;
        const fileDiv = frameDoc.getElementById('UpFile');
        frame.contentWindow['fire'].apply(null, [false, [], false, false, false, true, '',
            -10000, 701, 1, 1]);
        fileDiv.addEventListener('change', ($event) => {
            this.upload = true;
            this._ref.detectChanges();
            this.frDatas.promise.always((data: REF_FILE[]) => {
                if (data.length) {
                    this._dictSrv.currentDictionary.descriptor['dataNewFile'] = data[0];
                    this.newFile = data[0];
                    this.setNameFile(this.newFile.DESCRIPTION, $event);
                } else {
                    delete this._dictSrv.currentDictionary.descriptor['dataNewFile'];
                    this.newFile = null;
                }
                this.frDatas.promise = new window['$']['Deferred']();
                this.upload = false;

                this._ref.detectChanges();
            });
        });
    }
    setNameFile(name, $event?) {
        this.form.controls['rec.NAME_TEMPLATE'].patchValue(name);
        if ($event) {
            // после выбора файла и записи в TEMPLATE_NAME не меняется туллтип (например если значение не уникальное)
            this.inp.inpstring.onInput($event);
            setTimeout(() => {
                this.dom.nativeElement.lastElementChild.click();
            }, 500);
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
    ngOnInit() {
        this.initFiles();
    }
    ngOnDestroy() {
        if (this._dictSrv.currentDictionary.descriptor['dataNewFile']) {
            this._dictSrv.currentDictionary.descriptor.deleteTempRc();
        }
        this._ref.detach();
    }
    initFiles() {
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
    updateForm(data?) {
      //  this.form.controls['rec.NAME_TEMPLATE'].setAsyncValidators(this.asyncNameValidate());
    }

    // asyncNameValidate(): AsyncValidatorFn {
    //     return (control: AbstractControl): Promise<ValidationErrors | null> => {
    //         return this.getNameTemplate(control.value).then(
    //             name => {
    //               if   (name && name.length > 0 && this.inputs['rec.NAME_TEMPLATE'].value !== control.value) {
    //                  return   { 'isUnique': true };
    //                 } else {
    //                       return null;
    //                 }
    //             }
    //         );
    //     };
    // }

    // getNameTemplate(value) {
    //     return this._pipRx.read({
    //         DOC_TEMPLATES: {
    //             criteries: {
    //                 NAME_TEMPLATE: `${value}`
    //             }
    //         }
    //     });
    // }

}
