// import { Features } from "eos-dictionaries/features/features-current.const";
import { ETypeFon, IFonLists } from 'eos-backgraund-tasks/interface';

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
            openProtocolRemove(dict.openURL);
            break;
        case 'PROTOCOL_CHANGE':
            openProtocolChange(dict.openURL);
            break;
        case 'PROTOCOL_VIEW':
            openProtocolView(dict.openURL);
            break;
        case 'PROTOCOL_SCAN':
            openProtocolScan(dict.openURL);
            break;
        case 'IMPORT_1C':
            import1CView(dict.openURL);
            break;
        case 'CHANGE_DL':
            changeDl(dict.openURL);
            break;
        default:
            break;
    }
}
function eiCl(id: any) {
    if (id === 'EXPORT') {
        openExport('all');
    } else {
        openImport('all', 'all');
    }
}

function openExport(dictionaryId: string) {
    const URL = `../MRExportImportCL/Pages/Export.aspx?id=${dictionaryId}`;
    if (OPENED_WINDOW.EXPORT && !OPENED_WINDOW.EXPORT.closed) {
        OPENED_WINDOW.EXPORT.focus();
    } else {
        OPENED_WINDOW.EXPORT = window.open(URL, '_blank', 'width=900,height=700');
        OPENED_WINDOW.EXPORT.blur();
    }
}

function openImport(dictionaryId: string, nodeId: string) {
    const URL = `../MRExportImportCL/Pages/Import.aspx?id=${dictionaryId}&due=${nodeId}`;
    if (OPENED_WINDOW.IMPORT && !OPENED_WINDOW.IMPORT.closed) {
        OPENED_WINDOW.IMPORT.focus();
    } else {
        OPENED_WINDOW.IMPORT = window.open(URL, '_blank', 'width=900,height=700');
        OPENED_WINDOW.IMPORT.blur();
    }
}
function openProtocolScan(url) {
    if (OPENED_WINDOW.windowScan && !OPENED_WINDOW.windowScan.closed) {
        OPENED_WINDOW.windowScan.focus();
    } else {
        OPENED_WINDOW.windowScan = window.open(url, '_blank', 'width=900,height=700');
        OPENED_WINDOW.windowScan.blur();
    }
}
function openProtocolRemove(url) {
    if (OPENED_WINDOW.windowRemove && !OPENED_WINDOW.windowRemove.closed) {
        OPENED_WINDOW.windowRemove.focus();
    } else {
        OPENED_WINDOW.windowRemove = window.open(url, '_blank', 'width=900,height=700');
        OPENED_WINDOW.windowRemove.blur();
    }
}
function openProtocolChange(url) {
    if (OPENED_WINDOW.windowChange && !OPENED_WINDOW.windowChange.closed) {
        OPENED_WINDOW.windowChange.focus();
    } else {
        OPENED_WINDOW.windowChange = window.open(url, '_blank', 'width=900,height=700');
        OPENED_WINDOW.windowChange.blur();
    }
}
function openProtocolView(url) {
    if (OPENED_WINDOW.windowView && !this.windowView.closed) {
        OPENED_WINDOW.windowView.focus();
    } else {
        OPENED_WINDOW.windowView = window.open(url, '_blank', 'width=900,height=700');
        OPENED_WINDOW.windowView.blur();
    }
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
    icon: 'eos-icon-share-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: (mountPoint: string) => {
        openModalInsrtument({
            id: 'EXPORT',
            openURL: '../Protocol/Pages/ProtocolView.html?type=remove'
        });
    },
    render(mountPoint) { },

};
export const IMPORT: IFonLists = {
    id: 'IMPORT',
    title: 'Импорт справочника',
    icon: 'eos-icon-download',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'IMPORT',
            openURL: '../Protocol/Pages/ProtocolView.html?type=remove'
        });
    },
    render(mountPoint) {
    },

};
export const PROTOCOL_REMOVE: IFonLists = {
    id: 'PROTOCOL_REMOVE',
    title: 'Протокол удалание РК',
    icon: 'eos-icon-rules-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument(
            {
                id: 'PROTOCOL_REMOVE',
                openURL: '../Protocol/Pages/ProtocolView.html?type=remove'
            }
        );
    },
    render(mountPoint) {
    },
};
export const PROTOCOL_CHANGE: IFonLists = {
    id: 'PROTOCOL_CHANGE',
    title: 'Протокол изменений',
    icon: 'eos-icon-rules-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument(
            {
                id: 'PROTOCOL_CHANGE',
                openURL: '../Protocol/Pages/ProtocolView.html?type=change'
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
    icon: 'eos-icon-rules-blue',
    type: ETypeFon.popUp,
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'PROTOCOL_VIEW',
            openURL: '../Protocol/Pages/ProtocolView.html?type=view'
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
    icon: 'eos-icon-rules-blue',
    checkAccess: () => Promise.resolve(true),
    loadPlugin: () => {
        openModalInsrtument({
            id: 'PROTOCOL_SCAN',
            openURL: '../Protocol/Pages/ProtocolView.html?type=scan'
        });
    },
    render(mountPoint) {
        //  openURL: '../Protocol/Pages/ProtocolView.html?type=scan'
    },
};
export const IMPORT_1C: IFonLists = {
    id: 'IMPORT_1C',
    title: 'Интеграция 1С',
    icon: 'eos-icon-directory-settings-blue',
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
    icon: 'eos-icon-directory-settings-blue',
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
// export const DELO_REPORT_DESINGER: IFonLists = {
//     id: 'DELO_REPORT_DESINGER',
//     title: 'Конструктор печатных форм',
//     icon: 'Directory-Settings-Blue.svg',
//     type: ETypeFon.frame,
//     checkAccess: () => Promise.resolve(true),
//     loadPlugin: () => Promise.resolve(),
//     render(mountPoint) {
//     },
// };
export const INSTRUMENTS_DICTIONARIES = [
    EXPORT,
    IMPORT,
    PROTOCOL_REMOVE,
    PROTOCOL_CHANGE,
    PROTOCOL_VIEW,
    PROTOCOL_SCAN,
    IMPORT_1C,
    CHANGE_DL,
    // DELO_REPORT_DESINGER
    // SEV_ASSOCIATION_DICT,
];
