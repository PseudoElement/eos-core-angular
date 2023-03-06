import { IBaseParameters } from '../interfaces/parameters.interfaces';
export const CONVERSION_PARAM: IBaseParameters = {
    id: 'conversion',
    apiInstance: 'USER_PARMS',
    title: 'Служба конвертации',
    fields: [
        {
            key: 'CONVERTER_USE',
            type: 'boolean',
            title: 'Использовать службу конвертации',
        },
        {
            key: 'CONVERTER_INPUT_DIR',
            type: 'string',
            readonly: true,
            length: 2000,
            title: ''
        },
        {
            key: 'CONVERTER_OUTPUT_DIR',
            type: 'string',
            readonly: true,
            length: 2000,
            title: ''
        },
        {
            key: 'CONVERTER_TEMP_DIR',
            type: 'string',
            readonly: true,
            length: 2000,
            title: ''
        },
        {
            key: 'CONVERTER_OUTPUT_SIZE',
            type: 'string',
            readonly: true,
            title: '',
            length: 255,
            pattern: /[1-9][0-9]*/
        }
    ]
};
