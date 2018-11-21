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
        // const homeCardData = this._userParamsSetSrv.hashUserContexHomeCard;
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
            this.choosingMainCheckbox();
            this.isLoading = false;
        });
    }
    choosingMainCheckbox() {
        let flag = true;
        let tmpI = -1;
        for (let i = 0; i < this.fieldKeysforCardFiles.length; i++) {
            for (const key in this._userParamsSetSrv.hashUserContexHomeCard) {
            if (this.fieldKeysforCardFiles[i][2] === true) {
                flag = false;
                this.fieldKeysforCardFiles[i][2] = true;
                this.fieldKeysforCardFiles[i][3] = true;
                this.mainCheckbox[this.fieldKeysforCardFiles[i][0]] = 1;
            } else if (this.fieldKeysforCardFiles[i][0] === key && this._userParamsSetSrv.hashUserContexHomeCard[key] === 1 && flag) {
                tmpI = i;
            } else {
                this.fieldKeysforCardFiles[i][3] = false;
            }
          }
        }

        if (tmpI !== -1 && flag) {
            this.fieldKeysforCardFiles[tmpI][2] = true;
            this.fieldKeysforCardFiles[tmpI][3] = true;
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
