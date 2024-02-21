import { Injectable } from '@angular/core';

import { StringInput } from '../../eos-common/core/inputs/string-input';
import { TextInput } from '../../eos-common/core/inputs/text-input';
import { DropdownInput } from '../../eos-common/core/inputs/select-input';
import { CheckboxInput } from '../../eos-common/core/inputs/checkbox-input';
import { DateInput } from '../../eos-common/core/inputs/date-input';
import { E_FIELD_TYPE } from '../interfaces';
import { GENDERS, REPLACE_FIELDS } from '../consts/dictionaries/department.consts';
import { EMAIL, NOT_EMPTY_STRING } from '../consts/input-validation';
import { CABINET_FOLDERS } from '../consts/dictionaries/cabinet.consts';
import { ButtonsInput } from '../../eos-common/core/inputs/buttons-input';
import { DictionaryDescriptorService } from '../core/dictionary-descriptor.service';
import { EosBroadcastChannelService } from './eos-broadcast-channel.service';
import { MAIL_FORMATS } from '../consts/dictionaries/contact.consts';
import { ToggleInput } from '../../eos-common/core/inputs/toggle-input';
import { NumberIncrementInput } from '../../eos-common/core/inputs/number-increment-input';
import { RadioInput } from '../../eos-common/core/inputs/radio-input';
import { EosDictService } from './eos-dict.service';
import { DictionaryOverrideService } from '../../eos-rest';


@Injectable()
export class EosDataConvertService {

