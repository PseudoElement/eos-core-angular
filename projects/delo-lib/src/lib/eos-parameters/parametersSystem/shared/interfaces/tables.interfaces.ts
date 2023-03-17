export interface ITableBtn {
    tooltip: string; // текст tooltip
    disable: boolean; // доступна ли кнопка
    iconActiv: string; // иконка доступа
    iconDisable: string; // иконка когда кнопка не доступна
    id: string; // id кнопки будет использоваться в возврате
}
export interface ITableSetting {
    selected?: boolean; // можно ли отмечать строки
    counter?: boolean; // показывать ли количество выделенных
    title?: string; // имя таблицы
}
export interface ITableHeader {
    title: string;
    /*
    * 0 - нет значка, 1 - уменьшение, 2 - увеличение
    */
    order?: 'none' | 'asc' | 'desc';
    id: string;
    style?: any;
}
export interface ITableInfData {
    key: string | number;
    check?: boolean;
}
export interface ITableData {
    tableBtn: ITableBtn[];
    tableHeader: ITableHeader[];
    data: any[];
}
export interface ITableSettings {
    hiddenCheckBox?: boolean;
    maxHeightTable?: string;
    selectedRow?: boolean;
}
