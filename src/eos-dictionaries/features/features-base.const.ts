import { IOESDictsFeatures } from './features.interface';

export const FeaturesBase: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'Base',
    departments: {
        numcreation: false,
        reestr_send: false,
        gas_ps: false,
    },
    docgroups: {
        templates: {
            N: false,
            E: false,
            F: false,
            D: true,
            validMask: /\{2|A|B|C|D|2#|3#|@}|@2\}/,
            invalidText: 'Обязательные элементы: {2}, {A}, {B}, {C}, {D}, {2#}, {3#}, {@}, {@2}',
        },
    }

});
