

export enum DGTplElementPosition {
    first,
    anyPosition,
    last,
}

export interface DGTplAdditionalControl {
    key: string; // key for additionalData;
    title: string;
    type: string; // input type (html)
    class: string; // css class
    valueIfUnused?: any; // set this value if DGTplElement unsetted
    // isToggleR?: boolean; // for checkbox {*A}\{A}
    storeInInfo?: 'L' | 'R'; // if set - push to SHABLON_INFO
}


export interface DGTplElement {
    key: string;
    title: string;
    isNotUnique?: boolean;


    /* Только для типов : */
    /*  если не указано - то для всех.*/
    // { value: 1, title: 'Входящие' },
    // { value: 3, title: 'Исходящие' },
    // { value: 2, title: 'Письма граждан'},
    possibleRKType?: RegExp;

    // Разрешено добавить элемент если выражение шаблона корректно
    enabledMask?: RegExp;

    // один из обязательных
    oneOfRequired?: boolean;

    // только в определенной позиции
    onlyPos?: DGTplElementPosition;

    // пишет еще что то в базу
    additionalControls?: DGTplAdditionalControl[];

    infoR?: boolean; // allow {*A}
    infoL?: boolean; // allow {A*}
}

