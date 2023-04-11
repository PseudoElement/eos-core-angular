export interface ITableBtn {
    tooltip: string; // текст tooltip
    disable: boolean; // доступна ли кнопка
    iconActiv: string; // иконка доступа
    iconDisable: string; // иконка когда кнопка не доступна
    id: string; // id кнопки будет использоваться в возврате
    active?: boolean; // активна ли кнопка
    activeIcon?: string; // какая Иконка будет использоваться при активной кнопке
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
    fixed?: boolean; // при включении использовать min-width в style
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
    hiddenCheckBox?: boolean; // спрятать чекбоксы выбора
    maxHeightTable?: string; // максимальная высоты таблицы
    selectedRow?: boolean; // есть возможность выбрать строчку
    count?: boolean; // отображать общее количество, если не выбрано то будет отображаться количество выбранных
    paddingBottom?: string;
    widthAllTable?: boolean;
}
export enum ECellToAll  {
    icon,
    checkbox,
    radio,
    buttons
};
export interface ICellInfo {
    type?: ECellToAll,
    info: any
}
