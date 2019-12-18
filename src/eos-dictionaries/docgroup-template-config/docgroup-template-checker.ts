import { VALID_TEMPLATE_EXPR, DOC_TEMPLATE_ELEMENTS } from './docgroup-template-config.consts';

export class DocgroupTemplateChecker {

    static shablonIsCorrect(shablon: string, RC_TYPE: number): boolean {
        if (!VALID_TEMPLATE_EXPR.test(shablon)) {
            return false;
        }

        const rc_exclude = DOC_TEMPLATE_ELEMENTS.filter ( v => v.possibleRKType && !v.possibleRKType.test(String(RC_TYPE)));
        for (let i = 0; i < rc_exclude.length; i++) {
            const e = rc_exclude[i];
            if (shablon.indexOf(e.key) !== -1) {
                return false;
            }

        }
        return true;
    }
}

