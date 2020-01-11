import {Component, Output, EventEmitter } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';


@Component({
    selector: 'eos-stamp-blob-form',
    templateUrl: 'stamp-blob-form.component.html',
})

export class StampBlobFormComponent {
    @Output() onClose: EventEmitter<any> = new EventEmitter<any>();
    @Output() onChoose: EventEmitter<any> = new EventEmitter<any>();

    isUpdating = true;
    isnBlob: number;

    constructor(
        public bsModalRef: BsModalRef,
    ) {
        this.isUpdating = false;
    }

    init(isn: any): any {
        this.isnBlob = isn;
    }

    public getTitleLabel(): string {
        return 'Угловой штамп';
    }

    public hideModal(): void {
        this.onClose.emit(this.isnBlob);
        this.bsModalRef.hide();
    }

    public onImageUpload (isn) {
        this.isnBlob = isn;
    }
    confirm() {
        this.hideModal();
    }

    closeWithoutSave () {
        this.bsModalRef.hide();
    }

}
