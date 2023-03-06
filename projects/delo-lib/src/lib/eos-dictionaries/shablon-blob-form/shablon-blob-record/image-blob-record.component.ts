import { Component, Input, OnChanges, Output, EventEmitter, ViewChild } from '@angular/core';
import { IImage } from '../../../eos-dictionaries/interfaces/image.interface';
import { PipRX } from '../../../eos-rest';
import { EosDictService } from '../../../eos-dictionaries/services/eos-dict.service';
import { EosMessageService } from '../../../eos-common/services/eos-message.service';
import { UPLOAD_IMG_FALLED } from '../../../eos-dictionaries/consts/messages.consts';
import { PhotoUploaderComponent } from '../../../eos-common/photo-uploader/photo-uploader.component';


@Component({
    selector: 'eos-image-blob-record',
    templateUrl: './image-blob-record.component.html',
    styleUrls: ['./image-blob-record.component.scss'],
})

export class ImageBlobRecordComponent implements OnChanges {

    @Input() isnBlob: number;
    @Input() editMode: boolean;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild ('imgUploader') imgUploader: PhotoUploaderComponent;

    isUpdating: boolean;

    blobImage: IImage;
    imageUrl: string;

    constructor(
        private _apiSrv: PipRX,
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
    ) {
        this.isUpdating = true;
    }

    ngOnChanges() {
        this.isUpdating = true;
        this.blobImage = null;

        const pBlobImg = (this.isnBlob) ? this._apiSrv.read({ DELO_BLOB: this.isnBlob }) : Promise.resolve([]);

        Promise.resolve(pBlobImg).then ( (imgs) => {
            this.blobImage = (imgs[0]) ? <IImage>{
                data: imgs[0]['CONTENTS'],
                extension: imgs[0]['EXTENSION'],
                url: `url(data:image/${imgs[0]['EXTENSION']};base64,${imgs[0]['CONTENTS']})`,
            } : null;

            this.imageUrl = this.blobImage.url;
            this.isUpdating = false;
        }).catch ( (err) => {
            this.isUpdating = false;
        });

    }

    onUploadClick () {
        this.imgUploader.addFileDialogStart();
    }

    onClearClick () {
        this.removePhoto();
    }

    onSaveClick() {
        const blob = this.dataURItoBlob(this.blobImage.data, this.blobImage.extension);
        const FileSaver = require('file-saver');
        FileSaver.saveAs(blob, 'stamp_' + this.isnBlob + '.' + this.blobImage.extension);
    }

    dataURItoBlob(dataURI, type) {
        const bytes = window.atob(dataURI);
        const arrayBuffer = new ArrayBuffer(bytes.length);
        const uint8_tArray = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bytes.length; i++) {
          uint8_tArray[i] = bytes.charCodeAt(i);
        }
        const blob = new Blob([uint8_tArray], { type: 'image/' + type });
        return blob;
    }

    newImage(img: IImage) {
        this.imageUrl = img.url;
        this._dictSrv.uploadImg(img)
            .then((photoId) => {
                if (photoId) {
                    this.onChange.emit(photoId['ID']);
                } else {
                    this.imageUrl = null;
                    this._msgSrv.addNewMessage(UPLOAD_IMG_FALLED);
                }
            });
    }

    removePhoto() {
        this.imageUrl = null;
        this.blobImage = null;
        this.onChange.emit(null);
    }
}
