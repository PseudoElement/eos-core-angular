import { IOESDictsFeatures } from './features.interface';

export const FeaturesBase = Object.assign({}, <IOESDictsFeatures>{
    version: 'Base',
    departments: {
        numcreation: false,
    },
    docgroups: {
        templates: {
            N: false,
            E: false,
            F: false,
        },
    }

});
