export enum SEARCH_MODES {
    totalDictionary,
    onlyCurrentBranch,
    currentAndSubbranch
}

export enum SEARCHTYPE {
    quick,
    full,
    none,
}

export interface ISearchSettings {
    mode: SEARCH_MODES;
    deleted: boolean;
    onlyNew?: boolean;
}


export class SearchFormSettingsQuick {
    data = '';
    // mode = SEARCH_MODES.currentAndSubbranch;
    // showDeleted = false;
}
export class SearchFormSettings {
    lastSearch: SEARCHTYPE = SEARCHTYPE.none;
    entity: string = '';
    entity_dict: string = '';
    opts: ISearchSettings = { mode: SEARCH_MODES.currentAndSubbranch, deleted: false, onlyNew: false};

    full = {
        data: null,
    };

    quick = new SearchFormSettingsQuick ();

    filter = {
        data: {},
    };
}
