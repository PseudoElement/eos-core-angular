import { IMessage } from 'eos-common/interfaces';

export const NOT_EMPTY_STRING = /^((?!\:\"\|).)*$/; // /\s*\S+(\s|\S)*/;
export const DATE_INPUT_PATERN = /.*(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4}).*?/; // }19\d{2}|20\d{2}|2100
export const DATE_JSON_PATTERN = /(\d{4})-(\d{2})-(\d{2})(T(\d{2}:){2}\d{2}.*)/;
export const INPUT_ERROR_MESSAGES = {
    required: 'Обязательное поле.',
    isUnique: [
        'Значение должно быть уникальным в пределах вершины.',
        'Значение должно быть уникальным в пределах справочника.',
    ],
    pattern: 'Некорректное значение.',
    wrongDate: 'Недопустимая дата. Фомат даты \'дд.мм.гггг\'.',
    minDate: 'Дата должна быть не раньше 01.01.1900.',
    maxDate: 'Дата должна быть не позже 31.12.2100.',
    default: 'Некорректное значение.'
};

export const SUCCESS_SAVE_MESSAGE_SUCCESS: IMessage = {
    type: 'success',
    title: 'Информация о сохранении: ',
    msg: 'текущие изменения успешно сохранены'
};
