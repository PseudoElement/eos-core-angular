import { IDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { ISelectOption } from 'eos-common/interfaces';
import { COMMON_FIELD_NAME } from './_common';

export const STATUS_OPTIONS: ISelectOption[] = [{
    value: 'Положительный',
    title: 'Положительный',
}, {
    value: 'Отрицательный',
    title: 'Отрицательный',
}, {
    value: 'Промежуточный',
    title: 'Промежуточный',
}];

export const VISA_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'visa-type',
    apiInstance: 'VISA_TYPE_CL',
    title: 'Типы виз',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
    iconName: 'eos-icon-visa-blue',
    fields: LINEAR_TEMPLATE.fields.concat([
        Object.assign({}, COMMON_FIELD_NAME, { isUnique: true, uniqueInDict: true }),
        {
            key: 'IS_FINAL',
            type: 'boolean',
            length: 64,
            title: 'Является финальной',
        }, {
            key: 'STATUS',
            type: 'select',
            title: 'Статус визы',
            options: STATUS_OPTIONS,
            required: true,
        }]),
    quickViewFields: ['NOTE', 'IS_FINAL', 'STATUS'],  // CLASSIF_NAME is in shortQuickViewFields
    allVisibleFields: ['NOTE', 'IS_FINAL', 'STATUS'],
    editFields: ['CLASSIF_NAME', 'NOTE', 'IS_FINAL', 'STATUS', 'DELETED']
});
