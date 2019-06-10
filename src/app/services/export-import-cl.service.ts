import { PipRX } from 'eos-rest/services/pipRX.service';
import { Injectable } from '@angular/core';

declare function openPopup(url: string, callback?: Function): boolean;

@Injectable()
export class ExportImportClService {
    EXPORT_VIEW_URL: string = '../MRExportImportCL/Pages/Export.aspx?';
    IMPORT_VIEW_URL: string = '../MRExportImportCL/Pages/Import.aspx?';

    constructor(
        protected apiSrv: PipRX
    ) {
        window['Rootpath'] = function () {
            return 'classif';
        };
        window['popParamsDefault']['export'] = { target: '_blank', varparams: 'width=870,height=650,', constparams: 'resizable=1,status=1,scrollbars=1,top=20,left=20' };
        window['popParamsDefault']['import'] = { target: '_blank', varparams: 'width=870,height=650,', constparams: 'resizable=1,status=1,scrollbars=1,top=20,left=20' };
    }

    openExport(dictionaryId: string): Promise<String> {
        return this.openWindow(dictionaryId, 'export');
    }

    openImport(dictionaryId: string, nodeId: string): Promise<String> {
        return this.openWindow(dictionaryId, 'import', nodeId);
    }

    private openWindow(dictionaryId: string, operation: string, nodeID?: string): Promise<String> {
        const url: string = this._prepareUrl(dictionaryId, operation, nodeID);
        return new Promise((resolve, reject) => {
            const w = openPopup(url, function (event, str) {
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
    private _prepareUrl(dictionaryId: string, operation: string, nodeId?: string): string {
        if (operation === 'export') {
            return this.EXPORT_VIEW_URL + `id=${dictionaryId}`;
        }
        return this.IMPORT_VIEW_URL + `id=${dictionaryId}&due=${nodeId}`;
    }
}
