import { IMessage, SUCCESS_DISMISS_TIMEOUT } from '../../eos-common/interfaces';

export const NOT_EMPTY_STRING = /^((?!\:\"\|).)*$/; // /\s*\S+(\s|\S)*/;
export const NOT_EMPTY_MULTYSTRING = /^((?!\:\"\|).|\n|\r)*$/; // /\s*\S+(\s|\S)*/;
export const DATE_INPUT_PATERN = /.*(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(\d{4}).*?/; // }19\d{2}|20\d{2}|2100
export const DATE_JSON_PATTERN = /(\d{4})-(\d{2})-(\d{2})(T(\d{2}:){2}\d{2}.*)/;
export const YEAR_PATTERN = /(^\d{4}$)/;
export const DIGIT3_PATTERN = /(^\d{1,3}$)/;
export const DIGIT4_WITH_PERIOD_PATTERN = /(^(([1-9](\d{1,3})?)|(([1-9](\d{1,3})?)-([1-9](\d{1,3})?)))$)/;
export const DIGIT4_WITH_PERIOD_LIST_SEPARATED = /(^(([1-9](\d{1,3})?)|(([1-9](\d{1,3})?)-([1-9](\d{1,3})?)))((,\ *(([1-9](\d{1,3})?)|(([1-9](\d{1,3})?)-([1-9](\d{1,3})?))))?)*$)/;
export const NUMERIC_PATTERN = /(^\d{1,8}$)/;
// export const VALID_REQ_STRING = /^(?!\ *$)[\wА-Яа-я.+\ \'\-]+[^\:\"\|!@$&^=~]*$/;
export const VALID_REQ_STRING = /[^\s]+/;
export const NOT_EMPTY_STRING2 = /[^\s]+/;
export const VALID_REQ_MULTIPLE_STRING = /^(?!\s*$)[\wА-Яа-я.+\s:;,\'\-]+$/;
export const INPUT_ERROR_MESSAGES = {
    required: 'Обязательное поле.',
    isUnique: [
        'Значение должно быть уникальным в пределах вершины.',
        'Значение должно быть уникальным в пределах справочника.',
    ],
    unique: "Значение должно быть уникальным.",
    pattern: 'Некорректное значение.',
    wrongDate: 'Недопустимая дата. Формат даты \'дд.мм.гггг\'.',
    minDate: 'Дата должна быть не раньше 01.01.1753.',
    maxDate: 'Дата должна быть не позже 31.12.2999.',
    // tslint:disable-next-line:max-line-length
    errorPattern: 'Запрещены символы: звёздочка (*), кавычки (\'), двоеточие (:), точка (.), вопрос (?), косая черта (/), обратная черта (\\), вертикальная черта (|), меньше (<), больше (>), возврата каретки назад (\\b), ноль (\\0), табуляция (\\t) и символы ASCII/Unicode c 1 по 31',
    default: 'Некорректное значение.'
};

export const SUCCESS_SAVE_MESSAGE_SUCCESS: IMessage = {
    type: 'success',
    title: 'Информация о сохранении: ',
    msg: 'текущие изменения успешно сохранены',
    dismissOnTimeout: SUCCESS_DISMISS_TIMEOUT,
};
