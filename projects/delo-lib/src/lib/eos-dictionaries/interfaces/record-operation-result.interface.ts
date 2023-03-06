import { RestError } from '../../eos-rest/core/rest-error';

export interface IRecordOperationResult {
    record: any;
    success: boolean;
    error?: RestError;
}
