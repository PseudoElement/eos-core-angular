import { Injectable } from '@angular/core';
import { IOpenClassifParams } from 'eos-common/interfaces';

declare function openPopup(url: string, callback?: Function): boolean;

const LIST_OLD_PAGES: string[] = [
    'CARDINDEX',
    'USER_CL',
    'ORGANIZ_CL',
];
const OLD_VIEW_URL: string = 'Pages/Classif/ChooseClassif.aspx?';
const NEW_VIEW_URL: string = 'Eos.Delo.JsControls/Classif/ChooseClassif.aspx?';

@Injectable()
export class WaitClassifService {
    constructor() {
        window['Rootpath'] = function() {
            return 'classif';
        };
    }
    openClassif(params: IOpenClassifParams): Promise<String> {
        const url = this._prepareUrl(params);
        // const w = window.open(url, 'name', 'left=10,top=200,width=1000,height=500');

        return new Promise((resolve, reject) => {
            // openPopup('../Eos.Delo.JsControls/Classif/ChooseClassif.aspx?Classif=DEPARTMENT&return_due=true', function() {
        const w =  openPopup(url, function(event, str) {
                if (str !== '') {
                    return resolve(str);
                }
                return reject();
            });

            const checkDialClosed = setInterval(function () {
                try {
                    if (!w || w['closed']) {
                        clearInterval(checkDialClosed);
                        reject();
                    }
                } catch (e) {
                    reject();
                }
            }, 500);
        });
    }
    private _prepareUrl(params: IOpenClassifParams): string {
        let url = '../';
        url += (LIST_OLD_PAGES.indexOf(params.classif) !== -1) ? OLD_VIEW_URL : NEW_VIEW_URL;
        url += `Classif=${params.classif}`;
        url += params.return_due ? '&return_due=true' : '';
        url += params.id ? `&value_id=${params.id}_Ids&name_id=${params.id}` : '';
        url += params.selected ? `&selected=${params.selected}` : '';
        if (params.selectMulty !== undefined && params.selectMulty !== null) {
            url += `&select_multy=${params.selectMulty}`;
        }
        if (params.selectNodes !== undefined && params.selectNodes !== null) {
            url += `&select_nodes=${params.selectNodes}`;
        }
        if (params.selectLeafs !== undefined && params.selectLeafs !== null) {
            url += `&select_leafs=${params.selectLeafs}`;
        }
        if (params.skipDeleted !== undefined && params.skipDeleted !== null) {
            url += `&skip_deleted=${params.skipDeleted}`;
        }
        if (params.nomenkl_jou !== undefined && params.nomenkl_jou !== null) {
            url += `&nomenkl_jou=${params.nomenkl_jou}`;
        }

        url += params.classif === 'CONTACT' || params.classif === 'ORGANIZ_CL' ? '&app=nadzor' : '';
        return url;
    }
}
