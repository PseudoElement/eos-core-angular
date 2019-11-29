import { IOESDictsFeatures } from './features.interface';

export const FeaturesBase: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'Base',
    departments: {
        numcreation: false,
        reestr_send: false,
    },
    docgroups: {
        templates: {
            N: false,
            E: false,
            F: false,
        },
    }

});
