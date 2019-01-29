import { IInputParamControl } from 'eos-user-params/shared/intrfaces/user-parm.intterfaces';

export abstract class BaseParamAbstractDescriptor {
    abstract fillValueInputField(fields: IInputParamControl[], isDisables?: boolean): void;
    abstract fillValueControlField(fields: IInputParamControl[], isDisables?: boolean): void;
    abstract fillValueAccessField(fields: IInputParamControl[], isDisables?: boolean): void;

    protected _dateToString(date: Date) { // 2018-10-29T00:00:00
        return `${date.getFullYear()}-${this._pad(date.getMonth() + 1)}-${this._pad(date.getDate())}T00:00:00`;
    }
    protected _disableForm(fields: IInputParamControl[]): void {
        fields.forEach((node: IInputParamControl) => {
            node['disabled'] = true;
            node['readonly'] = true;
        });
    }
    private _pad(n: number): string {
        return n < 10 ? '0' + n : '' + n;
    }
}
