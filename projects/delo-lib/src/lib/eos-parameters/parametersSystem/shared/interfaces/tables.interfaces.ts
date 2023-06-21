export interface ITableBtn {
    /** текст tooltip */
    tooltip: string;
    /** доступна ли кнопка */
    disable: boolean;
    /** Иконка доступна */
    iconActiv: string;
    /** иконка когда кнопка не доступна */
    iconDisable: string;
    /** id кнопки будет использоваться в возврате */
    id: string;
    /** активна ли кнопка */
    active?: boolean;
    /** какая Иконка будет использоваться при активной кнопке */
    activeIcon?: string;
    /** выпадашка из кнопки принимает на вход массив кнопок */
    children?: any[];
    /** Не показывать кнопку */
    notView?: boolean;
}
export interface ITableSetting {
    /** можно ли отмечать строки */
    selected?: boolean;
    /** показывать ли количество выделенных  */
    counter?: boolean;
    /** имя таблицы */
    title?: string;
}
export interface ITableHeader {
    title: string;
    /**
    * 0 - нет значка, 1 - уменьшение, 2 - увеличение
    */
    order?: 'none' | 'asc' | 'desc';
    id: string;
    /** Фиксированный столбец при включении использовать min-width в style */
    fixed?: boolean;
    style?: any;
}
export interface ITableInfData {
    key: string | number;
    check?: boolean;
}
export interface ITableData {
    /** Кнопки таблицы */
    tableBtn: ITableBtn[];
    /** Описание для самих таблиц */
    tableHeader: ITableHeader[];
    /** Информация для тела таблицы */
    data: any[];
}
export interface ITableSettings {
    /** Стили для каждого стобца в header */
    headerStyle?: { // 
        background: string,
        border: string
    }; // стили для header
    /** спрятать чекбоксы выбора */
    hiddenCheckBox?: boolean;
    /** максимальная высоты таблицы */
    maxHeightTable?: string;
    /** минимальная высота таблицы */
    minHeightTable?: string;
    /** Eсть возможность выбрать строчку */
    selectedRow?: boolean;
    /** отображать общее количество, если не выбрано то будет отображаться количество выбранных */
    count?: boolean;
    paddingBottom?: string;
    widthAllTable?: boolean;
    /** раскрасить строки таблицы в разные цвета */
    printTable?: boolean;
    /** цвет бэкграунда для всей строки header */
    headerTitleColor?: string;
    /** Сюда передаётся дефолтное значение header для таблицы если передано то будет появляться кнопка настройки таблицы */
    defaultSettingHeader?: ITableHeader[];
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
