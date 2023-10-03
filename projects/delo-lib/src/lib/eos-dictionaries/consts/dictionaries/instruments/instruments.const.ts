import { ETypeFon, IFonLists } from '../../../../eos-backgraund-tasks/interface';

export const OPENED_WINDOW = {
    EXPORT: null,
    IMPORT: null,
    windowScan: null,
    windowRemove: null,
    windowChange: null,
    windowView: null,
    import1CView: null,
    changeDl: null
};

function openModalInsrtument(dict: any): void {
    switch (dict.id) {
        case 'EXPORT':
        case 'IMPORT':
            eiCl(dict.id);
            break;
        case 'PROTOCOL_REMOVE':
            OpenModel(dict.openURL)
            break;
        case 'PROTOCOL_CHANGE':
            OpenModel(dict.openURL)
            break;
        case 'PROTOCOL_VIEW':
            OpenModel(dict.openURL)
            break;
        case 'PROTOCOL_SCAN':
            OpenModel(dict.openURL)
            break;
        case 'IMPORT_1C':
            import1CView(dict.openURL);
            break;
        case 'CHANGE_DL':
            changeDl(dict.openURL);
            break;
        case 'CommonTechLists':
            OpenModel(dict.openURL)
            break;
        case 'GeneralLists':
            OpenModel(stdTextUrl(dict.openURL, dict))
            break;
        default:
            break;
    }
}

function OpenModel(url: string) {
    if (OPENED_WINDOW.EXPORT && !OPENED_WINDOW.EXPORT.closed) {
        OPENED_WINDOW.EXPORT.focus();
    } else {
        OPENED_WINDOW.EXPORT = window.open(url, '_blank', 'width=980,height=700');
        OPENED_WINDOW.EXPORT.blur();
    }
}

function stdTextUrl(url, params) {

    if (params.isn_user !== undefined && params.isn_user !== null) {
        url += getSymbol(url) + `isn_user=${params.isn_user}`;
    }
    if (params.clUser === true) {
        url += getSymbol(url) + `clUser=${params.clUser}`;
    }

    if (params.idText !== undefined && params.idText !== null) {
        url += getSymbol(url) + `id=${params.idText}`;
        url += getSymbol(url) + `name=${params.idText}`;
    }
    if (params.formText !== undefined && params.formText !== null) {
        url += getSymbol(url) + `form=${params.formText}`;
    }
    if (params.selected !== undefined && params.selected !== null) {
        url += getSymbol(url) + `select=${params.selected}`;
    }
    console.log('url', url);
    
    return url;
}

function getSymbol(url: string) {
    return url.indexOf('?') === -1 ? '?' : '&';
}

function eiCl(id: any) {
    if (id === 'EXPORT') {
        openExport('all');
    } else {
        openImport('all', 'all');
    }
}

function openExport(dictionaryId: string) {
    const URL = `../ExportImport.WebPlugin/export.html?id=${dictionaryId}`;
    OpenModel(URL)
}

function openImport(dictionaryId: string, nodeId: string) {
    const URL = `../ExportImport.WebPlugin/import.html?id=${dictionaryId}&due=${nodeId}`;
    OpenModel(URL)
}

function import1CView(url) {
    OPENED_WINDOW.import1CView = window.open(url, '_blank', 'width=900,height=700');
    OPENED_WINDOW.import1CView.blur();
}

function changeDl(url) {
    OPENED_WINDOW.changeDl = window.open(url, '_blank', 'width=900,height=700');
    OPENED_WINDOW.changeDl.blur();
}

export const EXPORT: IFonLists = {
    id: 'EXPORT',
    title: 'Экспорт справочника',
    icon: 'eos-adm-icon-share-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: (mountPoint: string) => {
        openModalInsrtument({
            id: 'EXPORT',
            openURL: '../Protocol.WebPlugin/Pages/ProtocolView.html?type=remove'
        });
    },
    render(mountPoint) { },

};

export const IMPORT: IFonLists = {
    id: 'IMPORT',
    title: 'Импорт справочника',
    icon: 'eos-adm-icon-download',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'IMPORT',
            openURL: '../Protocol.WebPlugin/Pages/ProtocolView.html?type=remove'
        });
    },
    render(mountPoint) {
    },

};

