// import { Features } from "eos-dictionaries/features/features-current.const";
import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from '../_linear-template';

export const EXPORT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'EXPORT',
    isFolder: true,
    title: 'Экспорт',
    visible: true,
    apiInstance: 'SEV',
    iconName: 'eos-icon-share-blue',
    openURL: '../Protocol/Pages/ProtocolView.html?type=remove'
});
export const IMPORT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'IMPORT',
    isFolder: true,
    title: 'Импорт',
    visible: true,
    apiInstance: 'INSTRUMENTS',
    iconName: 'eos-icon-download',
    openURL: '../Protocol/Pages/ProtocolView.html?type=remove'
});
export const PROTOCOL_REMOVE: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'PROTOCOL_REMOVE',
    isFolder: true,
    title: 'Протокол удалание РК',
    visible: true,
    apiInstance: 'INSTRUMENTS',
    iconName: 'eos-icon-rules-blue',
    openURL: '../Protocol/Pages/ProtocolView.html?type=remove'
});
export const PROTOCOL_CHANGE: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'PROTOCOL_CHANGE',
    isFolder: true,
    title: 'Протокол изменений',
    visible: true,
    apiInstance: 'INSTRUMENTS',
    iconName: 'eos-icon-rules-blue',
    openURL: '../Protocol/Pages/ProtocolView.html?type=change'
});
export const PROTOCOL_VIEW: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'PROTOCOL_VIEW',
    isFolder: true,
    title: 'Протокол просмотра',
    visible: true,
    apiInstance: 'INSTRUMENTS',
    iconName: 'eos-icon-rules-blue',
    openURL: '../Protocol/Pages/ProtocolView.html?type=view'
});
export const PROTOCOL_SCAN: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'PROTOCOL_SCAN',
    isFolder: true,
    title: 'Протокол поточного сканирования',
    visible: true,
    apiInstance: 'INSTRUMENTS',
    iconName: 'eos-icon-rules-blue',
    openURL: '../Protocol/Pages/ProtocolView.html?type=scan'
});
export const IMPORT_1C: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'IMPORT_1C',
    isFolder: true,
    title: 'Интеграция 1С',
    visible: true,
    apiInstance: 'INSTRUMENTS',
    iconName: 'eos-icon-directory-settings-blue',
    openURL: '../AChRF.Cadres/Pages/AChRFCadres.html'
});
export const INSTRUMENTS_DICTIONARIES = [
    EXPORT,
    IMPORT,
    PROTOCOL_REMOVE,
    PROTOCOL_CHANGE,
    PROTOCOL_VIEW,
    PROTOCOL_SCAN,
    IMPORT_1C
    // SEV_ASSOCIATION_DICT,
];
