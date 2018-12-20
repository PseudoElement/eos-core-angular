import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { EosMessageService } from '../../eos-common/services/eos-message.service';
import { ISearchSettings, SEARCH_MODES, E_DICT_TYPE } from 'eos-dictionaries/interfaces';
import { SEARCH_NOT_DONE } from '../consts/messages.consts';

@Component({
    selector: 'eos-dictionary-quick-search',
    templateUrl: 'dictionary-quick-search.component.html',
})
export class DictionariesQuickSearchComponent implements AfterViewInit {
    public srchString = '';
    public settings: ISearchSettings = {
        mode: SEARCH_MODES.currentAndSubbranch,
        deleted: false
    };

    @ViewChild('quickSearchField') private searchElementRef: ElementRef;

    private searchDone = true;

    get isTree(): boolean {
        return this._dictSrv.currentDictionary.descriptor.type !== E_DICT_TYPE.linear;
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
    ) { }

    public ngAfterViewInit(): void {
        this.searchElementRef.nativeElement.focus();
    }

    quickSearch(evt: KeyboardEvent) {
        if (evt.keyCode === 13) {
            if (this.searchDone) {
                this.srchString = (this.srchString) ? this.srchString.trim() : '';
                if (this.srchString !== '') {
                    this.searchDone = false;
                    this.settings.deleted = this._dictSrv.viewParameters.showDeleted;
                    this._dictSrv.search(this.srchString, this.settings)
                        .then(() => this.searchDone = true);
                }
            } else {
                this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
            }
        }
    }

    clearQuickForm() {
        this.srchString = '';
    }
}
