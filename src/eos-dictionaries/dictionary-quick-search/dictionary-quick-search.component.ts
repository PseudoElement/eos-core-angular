import {AfterViewInit, Component, ElementRef, ViewChild, EventEmitter, Output, OnInit, Input} from '@angular/core';
import { EosDictService } from '../services/eos-dict.service';
import { E_DICT_TYPE, SearchFormSettings, SEARCHTYPE } from 'eos-dictionaries/interfaces';
import { EosMessageService } from 'eos-common/services/eos-message.service';
import { SEARCH_EMPTY } from 'eos-dictionaries/consts/messages.consts';

@Component({
    selector: 'eos-dictionary-quick-search',
    templateUrl: 'dictionary-quick-search.component.html',
})


export class DictionariesQuickSearchComponent implements AfterViewInit, OnInit {



    @Output() searchClose: EventEmitter<SearchFormSettings> = new EventEmitter();
    @Output() searchRun: EventEmitter<SearchFormSettings> = new EventEmitter();
    @Input() settings: SearchFormSettings;
    @ViewChild('quickSearchField', { static: true }) private searchElementRef: ElementRef;

    // private searchDone = true;

    get isTree(): boolean {
        return this._dictSrv.currentDictionary.descriptor.type !== E_DICT_TYPE.linear;
    }

    constructor(
        private _dictSrv: EosDictService,
        private _msgSrv: EosMessageService,
        // private _storage: EosStorageService,
    ) { }

    public ngAfterViewInit(): void {
        this.searchElementRef.nativeElement.focus();
    }

    ngOnInit(): void {
        // this.srch = this._getStoredQSearch();
        // if (this.srch) {
        //     if (s.quickString) {
        //         this.srchString = s.;
        //     } else if (objSearch.quickForm) {
        //         this.openFastSrch();
        //     }
        // } else {

        // }
    }

    quickSearch(evt: KeyboardEvent, val?) {
        // добавлено evt.key === undefined для закрытия быстрого поиска при переходе в расширенный поиск
        if (evt.keyCode === 27 || (evt.key === undefined && val === undefined)) {
            this.closeQuickForm();
        }
        // добавлено evt.key === "Enter" , т.к. при переходе на расширенны поиск срабатывает событие keydown с keyCode:13 (enter)
        if (evt.keyCode === 13 && (evt.key === 'Enter' || val === null)) {
            if (this.settings.quick.data && this.settings.quick.data.trim()) {
                this.searchRun.emit(this.settings);
            } else {
                this._msgSrv.addNewMessage(SEARCH_EMPTY);
            }
            // if (this.searchDone) {

                // this.srch.quickString = (this.srch.quickString) ? this.srch.quickString.trim() : '';
                // if (this.srch.quickString !== '') {
                //     this._dictSrv.setMarkAllNone();
                //     this.searchDone = false;
                //     this.settings.deleted = this._dictSrv.viewParameters.showDeleted;
                //     this._setStoredQSearch(this.srch);
                //     this._dictSrv.search(this.srch.quickString, this.settings)
                //         .then(() => this.searchDone = true);
                // }
            // } else {
            //     this._msgSrv.addNewMessage(SEARCH_NOT_DONE);
            // }
        }
    }

    clearQuickForm() {
        this.settings.quick.data = '';
    }

    closeQuickForm () {
        this.settings.lastSearch = SEARCHTYPE.none;
        this.searchClose.emit(this.settings);
    }

}