    constructor(
        private _dictOverrideSrv: DictionaryOverrideService,
        private dctSrv: EosDictService
    ) {

    }
    static listToCommaList(list: string[]): string {
        if (!list || list.length === 0) {
            return null;
        }
        return list.join(', ') + '.';
    }


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
        console.log('getInputs_chanelSrv', channelSrv)
        if (fieldsDescription) {
            Object.keys(fieldsDescription).forEach((_dict) => {
                let descr = fieldsDescription[_dict];
                switch (_dict) {
                    case 'fict':
                    case 'PARE_LINK_Ref':
                    case 'DG_FILE_CONSTRAINT_List':
                    case 'DOC_DEFAULT_VALUE_List':
                    case 'rec':
                        descr = fieldsDescription[_dict];
                        Object.keys(descr).forEach((_key) => {
                            switch (descr[_key].type) {
                                case E_FIELD_TYPE.select2:
                                    inputs[_dict + '.' + _key] = new DropdownInput({
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
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
                                        // password: descr[_key].password,
                                        options: descr[_key].options,
                                        groupLabel: descr[_key].groupLabel
                                    });
                                    inputs[_dict + '.' + _key].controlType = E_FIELD_TYPE.select2;
                                    break;
                                case E_FIELD_TYPE.dictLink:
                                    inputs[_dict + '.' + _key] = new DropdownInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        required: descr[_key].required,
                                        pattern: descr[_key].pattern,
                                        isUnique: descr[_key].isUnique,
                                        uniqueInDict: descr[_key].uniqueInDict,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey]
                                            || descr[_key].default,
                                        // length: descr[_key].length,
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
                                        // password: descr[_key].password,
                                        options: descr[_key].options,
                                        groupLabel: descr[_key].groupLabel
                                    });
                                    inputs[_dict + '.' + _key].controlType = E_FIELD_TYPE.dictLink;
                                    break;

                                case E_FIELD_TYPE.numberIncrement:
                                    inputs[_dict + '.' + _key] = new NumberIncrementInput({
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
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
                                        maxValue: descr[_key].maxValue,
                                        minValue: descr[_key].minValue,
                                    });
                                    break;
                                case E_FIELD_TYPE.number:
                                    inputs[_dict + '.' + _key] = new StringInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        required: descr[_key].required,
                                        pattern: descr[_key].pattern,
                                        isUnique: descr[_key].isUnique,
                                        uniqueInDict: descr[_key].uniqueInDict,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey] === void 0 ? descr[_key].default :
                                            data[_dict][descr[_key].foreignKey],
                                        length: descr[_key].length,
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
                                        password: descr[_key].password,
                                        groupLabel: descr[_key].groupLabel,
                                        maxValue: descr[_key].maxValue,
                                        minValue: descr[_key].minValue,
                                    });
                                    break;
                                case E_FIELD_TYPE.string:
                                    inputs[_dict + '.' + _key] = new StringInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        required: descr[_key].required,
                                        pattern: descr[_key].pattern,
                                        isUnique: descr[_key].isUnique,
                                        uniqueInDict: descr[_key].uniqueInDict,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey] === void 0 ? descr[_key].default :
                                            data[_dict][descr[_key].foreignKey],
                                        length: descr[_key].length,
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
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
                                                            inputs[_dict + '.' + _dataKey] = new DropdownInput({
                                                                key: _dict + '.' + descr[_dataKey].foreignKey,
                                                                label: descr[_dataKey].title,
                                                                options: descr[_dataKey].options,
                                                                required: descr[_dataKey].required,
                                                                forNode: descr[_dataKey].forNode,
                                                                value: data[_dict][descr[_key].foreignKey] === void 0 ? descr[_key].default :
                                                                    data[_dict][descr[_key].foreignKey],
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
                                        pattern: descr[_key].pattern,
                                    });
                                    break;
                                case E_FIELD_TYPE.toggle:
                                    inputs[_dict + '.' + _key] = new ToggleInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        forNode: descr[_key].forNode,
                                        value: !!data[_dict][descr[_key].foreignKey],
                                        disabled: !editMode,
                                    });
                                    break;
                                case E_FIELD_TYPE.boolean:
                                    inputs[_dict + '.' + _key] = new CheckboxInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        formatDbBinary: descr[_key].formatDbBinary,
                                        forNode: descr[_key].forNode,
                                        value: _key !== 'PRJ_AUTO_REG' ? !!data[_dict][descr[_key].foreignKey] : data[_dict][descr[_key].foreignKey] === 2,
                                        disabled: _key !== 'PRJ_AUTO_REG' ? !editMode : data[_dict][descr[_key].foreignKey] === 0,
                                    });
                                    break;
                                case E_FIELD_TYPE.radio:
                                    inputs[_dict + '.' + _key] = new RadioInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict] ? data[_dict][descr[_key].foreignKey] : null,
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
                                        options: descr[_key].options,
                                    });
                                    break;
                                case E_FIELD_TYPE.select:
                                    inputs[_dict + '.' + _key] = new DropdownInput({
                                        key: _dict + '.' + descr[_key].foreignKey,
                                        label: descr[_key].title,
                                        options: descr[_key].options,
                                        hideLabel: !(descr[_key].title),
                                        length: descr[_key].length,
                                        required: descr[_key].required,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict] && data[_dict][descr[_key].foreignKey] ?
                                            data[_dict][descr[_key].foreignKey] :
                                            (descr[_key].default === undefined ? null : descr[_key].default),
                                        readonly: descr[_key].readonly,
                                        disabled: descr[_key].readonly || !editMode,
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
                                        required: descr[_key].required,
                                        label: descr[_key].title,
                                        forNode: descr[_key].forNode,
                                        value: data[_dict][descr[_key].foreignKey],
                                        disabled: !editMode,
                                    });
                                    break;
                            }
                            const i = inputs[_dict + '.' + _key];
                            if (i) {
                                i.descriptor = descr[_key];
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
                            length: 255,
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
                                length: 255,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DUTY_DP'] = new StringInput({
                                key: 'printInfo.DUTY_DP',
                                label: 'Дательный падеж (кому, чему?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_DP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 255,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DUTY_VP'] = new StringInput({
                                key: 'printInfo.DUTY_VP',
                                label: 'Винительный падеж (кого, что?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DUTY_VP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 255,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PRINT_SURNAME_DP'] = new StringInput({
                                key: 'printInfo.PRINT_SURNAME_DP',
                                label: 'Фамилия И.О. в дательном падеже',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_SURNAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PRINT_SURNAME'] = new StringInput({
                                key: 'printInfo.PRINT_SURNAME',
                                label: 'И.О. Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['PRINT_SURNAME'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_RP'] = new StringInput({
                                key: 'printInfo.SURNAME_RP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_RP'],
                                pattern: NOT_EMPTY_STRING,
                                hideLabel: true,
                                length: 64,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_RP'] = new StringInput({
                                key: 'printInfo.NAME_RP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_RP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_RP'] = new StringInput({
                                key: 'printInfo.PATRON_RP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_RP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_DP'] = new StringInput({
                                key: 'printInfo.SURNAME_DP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_DP'] = new StringInput({
                                key: 'printInfo.NAME_DP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_DP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_DP'] = new StringInput({
                                key: 'printInfo.PATRON_DP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_DP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_VP'] = new StringInput({
                                key: 'printInfo.SURNAME_VP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_VP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_VP'] = new StringInput({
                                key: 'printInfo.NAME_VP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_VP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_VP'] = new StringInput({
                                key: 'printInfo.PATRON_VP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_VP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_TP'] = new StringInput({
                                key: 'printInfo.SURNAME_TP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_TP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_TP'] = new StringInput({
                                key: 'printInfo.NAME_TP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_TP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_TP'] = new StringInput({
                                key: 'printInfo.PATRON_TP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_TP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.SURNAME_PP'] = new StringInput({
                                key: 'printInfo.SURNAME_PP',
                                label: 'Фамилия',
                                dict: 'printInfo',
                                value: data['printInfo']['SURNAME_PP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.NAME_PP'] = new StringInput({
                                key: 'printInfo.NAME_PP',
                                label: 'Имя',
                                dict: 'printInfo',
                                value: data['printInfo']['NAME_PP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
                                hideLabel: true,
                                disabled: !editMode,
                            });
                            inputs['printInfo.PATRON_PP'] = new StringInput({
                                key: 'printInfo.PATRON_PP',
                                label: 'Отчество',
                                dict: 'printInfo',
                                value: data['printInfo']['PATRON_PP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 64,
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
                                length: 255,
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
                                length: 255,
                                disabled: !editMode,
                            });
                            inputs['printInfo.DEPARTMENT_RP'] = new StringInput({
                                key: 'printInfo.DEPARTMENT_RP',
                                label: 'Наименование подразделения в родительном падеже (чего?)',
                                dict: 'printInfo',
                                value: data['printInfo']['DEPARTMENT_RP'],
                                pattern: NOT_EMPTY_STRING,
                                length: 255,
                                disabled: !editMode,
                            });
                        }
                        break;
                    case 'folders':
                        CABINET_FOLDERS.forEach (cf => {
                            const folder = data['rec']['FOLDER_List'].find( f => f.FOLDER_KIND === cf.key);
                            const path = 'rec.FOLDER_List[' + (cf.key - 1) + '].USER_COUNT';
                            const label = cf;
                            const value = folder ? !!folder.USER_COUNT : false;
                            // const label = CABINET_FOLDERS.find((cf) => cf.key === folder.FOLDER_KIND);

                            inputs[path] = new CheckboxInput({
                                key: path,
                                label: label ? label.title : '',
                                value: value,
                                disabled: !editMode,
                            });

                        });
                        break;
                    case 'replace':
                        REPLACE_FIELDS.forEach(field => {
                            const val = data[_dict] && data[_dict][field.key];
                            switch (field.type) {
                                case 'string':
                                    inputs[`${_dict}.${field.key}`] = new StringInput({
                                        key: `${_dict}.${field.key}`,
                                        label: field.title,
                                        // pattern: field.pattern,
                                        value: val ? val : '',
                                        // length: descr[_key].length,
                                        disabled: field.disabled,
                                    });
                                    break;
                                case 'date':
                                    inputs[`${_dict}.${field.key}`] = new DateInput({
                                        key: `${_dict}.${field.key}`,
                                        label: field.title,
                                        value: val ? val : null,
                                    });
                                    break;
                                case 'select':
                                    inputs[`${_dict}.${field.key}`] = new DropdownInput({
                                        key: `${_dict}.${field.key}`,
                                        label: field.title,
                                        value: val ? val : field.default,
                                        options: field.options || [],
                                    });
                                    break;
                                case 'text':
                                    inputs[`${_dict}.${field.key}`] = new TextInput({
                                        key: `${_dict}.${field.key}`,
                                        label: field.title,
                                        disabled: field.disabled,
                                        length: field.length,
                                        value: val ? val : '',
                                    });
                                    break;
                            }
                        });
                        break;
                    case 'extensions':
                        // формируем доп поля для справочников
                        this._dictOverrideSrv.getFieldsForInputs(inputs, data, this.dctSrv.currentDictionary.id, editMode);
                        break;
                }
            });
        }
        // console.warn('generated inputs', inputs);
        return inputs;
    }

    convData(data: any) {
        const result = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                result[key] = element;
            }
        }
        return { rec: result };
    }
}
