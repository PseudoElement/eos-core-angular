import { Component, Output, EventEmitter, OnInit } from '@angular/core';

import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
// import { DUE_DEP_OCCUPATION } from 'app/consts/messages.consts';
@Component({
    selector: 'eos-param-grif',
    templateUrl: 'addGrif.component.html'
})
export class AddGrifComponent implements OnInit {
    @Output() closedModal = new EventEmitter();
    isLoading: boolean = true;
    data = {};
    dataField;
    allField;
    titleHeader = 'Грифы доступа';
    constructor(
        public _apiSrv: UserParamApiSrv,
    ) {
    }

    ngOnInit() {
    const query = {
        SECURITY_CL: ALL_ROWS
    };
     this._apiSrv.getData(query)
     .then(elem => {
        this.allField = elem;
        if (this.data) {
            this.dataField = String(this.data).split(',');
            this.dataField[0] = this.dataField[0].split('|');
            this.dataField[1] = this.dataField[1].split(';');
        } else {
            this.dataField = [[], []];
        }
     });
        this.isLoading = false;
    }

    clikcBox(isn: number, name: string) {
        if (this.elemCheck(isn)) {
            this.dataField[0].splice(this.dataField[0].indexOf(String(isn)), 1);
            this.dataField[1].splice(this.dataField[1].indexOf(name), 1);
        } else {
            this.dataField[0].push(String(isn));
            this.dataField[1].push(name);
        }
    }
    elemCheck(isn: number) {
        let flag = false;
        this.dataField[0].forEach(key => {
            if (Number(key) === isn) {
                flag = true;
            }
        });
        return flag;
    }
    submit() {
        if (this.dataField[0].join('|') === String(this.data).split(',')[0]) {
            this.closedModal.emit();
        } else {
            this.closedModal.emit(this.dataField);
        }
    }
    cancel() {
        this.closedModal.emit();
    }
}
