import { IDictionaryDescriptor } from '../../../eos-dictionaries/interfaces';
import { LINEAR_TEMPLATE } from './_linear-template';
import { ISelectOption } from '../../../eos-common/interfaces';
import { COMMON_FIELD_NAME, COMMON_FIELD_NOTE } from './_common';
import { Features } from '../../../eos-dictionaries/features/features-current.const';
import { EOSDICTS_VARIANT } from '../../../eos-dictionaries/features/features.interface';

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

const LIST_BY_VARIANT = Features.cfg.variant === EOSDICTS_VARIANT.Nadzor ? ['IS_FINAL', 'STATUS'] : [];

export const VISA_TYPE_DICT: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'visa-type',
    apiInstance: 'VISA_TYPE_CL',
    title: 'Типы виз',
    actions: LINEAR_TEMPLATE.actions.concat(['tableCustomization']),
    visible: true,
    iconName: 'eos-adm-icon-visa-blue',
    fields: LINEAR_TEMPLATE.fields.concat([
        Object.assign({}, COMMON_FIELD_NOTE,
        {
            length: 255,
        }),
        Object.assign({}, COMMON_FIELD_NAME,
        {
            isUnique: true,
            uniqueInDict: true,
            length: 64,
        }),
        ... Features.cfg.variant === EOSDICTS_VARIANT.Nadzor ? [
            {
                key: 'IS_FINAL',
                type: 'boolean',
                title: 'Является финальной',
            }, {
                key: 'STATUS',
                type: 'select',
                title: 'Статус визы',
                options: STATUS_OPTIONS,
                required: true,
            }] : []
        ]),
    quickViewFields: ['NOTE',
        ... LIST_BY_VARIANT,
    ],
    allVisibleFields: ['NOTE',
        ... LIST_BY_VARIANT,
    ],
    editFields: ['CLASSIF_NAME', 'NOTE',
        ... LIST_BY_VARIANT,
    ]
});
