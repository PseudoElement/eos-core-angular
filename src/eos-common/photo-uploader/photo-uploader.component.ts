import { Component, EventEmitter, Output, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { EosMessageService } from '../services/eos-message.service';
import { FILE_IS_NOT_IMAGE, FILE_IS_BIG, WARN_WRONG_IMAGE_TYPE } from '../../eos-dictionaries/consts/messages.consts';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IImage } from '../../eos-dictionaries/interfaces/image.interface';

@Component({
    selector: 'eos-photo-uploader',
    templateUrl: 'photo-uploader.component.html',
})
export class PhotoUploaderComponent implements OnInit {
    static genid = 0;
    @Input() disableEdit = false;
    @Input() buttons = true;
    @Input()  maxFileSize = 102400;
    @Input()  maxFileSizeText = '100Kb';
    @Output() endUploading: EventEmitter<IImage> = new EventEmitter<IImage>();
    @Output() onBeforeModal: EventEmitter<any> = new EventEmitter<any>();
    @Output() onAfterModal: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('fileInput') inputEl: ElementRef;
    // contactUrl = 'http://localhost/Eos.Delo.OData/Services/DELO_BLOB.asmx/Upload';
    // uploading = false;
    // multiple = false;

    imageSrc = '';

    nativeInputEl: HTMLInputElement;
    file: File;
    multiple = false;

    componentId: string;

    @ViewChild('confirmModal') private confirmModalRef: ModalDirective;

    constructor(private _msgSrv: EosMessageService) {
        this.componentId = 'file' + PhotoUploaderComponent.genid++;
    }

    ngOnInit() {
        this.nativeInputEl = this.inputEl.nativeElement;
    }

    chooseFile(e) {
        const file: File = e.target.files[0];
        if (file) {
            if (file.type.indexOf('image') === -1) {
                this._msgSrv.addNewMessage(FILE_IS_NOT_IMAGE);
                return;
            }

            if (file.type.indexOf('png') === -1 && file.type.indexOf('jpeg') === -1) {
                this._msgSrv.addNewMessage(WARN_WRONG_IMAGE_TYPE);
                return;
            }

            if (file.size > this.maxFileSize) {
                const mess = Object.assign({}, FILE_IS_BIG);
                mess.msg = mess.msg.replace('{maxFileSize}', this.maxFileSizeText);
                this._msgSrv.addNewMessage(mess);
                return;
            }

            const reader = new FileReader();

            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsDataURL(file);

            this.onBeforeModal.emit(null);
            this.confirmModalRef.show();
        }
    }

    upload() {
        this.confirmModalRef.hide();
        const fileStr = String(this.file);
        const pos = fileStr.indexOf(',') + 1;
        let data = fileStr.substr(pos);
        data = data.replace(/\s/g, '+');
        // расширение файла
        const pos2 = fileStr.indexOf('/');
        const pos3 = fileStr.indexOf(';');
        this.endUploading.emit({
            data: data,
            extension: fileStr.substring(pos2 + 1, pos3).toUpperCase(),
            url: `url(${this.file})`,
        });

        this.nativeInputEl.value = null;
        this.onAfterModal.emit(false);
    }

    cancel() {
        this.confirmModalRef.hide();
        this.nativeInputEl.value = null;
        this.onAfterModal.emit(false);
    }

    public addFileDialogStart() {
        document.getElementById(this.componentId).click();
    }

    private _handleReaderLoaded(e) {
        const reader = e.target;
        this.file = reader.result;
        this.imageSrc = 'url(' + reader.result + ')';
    }
}
