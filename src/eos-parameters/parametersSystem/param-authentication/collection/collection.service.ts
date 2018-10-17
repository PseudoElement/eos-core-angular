import { Injectable } from '@angular/core';
import { ParamApiSrv } from 'eos-parameters/parametersSystem/shared/service/parameters-api.service';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { PASS_STOP_LIST } from 'eos-rest';
import { EosMessageService } from 'eos-common/services/eos-message.service';

export interface ICollectionList extends PASS_STOP_LIST {
    marked: boolean;
    isSelected: boolean;
    selectedMark: boolean;
}

@Injectable()
export class CollectionService {
    private _collectionList: ICollectionList[];
    get collectionList() {
        if (this._collectionList) {
            return this._collectionList;
        }
        return null;
    }
    constructor(
        private _apiSrv: ParamApiSrv,
        private msgSrv: EosMessageService
    ) {}
    getCollectionList(): Promise<ICollectionList[]> {
        return this._apiSrv.getData({'SYS_PARMS(-99)/PASS_STOP_LIST_List': ALL_ROWS})
            .then((data) => {
                const dataList = data.map(w => {
                    return Object.assign({
                        marked: false,
                        isSelected: false,
                        selectedMark: false,
                    }, w);
                });
                this._collectionList = dataList;
                return dataList;
            });
    }

    changeWords(query): Promise<boolean> {
        return this._apiSrv.setData(query)
            .then(() => {
                this.msgSrv.addNewMessage({
                    type: 'success',
                    title: 'Изменения сохранены',
                    msg: ''
                });
                return true;
            })
            .catch(err => {
                this.msgSrv.addNewMessage({
                    type: 'success',
                    title: 'Изменения сохранены',
                    msg: err.message ? err.message : err
                });
                return false;
            });
    }
}
