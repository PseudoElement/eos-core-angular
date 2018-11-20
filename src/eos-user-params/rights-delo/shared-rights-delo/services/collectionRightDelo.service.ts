import { PASS_STOP_LIST } from 'eos-rest';

export interface ICollectionRightDeloList extends PASS_STOP_LIST {
    marked: boolean;
    isSelected: boolean;
    selectedMark: boolean;
}
