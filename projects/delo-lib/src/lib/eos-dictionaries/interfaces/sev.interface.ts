import { E_FIELD_TYPE } from '../../eos-dictionaries/interfaces';

export interface IInputParamControl {
  controlType: E_FIELD_TYPE;
  key?: string;
  value?: any;
  dict?: string;
  label?: string;
  required?: boolean;
  order?: number;
  length?: number;
  pattern?: RegExp;
  readonly?: boolean;
  isUnique?: boolean;
  unique?: boolean;
  uniqueInDict?: boolean;
  hideLabel?: boolean;
  forNode?: boolean;
  options?: ISelectOptionControl[];
  disabled?: boolean;
  data?: any;
  deleted?: boolean;
  viewToAuthorized?: boolean; // данный флаг показывает будет поле отображаться в окне
  optionBtn?: boolean; // флаг который говорит что эта таблица будет с снопками
  checkBoxAll?: boolean; // указывает что в департаменте есть чекбокс "За всех"
  onlyDL?: boolean; // можно добавлять только ДЛ
}

export interface ISelectOptionControl {
  value: string | number;
  title: string;
  disabled?: boolean;
}
