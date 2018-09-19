import { IBaseParameters } from '../interfaces/parameters.interfaces';

export const PRJ_RC_PARAM: IBaseParameters = {
    id: 'prj-rc',
    apiInstance: 'USER_PARMS',
    title: 'Работа с РКПД',
    fields: [
        {
            key: 'PRJ_VS_DATE_PROTECTED',
            type: 'boolean',
            title: 'Запретить редактирование даты визы и подписи'
        },
        {
            key: 'VS_SELF',
            type: 'toggle',
            title: 'Ввод виз/подписей только визирующим/подписывающим должностным лицом:'
        },
        {
            key: 'PRJ_STAGE_FILE_PROTECTED',
            type: 'select',
            title: '',
            options: [
                {value: '000000000', title: ''},
                {value: '011111111', title: 'На визировании'},
                {value: '001111111', title: 'Завизирован'},
                {value: '000111111', title: 'На подписи'},
                {value: '000011111', title: 'Подписан'},
            ]
        },
        {
            key: 'PRJ_VERSION_PROTECTED',
            type: 'boolean',
            title: 'Запретить удаление старых версий РКПД при наличии виз или подписей'
        },
        {
            key: 'PRJ_VISA_PROTECTED',
            type: 'boolean',
            title: 'Запретить удаление визирующих и подписывающих после ввода инф. о визировании и подписании'
        },
        {
            key: 'STRONG_USING_EDS_SIGN',
            type: 'boolean',
            title: 'Строгое требование установки ЭП при подписании'
        },
        {
            key: 'PRJ_STAGE_VISA_PROTECTED',
            type: 'select',
            title: '',
            options: [
                {value: '000000000', title: ''},
                {value: '011111111', title: 'На визировании'},
                {value: '001111111', title: 'Завизирован'},
                {value: '000111111', title: 'На подписи'},
                {value: '000011111', title: 'Подписан'},
            ]
        },
        {
            key: 'PRJ_STAGE_SIGN_PROTECTED',
            type: 'select',
            title: '',
            options: [
                {value: '000000000', title: ''},
                {value: '000111111', title: 'На подписи'},
                {value: '000011111', title: 'Подписан'},
            ]
        },
        {
            key: 'PRJ_BLOCK_DELETED_NUMBERS',
            type: 'boolean',
            title: 'Не использовать номера удаляемых РКПД'
        },
        {
            key: 'PRJ_REGTODAY_LIMIT',
            type: 'radio',
            title: '',
            options: [
                {value: 'CURRENT', title: 'Текущей картотекой регистратора'},
                {value: 'ALL', title: 'Множеством картотек регистратора'},
                {value: 'NO', title: 'Не ограничивать'},
            ]
        }
    ]
};
