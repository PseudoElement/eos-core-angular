 import { E_FIELD_TYPE } from 'eos-dictionaries/interfaces';
import { USER_CL } from 'eos-rest';
import { NodeDocsTree } from '../list-docs-tree/node-docs-tree';

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
    uniqueInDict?: boolean;
    hideLabel?: boolean;
    forNode?: boolean;
    options?: ISelectOptionControl[];
    disabled?: boolean;
    data?: any;
}

export interface IInputParamControlForIndexRight {
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
      uniqueInDict?: boolean;
      hideLabel?: boolean;
      forNode?: boolean;
      options?: ISelectOptionControl[];
      disabled?: boolean;
      data?: any;
  }

export interface ISelectOptionControl {
    value: string | number;
    title: string;
}

export interface IParamUserCl extends USER_CL {
    DUE_DEP_NAME?: string;
    isTechUser?: boolean;
    isAccessDelo?: boolean;
    ACCESS_SYSTEMS?: string[];
}
export interface IListDocsTree {
    DUE: string;
    label: string;
    isAllowed: boolean;
    children: NodeDocsTree[];
    parent: NodeDocsTree;
    layer: number;
}

export interface INodeDocsTreeCfg {
    due: string;
    label: string;
    allowed?: boolean;
    data?: any;
    viewAllowed?: boolean;
    flagCheckNode?: any;
}

export interface NpUserLinks {
    CLASSIF_NAME?: string;
    ISN_LINK?: number;
    CHECKED?: boolean;
    ACTION?: string;
}
export interface IUserSetChanges {
    isChange: boolean;
    disableSave?: boolean;
}


export interface SertsBase {
    sing_mail: string;
    enc_mail: string;
    sing_mail_origin: string;
    enc_mail_origin: string;
    id_sing: string;
    id_enc: string;
    id_sing_origin: string;
    id_enc_origin: string;
}

export interface IGetUserCfg {
    expand?: string;
    isn_cl?: number;
}
