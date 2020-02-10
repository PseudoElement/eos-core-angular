import { LINEAR_TEMPLATE } from '../_linear-template';

const SEV_ACTIONS = [
    'add', 'markRecords', 'quickSearch', 'fullSearch', 'order', 'userOrder', 'restore',
    'moveUp', 'moveDown', 'navigateUp', 'navigateDown', 'showDeleted', 'tableCustomization',
    'removeHard',
    'edit', 'view', 'remove', 'removeHard', 'userOrder'];


export const SEV_LINEAR_TEMPLATE = Object.assign({}, LINEAR_TEMPLATE, {
    folder: 'SEV',
    actions: SEV_ACTIONS,
});