export const PROTOCOL_REMOVE: IFonLists = {
    id: 'PROTOCOL_REMOVE',
    title: 'Протокол удаления РК',
    icon: 'eos-adm-icon-rules-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument(
            {
                id: 'PROTOCOL_REMOVE',
                openURL: '../Protocol.WebPlugin/Pages/ProtocolView.html?type=remove'
            }
        );
    },
    render(mountPoint) {
    },
};

export const PROTOCOL_CHANGE: IFonLists = {
    id: 'PROTOCOL_CHANGE',
    title: 'Протокол изменений',
    icon: 'eos-adm-icon-rules-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument(
            {
                id: 'PROTOCOL_CHANGE',
                openURL: '../Protocol.WebPlugin/Pages/ProtocolView.html?type=change'
            }
        );
    },
    render(mountPoint) {
        //   openURL: '../Protocol/Pages/ProtocolView.html?type=change'
    },
};

export const PROTOCOL_VIEW: IFonLists = {
    id: 'PROTOCOL_VIEW',
    title: 'Протокол просмотра',
    icon: 'eos-adm-icon-rules-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'PROTOCOL_VIEW',
            openURL: '../Protocol.WebPlugin/Pages/ProtocolView.html?type=view'
        });
    },
    render(mountPoint) {
        //  openURL: '../Protocol/Pages/ProtocolView.html?type=view'
    },
};

export const PROTOCOL_SCAN: IFonLists = {
    id: 'PROTOCOL_SCAN',
    title: 'Протокол поточного сканирования',
    type: ETypeFon.popUp,
    icon: 'eos-adm-icon-rules-blue',
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'PROTOCOL_SCAN',
            openURL: '../Protocol.WebPlugin/Pages/ProtocolView.html?type=scan'
        });
    },
    render(mountPoint) {
        //  openURL: '../Protocol/Pages/ProtocolView.html?type=scan'
    },
};

export const IMPORT_1C: IFonLists = {
    id: 'IMPORT_1C',
    title: 'Интеграция 1С',
    icon: 'eos-adm-icon-directory-settings-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'IMPORT_1C',
            openURL: '../AChRF.Cadres/Pages/AChRFCadres.html'
        });
    },
    render(mountPoint) {
        // openURL: '../AChRF.Cadres/Pages/AChRFCadres.html'
    },
};

export const CHANGE_DL: IFonLists = {
    id: 'CHANGE_DL',
    title: 'Передача документов',
    icon: 'eos-adm-icon-accept-doc-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'CHANGE_DL',
            openURL: '../WebRC/Pages/ChangeDl.html'
        });
    },
    render(mountPoint) {
        // openURL: '../WebRC/Pages/ChangeDl.html'
    },

};

export const COMMON_TECH_LIST: IFonLists = {
    id: 'CommonTechLists',// разобраться что ставить
    title: 'Настройка общих и технологических списков',
    icon: 'eos-adm-icon-template-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'CommonTechLists',
            openURL: '../WebRC/Pages/CommonLists.html'
        });
    },
    render(mountPoint) {},
};

export const GENERAL_LISTS: IFonLists = {
    id: 'GeneralLists',
    title: 'Настройка общих списков стандартных текстов',
    icon: 'eos-adm-icon-text-list-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'GeneralLists',
            openURL: '../WebRC/Pages/StdText.html',
            clUser: true,
            isn_user: -99,
        });
    },
    render(mountPoint) {},
};

export const  CONTROL_CACHE: IFonLists = {
    id: 'control-cache',
    title: 'Управление кэшем',
    icon: 'eos-adm-icon-repair-blue',
    type: ETypeFon.frame,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        /// Управление кэшем
    },
    render(mountPoint) {},
};

export const TOOLS_DICTIONARIES = [
    EXPORT,
    IMPORT,
    PROTOCOL_REMOVE,
    PROTOCOL_CHANGE,
    PROTOCOL_VIEW,
    PROTOCOL_SCAN,
    // IMPORT_1C,
    CHANGE_DL,
    COMMON_TECH_LIST,
    GENERAL_LISTS,
    CONTROL_CACHE
    // DELO_REPORT_DESINGER
    // SEV_ASSOCIATION_DICT,
];
