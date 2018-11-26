import { IOpenClassifParams } from 'eos-common/interfaces';

export class WaitClassifService {
    constructor() {
        window['Rootpath'] = function() {
            return 'classif';
        };
    }
    openClassif(params: IOpenClassifParams): Promise<String> { // 0.2SV.2T1.
        const url = this._prepareUrl(params);
        const w = window.open(url, 'name', 'left=10,top=200,width=1000,height=500');
        return new Promise((resolve, reject) => {
            window['endPopup'] = (data, flag) => {
                if (flag !== 'refresh') {
                    window['endPopup'] = undefined;
                    resolve(data);
                }
            };
            const checkDialClosed = setInterval(function () {
                try {
                    if (!w || w.closed) {
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
        let url = '../Eos.Delo.JsControls/Classif/ChooseClassif.aspx?';
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

        return url;
    }
}
