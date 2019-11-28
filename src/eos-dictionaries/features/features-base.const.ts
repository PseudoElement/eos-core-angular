import { IOESDictsFeatures } from './features.interface';

export const FeaturesBase: IOESDictsFeatures = Object.assign({}, <IOESDictsFeatures>{
    version: 'Base',
    dictionaries: {
        departments: {
            numcreation: false,
        },
    },
});
