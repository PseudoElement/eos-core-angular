
import {Component, OnDestroy, OnInit, Output, EventEmitter/* , ViewChild, ElementRef */} from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { PipRX } from 'eos-rest';



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
    public selectedItem = {};
    constructor(
        private _pipSrv: PipRX,
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
            this.isLoading = false;
            this.allTemplates = answer;
        })
        .catch( er => {
            this.isLoading = false;
        });
    }
    clickForItem(item) {
        this.onHide.emit(item);
        // this.selectedItem = item;
    }
    ngOnDestroy() {

    }

    close() {
        this.onHide.emit(false);
        // this.modalRef.hide();
    }
}
