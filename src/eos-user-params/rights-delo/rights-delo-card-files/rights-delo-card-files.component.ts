import { Component, Injector, OnInit } from '@angular/core';
import { UserParamApiSrv } from 'eos-user-params/shared/services/user-params-api.service';
import { BaseRightsDeloSrv } from '../shared-rights-delo/services/base-rights-delo.service';
import { CARD_FILES_USER } from '../shared-rights-delo/consts/card-files.consts';

@Component({
    selector: 'eos-rights-delo-card-files',
    templateUrl: 'rights-delo-card-files.component.html'
})

export class RightsDeloCardFilesComponent extends BaseRightsDeloSrv implements OnInit {
    isLoading = false;
    fieldKeysforCardFiles = [];
    cardFilesUser = {
        id: 'card-files',
        title: 'Картотеки',
        apiInstance: 'DEPARTMENT',
        fields: []
    };
    currentSelectedWord;
    prepInputsAttach;

    private quaryDepartment = {
        DEPARTMENT: {
            criteries: {
                CARD_FLAG: '1'
            }
        }
    };
    constructor( injector: Injector, private servApi: UserParamApiSrv ) {
        super(injector, CARD_FILES_USER);
    }
    ngOnInit() {
        this.isLoading = true;
        this.servApi.getData(this.quaryDepartment)
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                 this.fieldKeysforCardFiles.push([data[i]['DUE'], data[i]['CARD_NAME'], false, false]);
                 CARD_FILES_USER.fields.push({
                    key: data[i]['DUE'],
                    type: 'boolean',
                    title: data[i]['CARD_NAME']
                 });
            }
            this.init();
            this.isLoading = false;
        });
    }
    choosingMainCheckbox() {
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            if (this.fieldKeysforCardFiles[i][2] === true) {
                this.fieldKeysforCardFiles[i][3] = true;
            } else {
                this.fieldKeysforCardFiles[i][3] = false;
            }
        }
    }
    selectedNode(word) {
        this.isMarkNode = true;
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            if (this.fieldKeysforCardFiles[i][1] === word) {
                this.fieldKeysforCardFiles[i][2] = true;
            } else {
                this.fieldKeysforCardFiles[i][2] = false;
            }
        }
        this.currentSelectedWord = word;
    }
}
