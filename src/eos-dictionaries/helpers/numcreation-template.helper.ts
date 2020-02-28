
import { IEOSTPLVariant } from 'eos-dictionaries/features/features.interface';


// export const SINGLE_TEMPLATE_ITEM_EXPR = /\{@}|2#|3#\}/;
// export const ORDER_NUM_TEMPLATE_ITEM_EXPR = /\{2|@2|E\}/;


export class NumcreationTemplateHelper {
    static isTPLCorrectForRK(templateString: string, RC_TYPE: number, variant: IEOSTPLVariant): boolean {

        if (!templateString) { return true; }

        if (!variant.validationExpr.test(templateString)) {
            return false;
        }

        const rc_exclude = variant.list.filter ( v => v.possibleRKType && !v.possibleRKType.test(String(RC_TYPE)));
        for (let i = 0; i < rc_exclude.length; i++) {
            const e = rc_exclude[i];
            if (templateString.indexOf(e.key) !== -1) {
                return false;
            }

        }
        return true;
    }
}
