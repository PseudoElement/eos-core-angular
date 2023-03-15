import { IDictionaryDescriptor } from "../../../eos-dictionaries/interfaces";
import { COMMON_FIELD_NAME } from "./_common";
import { LINEAR_TEMPLATE } from "./_linear-template";

export const ADDRESS_VID_CL: IDictionaryDescriptor = Object.assign({}, LINEAR_TEMPLATE, {
    id: 'address-vid',
    apiInstance: 'ADDRESS_VID_CL',
    title: 'Типы адреса',
    visible: true,
    fields: [...LINEAR_TEMPLATE.fields,
        Object.assign({}, COMMON_FIELD_NAME, {
            length: 64,
        }),
    ],
});