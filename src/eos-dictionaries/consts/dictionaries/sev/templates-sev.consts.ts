import { LINEAR_TEMPLATE } from '../_linear-template';

const SEV_ACTIONS = [
    'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'restore',
    'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
    'removeHard',
    'edit', 'view', 'remove', 'removeHard', 'userOrder', 'protViewSecurity'];


export const SEV_LINEAR_TEMPLATE = Object.assign({}, LINEAR_TEMPLATE, {
    folder: 'SEV',
    actions: SEV_ACTIONS,
});

export const SEV_COLLISION_OPTIONS = {
    // [Группа 1] Некорректность формата сообщения СЭВ
    1: [{ value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }],
    2: [{ value: 1, title: 'Отказать в регистрации' }],
    10: [{ value: 1, title: 'Отказать в регистрации' }],
    11: [{ value: 1, title: 'Отказать в регистрации' }],
    15: [{ value: 1, title: 'Отказать в регистрации' },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    16: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    18: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    21: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    29: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    31: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    32: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    33: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    34: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    35: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    39: [{ value: 1, title: 'Отказать в регистрации', },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' }
    ],
    // [Группа 2] Несогласованность значений элементов справочников

    17: [{ value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    { value: 3, title: 'Продолжить регистрацию' },
    ],
    26: [{ value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    { value: 3, title: 'Продолжить регистрацию' },
    ],
    27: [{ value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    { value: 3, title: 'Продолжить регистрацию' },
    ],
    28: [{ value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    { value: 3, title: 'Продолжить регистрацию' },
    ],
    30: [{ value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    { value: 3, title: 'Продолжить регистрацию' },
    ],
    36: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    37: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    38: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    40: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    43: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    45: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    46: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    47: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    48: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    49: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    55: [
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    61: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    62: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    // [Группа 3] Нарушение правил регистрации сообщения СЭВ в системе
    13: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    14: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    41: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    50: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    51: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    52: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    53: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    54: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    57: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    58: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    59: [
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    60: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],

    // [Группа 4] Неопределенность связанного документа
    23: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
        { value: 4, title: 'Создать связку с документом, не зарегистрированным' },
    ],
    24: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
        { value: 4, title: 'Создать связку с документом, не зарегистрированным' },
    ],
    25: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
        { value: 4, title: 'Создать связку с документом, не зарегистрированным' },
    ],
    // [Группа 5] Повторность документа
    12: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 5, title: 'Разрешить редактировать' },
    ],
    19: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
        { value: 5, title: 'Разрешить редактировать' },
    ],
    20: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
        { value: 5, title: 'Разрешить редактировать' }
    ],
    42: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
    44: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    56: [
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
        { value: 3, title: 'Продолжить регистрацию' },
    ],
    63: [
        { value: 1, title: 'Отказать в регистрации' },
        { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    ],
};

export const RESOLVE_DESCRIPTIONS = [
    { value: 1, title: 'Отказать в регистрации' },
    { value: 2, title: 'Регистрировать сообщение из ПП в СЭВ' },
    { value: 3, title: 'Продолжить регистрацию' },
    { value: 4, title: 'Создать связку с документом, не зарегистрированным' },
    { value: 5, title: 'Разрешить редактировать' },
];
