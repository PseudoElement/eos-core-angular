import { Injectable } from '@angular/core';

import { StringInput } from 'eos-common/core/inputs/string-input';
import { TextInput } from 'eos-common/core/inputs/text-input';
import { DropdownInput } from 'eos-common/core/inputs/select-input';
import { CheckboxInput } from 'eos-common/core/inputs/checkbox-input';
import { DateInput } from 'eos-common/core/inputs/date-input';
import { E_FIELD_TYPE } from '../interfaces';
import { GENDERS } from '../consts/dictionaries/department.consts';
import { EMAIL, NOT_EMPTY_STRING } from '../consts/input-validation';
import { CABINET_FOLDERS } from '../consts/dictionaries/cabinet.consts';
import { ButtonsInput } from 'eos-common/core/inputs/buttons-input';
import {EosDictionary} from '../core/eos-dictionary';
import {DictionaryDescriptorService} from '../core/dictionary-descriptor.service';
import {EosBroadcastChannelService} from './eos-broadcast-channel.service';
import { MAIL_FORMATS } from '../consts/dictionaries/contact.consts';

@Injectable()
export class EosDataConvertService {
    // Todo: get from a remote source of question metadata
    // Todo: make asynchronous
    // todo: refactor, remove hardcode, move into record description class
    /**
     * convert fields description and data in same object
     * but with Input for use it in dynamic form
     * @param fieldsDescription node fields description
     * @param data node data
     */
    getInputs(
            fieldsDescription: any[],
            data: any, editMode = true,
            dictSrv?: DictionaryDescriptorService,
            channelSrv?: EosBroadcastChannelService
    ) {
        const inputs: any = {};
        if (fieldsDescription) {
            Object.keys(fieldsDescription).forEach((_dict) => {
                const descr = fieldsDescription[_dict];
                switch (_dict) {
                    case 'rec':
                        Object.keys(descr).forEach((_key) => {
                            switch (descr[_key].type) {
                                case E_FIELD_TYPE.number:
                                case E_FIELD_TYPE.string:
                                    inputs[_dict + '.' + _key] = new StringInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        required: descr[_key].required,
                                        pattern: descr[_key].pattern,
                                        isUnique: descr[_key].isUnique,
                                        uniqueInDict: descr[_key].uniqueInDict,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey]
                                            || descr[_key].default,
                                        length: descr[_key].length,
                                        disabled: !editMode,
                                        password: descr[_key].password,
                                        groupLabel: descr[_key].groupLabel
                                    });
                                    break;
                                case E_FIELD_TYPE.xml:
                                    channelSrv.parseXml(data[_dict][descr[_key].foreignKey])
                                        .then(_data => {
                                            if (!_data) {
                                                return;
                                            }
                                            Object.keys(_data).forEach((_dataKey) => {
                                                if (descr[_dataKey] !== undefined) {
                                                    data[_dict][_dataKey] = _data[_dataKey];
                                                    switch (descr[_dataKey].type) {
                                                        case E_FIELD_TYPE.number:
                                                        case E_FIELD_TYPE.string:
                                                            inputs[_dict + '.' + _dataKey] = new StringInput({
                                                                key: _dict + '.' + descr[_dataKey].foreignKey,
                                                                label: descr[_dataKey].title,
                                                                required: descr[_dataKey].required,
                                                                pattern: descr[_dataKey].pattern,
                                                                isUnique: descr[_dataKey].isUnique,
                                                                uniqueInDict: descr[_dataKey].uniqueInDict,
                                                                forNode: descr[_dataKey].forNode,
                                                                value: data[_dict][descr[_dataKey].foreignKey]
                                                                || descr[_dataKey].default,
                                                                length: descr[_dataKey].length,
                                                                disabled: !editMode,
                                                                password: descr[_dataKey].password,
                                                                groupLabel: descr[_dataKey].groupLabel
                                                            });
                                                            break;
                                                        case E_FIELD_TYPE.select:
                                                            const options = [];
                                                            options.push(...descr[_dataKey].options);
                                                            inputs[_dict + '.' + _dataKey] = new DropdownInput({
                                                                key: _dict + '.' + descr[_dataKey].foreignKey,
                                                                label: descr[_dataKey].title,
                                                                options: options,
                                                                required: descr[_dataKey].required,
                                                                forNode: descr[_dataKey].forNode,
                                                                value: data[_dict][descr[_dataKey].foreignKey]
                                                                || descr[_dataKey].default,
                                                                disabled: !editMode,
                                                            });
                                                            break;
                                                    }
                                                }
                                            });
                                    });
                                    break;
                                case E_FIELD_TYPE.text:
                                    inputs[_dict + '.' + _key] = new TextInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        required: descr[_key].required,
                                        height: descr[_key].height,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey],
                                        length: descr[_key].length,
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.boolean:
                                    inputs[_dict + '.' + _key] = new CheckboxInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        forNode: descr[_key].forNode,
                                        value: !!data[_dict][descr[_key].foreignKey],
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.select:
                                    const options = descr[_key].options;

                                    if (descr[_key].dictionaryId !== undefined) {
                                        const dict = new EosDictionary(descr[_key].dictionaryId, dictSrv);
                                        dict.init()
                                            .then(() => {
                                                dict.nodes.forEach((node) => {
                                                    if (node.id) {
                                                        options.push(...[{value: node.originalId, title: node.title}]);
                                                    }
                                                });
                                            });
                                    }
                                    inputs[_dict + '.' + _key] = new DropdownInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        options: options,
                                        hideLabel: !(descr[_key].title),
                                        required: descr[_key].required,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey]
                                            || descr[_key].default,
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.buttons:
                                    inputs[_dict + '.' + _key] = new ButtonsInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        options: descr[_key].options,
                                        required: descr[_key].required,
                                        hideLabel: !(descr[_key].title),
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey]
                                            || descr[_key].default,
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.date:
                                    inputs[_dict + '.' + _key] = new DateInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey],
                                        disabled: !editMode,
                                    });
                                    break;
                            }
                        });
                        break;
                    case 'sev':
                        inputs['sev.GLOBAL_ID'] = new StringInput({
                            key: 'sev.GLOBAL_ID',
                            label: 'Индекс СЭВ',
                            dict: 'sev',
                            value: data['sev'] ? data['sev']['GLOBAL_ID'] : null,
                            pattern: NOT_EMPTY_STRING,
                            disabled: !editMode,
                        });
                        break;
                    case 'contact':
                        for (let i = 0; i < data.contact.length; i++) {
                            inputs['contact[' + i + '].E_MAIL'] = new StringInput({
                                key: 'contact[' + i + '].E_MAIL',
                                label: 'Адрес e-mail',
                                dict: 'contact',
                                value: data.contact[i] ? data.contact[i].E_MAIL : null,
                                pattern: EMAIL,
                                disabled: !editMode
                            });
                            inputs['contact[' + i + '].ENCRYPT_FLAG'] = new CheckboxInput({
                                key: 'contact[' + i + '].ENCRYPT_FLAG',
                                label: 'Требуется шифрование',
                                forNode: 'contact[' + i + '].ENCRYPT_FLAG',
                                value: data.contact[i].ENCRYPT_FLAG !== 0,
                                disabled: !editMode,
                            });
                            inputs['contact[' + i + '].EDS_FLAG'] = new CheckboxInput({
                                key: 'contact[' + i + '].EDS_FLAG',
                                label: 'Требуется ЭП',
                                forNode: 'contact[' + i + '].EDS_FLAG',
                                value: data.contact[i].EDS_FLAG !== 0,
                                disabled: !editMode,
                            });
                            inputs['contact[' + i + '].ID_CERTIFICATE'] = new StringInput({
                                key: 'contact[' + i + '].ID_CERTIFICATE',
                                label: 'Cертификат',
                                dict: 'contact',
                                value: data.contact[i] ? data.contact[i].ID_CERTIFICATE : null,
                                disabled: !editMode
                            });

                            inputs['contact[' + i + '].MAIL_FORMAT'] = new ButtonsInput({
                                key: 'contact[' + i + '].MAIL_FORMAT',
                                label: 'В формате',
                                dict: 'contact',
                                value: data.contact[i].MAIL_FORMAT,
                                // options: fieldsDescription['printInfo']['GENDER'].options,
                                options: MAIL_FORMATS,
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['contact[' + i + '].NOTE'] = new StringInput({
                                key: 'contact[' + i + '].NOTE',
                                label: 'Примечание',
                                dict: 'contact',
                                value: data.contact[i] ? data.contact[i].NOTE : null,
                                disabled: !editMode
                            });
                            // inputs['contact[' + i + '].email'] = new StringInput({
                            //     key: 'contact[' + i + '].email',
                            //     label: 'Адрес e-mail',
                            //     dict: 'contact',
                            //     value: data.contact[i] ? data.contact[i].email : null,
                            //     pattern: EMAIL,
                            //     disabled: !editMode
                            // });
                        }
                        break;
                    case 'printInfo':
                        if (data.rec['IS_NODE'] === 1) { // person
                            inputs['printInfo.GENDER'] = new ButtonsInput({
                                key: 'printInfo.GENDER',
                                label: 'Пол',
                                dict: 'printInfo',
                                value: data['printInfo']['GENDER'],
                                // options: fieldsDescription['printInfo']['GENDER'].options,
                                options: GENDERS,
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME'] = new StringInput({
                                key: 'printInfo.SURNAME',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME'] = new StringInput({
                                key: 'printInfo.NAME',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON'] = new StringInput({
                                key: 'printInfo.PATRON',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DUTY_RP'] = new StringInput({
                                key: 'printInfo.DUTY_RP',
                                label: 'Родительный падеж (кого, чего)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_RP'],
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DUTY_DP'] = new StringInput({
                                key: 'printInfo.DUTY_DP',
                                label: 'Дательный падеж (кому, чему?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_DP'],
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DUTY_VP'] = new StringInput({
                                key: 'printInfo.DUTY_VP',
                                label: 'Винительный падеж (кого, что?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_VP'],
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PRINT_SURNAME_DP'] = new StringInput({
                                key: 'printInfo.PRINT_SURNAME_DP',
                                label: 'Фамилия И.О. в дательном падеже',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_SURNAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PRINT_SURNAME'] = new StringInput({
                                key: 'printInfo.PRINT_SURNAME',
                                label: 'И.О. Фамилия в дательном падеже',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_SURNAME'],
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_RP'] = new StringInput({
                                key: 'printInfo.SURNAME_RP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_RP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_RP'] = new StringInput({
                                key: 'printInfo.NAME_RP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_RP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_RP'] = new StringInput({
                                key: 'printInfo.PATRON_RP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_RP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_DP'] = new StringInput({
                                key: 'printInfo.SURNAME_DP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_DP'] = new StringInput({
                                key: 'printInfo.NAME_DP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_DP'] = new StringInput({
                                key: 'printInfo.PATRON_DP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_DP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_VP'] = new StringInput({
                                key: 'printInfo.SURNAME_VP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_VP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_VP'] = new StringInput({
                                key: 'printInfo.NAME_VP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_VP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_VP'] = new StringInput({
                                key: 'printInfo.PATRON_VP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_VP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_TP'] = new StringInput({
                                key: 'printInfo.SURNAME_TP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_TP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_TP'] = new StringInput({
                                key: 'printInfo.NAME_TP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_TP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_TP'] = new StringInput({
                                key: 'printInfo.PATRON_TP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_TP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_PP'] = new StringInput({
                                key: 'printInfo.SURNAME_PP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_PP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_PP'] = new StringInput({
                                key: 'printInfo.NAME_PP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_PP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_PP'] = new StringInput({
                                key: 'printInfo.PATRON_PP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_PP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PRINT_DUTY'] = new StringInput({
                                key: 'printInfo.PRINT_DUTY',
                                label: 'Должность',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_DUTY'],
                                pattern: NOT_EMPTY_STRING,
                                length: 255,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PRINT_DEPARTMENT'] = new StringInput({
                                key: 'printInfo.PRINT_DEPARTMENT',
                                label: 'Подразделение',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_DEPARTMENT'],
                                pattern: NOT_EMPTY_STRING,
                                disabled: !editMode,
                            });
                        } else { // department
                            inputs['printInfo.NOT_USE_IN_DUTY'] = new CheckboxInput({
                                key: 'printInfo.NOT_USE_IN_DUTY',
                                label: 'Не использовать подразделение в названии должности',
                                dict: 'printInfo',
                                value: data['printInfo']['NOT_USE_IN_DUTY'],
                                disabled: !editMode,
                                pattern: NOT_EMPTY_STRING,
                            });
                            inputs['printInfo.PRINT_DEPARTMENT'] = new TextInput({
                                key: 'printInfo.PRINT_DEPARTMENT',
                                label: 'Полное наименование подразделения',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_DEPARTMENT'],
                                pattern: NOT_EMPTY_STRING,
                                length: 2000,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DEPARTMENT_RP'] = new StringInput({
                                key: 'printInfo.DEPARTMENT_RP',
                                label: 'Наименование подразделения в родительном падеже (чего?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DEPARTMENT_RP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 248,
                                disabled: !editMode,
                            });
                        }
                        break;
                    case 'folders':
                        data['rec']['FOLDER_List'].forEach((folder) => {
                            const path = 'rec.FOLDER_List[' + (folder.FOLDER_KIND - 1) + '].USER_COUNT';
                            const label = CABINET_FOLDERS.find((cf) => cf.key === folder.FOLDER_KIND);

                            inputs[path] = new CheckboxInput({
                                key: path,
                                label: label ? label.title : '',
                                value: !!folder.USER_COUNT,
                                disabled: !editMode,
                            });
                        });
                        break;
                }

            });

        }
        // console.warn('generated inputs', inputs);
        return inputs;
    }
}
