import { EosDictionaryNode } from '../core/eos-dictionary-node';

export interface HintConfiguration {
    top?: number;
    left?: number;
    text?: string;
    show: boolean;
    node: EosDictionaryNode;
}
