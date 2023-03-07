
import {Component, OnDestroy, OnInit, Output, EventEmitter/* , ViewChild, ElementRef */} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { PipRX } from '../../eos-rest';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { CONFIRM_PRINT_INCLUDE } from '../../app/consts/confirms.const';



@Component({
    selector: 'eos-print-template',
    styleUrls: ['./print-template.component.scss'],
    templateUrl: 'print-template.component.html',
})

export class PrintTemplateComponent implements OnDestroy, OnInit {
    @Output() onHide: EventEmitter<any> = new EventEmitter<any>();

    public modalRef: BsModalRef;
    public allTemplates: any[] = [];
    public isLoading: boolean = true;
    public checkIncludeDir: boolean = false;
    public selectedItem = {};
    public printIncludeDir: boolean = false;
    public messageAlert: boolean = false;
    constructor(
        private _pipSrv: PipRX,
        private _confirmSrv: ConfirmWindowService,
    ) {

    }
    ngOnInit() {
        this.isLoading = true;
        this._pipSrv.read({DOC_TEMPLATES: {
                criteries: {
                    CATEGORY: 'Печать номенклатуры дел' // isnull(выборка по null), isnotnull(не null)
                },
            }
        })
        .then(answer => {
            this.allTemplates = answer;
            this.isLoading = false;
        })
        .catch( er => {
            this.isLoading = false;
        });
    }
    clickForItem(item) {
        if (this.checkIncludeDir) {
            this.messageAlert = true;
            this._confirmSrv.confirm(CONFIRM_PRINT_INCLUDE).then(d => {
                this.onHide.emit({'item': item, 'printIncludeDir': d});
            });
        } else {
            this.onHide.emit({'item': item, 'printIncludeDir': false});
        }
        // this.selectedItem = item;
    }
    ngOnDestroy() {

    }

    close() {
        this.onHide.emit(false);
        // this.modalRef.hide();
    }
}
