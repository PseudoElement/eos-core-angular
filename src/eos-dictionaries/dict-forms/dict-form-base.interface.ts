export interface IDictFormBase {
    doSave(): Promise<boolean>;
    hasChanges(): boolean;
}
