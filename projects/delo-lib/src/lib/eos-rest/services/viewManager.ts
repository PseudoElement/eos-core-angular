import { Injectable } from '@angular/core';
import { PipRX } from './pipRX.service';
import { AppContext } from './appContext.service';
import { SRCH_VIEW, USER_CL, USER_VIEW, SRCH_VIEW_DESC } from '../interfaces/structures';
import { _ES } from '../core/consts';

@Injectable()
export class ViewManager {
    constructor(private pip: PipRX, private appCtx: AppContext) { }

    createView(viewtype: string): SRCH_VIEW {
        const tisn = this.pip.sequenceMap.GetTempISN();
        const stub = <SRCH_VIEW>{ ISN_VIEW: tisn, CUSTOMIZATION: 1, PERSONAL: 1, SRCH_KIND_NAME: viewtype };
        const tmp = this.pip.entityHelper.prepareAdded<SRCH_VIEW>(stub, 'SRCH_VIEW');
        return tmp;
    }

    /**
     * Add
     * @param view User
     */
    public addViewColumn(view: SRCH_VIEW): { result: SRCH_VIEW_DESC , view: SRCH_VIEW} {
        const result = <SRCH_VIEW_DESC>{ _State: _ES.Added };
        view.SRCH_VIEW_DESC_List.push(result);
        view._State = _ES.Modified;
        return {result, view};
    }

    public updateViewColumn(view: SRCH_VIEW, blockId: string, newName: string): SRCH_VIEW_DESC {
        const editEl = view.SRCH_VIEW_DESC_List.find(el => el.BLOCK_ID === blockId);
        editEl.LABEL = newName;
        editEl._State = _ES.Modified;
        return editEl;
    }

    editViewColumn(view: SRCH_VIEW, blockId: string): SRCH_VIEW_DESC {
        const col = view.SRCH_VIEW_DESC_List.find(c => c.BLOCK_ID === blockId && c._State !== _ES.Deleted);
        if (col !== undefined) {
            return this.pip.entityHelper.prepareForEdit(col);
        }
        return undefined;
    }

    delViewColumn(view: SRCH_VIEW, blockId: string) {
        const cols = view.SRCH_VIEW_DESC_List.filter(c => c.BLOCK_ID === blockId);
        for (let i = 0; i < cols.length; i++) {
            cols[i]._State = _ES.Deleted;
        }
    }

    orderRecalc(descList: SRCH_VIEW_DESC[]): any {
        if (!descList) {
            return;
        }
        for (let i = 0; i < descList.length; i++) {
            const record = descList[i];
            const order = i + 1;
            if (record.ORDERNUM !== order) {
                if (!record._State) {
                    this.pip.entityHelper.prepareForEdit(record);
                    record._State = _ES.Modified;
                }
                record.ORDERNUM = order;
            }
        }
    }

    saveView(view: SRCH_VIEW): Promise<number> {
        this.orderRecalc(view.SRCH_VIEW_DESC_List);
        let changeUser = Promise.resolve(<USER_CL>null);
        if (view._State === _ES.Added && view.PERSONAL === 1) {
            changeUser = this.pip.read<USER_CL>({
                USER_CL: [this.appCtx.CurrentUser.ISN_LCLASSIF],
                foredit: true, expand: 'USER_VIEW_List'
            }).then(ul => ul[0]);
        }
        return changeUser.then(u => {

            const modified: any[] = [view];
            if (u !== null) {
                u.USER_VIEW_List.push(<USER_VIEW>{ _State: _ES.Added, ISN_VIEW: view.ISN_VIEW });
                modified.push(u);
            }
            const chl = this.pip.changeList(modified);
            return this.pip.batch(chl, '').then(() => {
                return this.pip.sequenceMap.GetFixed(view.ISN_VIEW);
            });
        });
    }
}

