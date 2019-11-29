import { RecordDescriptor } from './record-descriptor';
import { ALL_ROWS } from 'eos-rest/core/consts';
import { AbstractDictionaryDescriptor } from './abstract-dictionary-descriptor';
import { ITreeDictionaryDescriptor } from 'eos-dictionaries/interfaces';
import { EosDictionaryNode } from './eos-dictionary-node';

export class CitizenDescriptor extends RecordDescriptor {
    dictionary: CitizensDictionaryDescriptor;
    fullSearchFields: any;
    isSlised: false;
    constructor(dictionary: CitizensDictionaryDescriptor, descriptor: ITreeDictionaryDescriptor, ) {
        super(dictionary, descriptor);
        this.dictionary = dictionary;
        this._initFieldSets([
            'fullSearchFields',
        ], descriptor);
    }
}
export class CitizensDictionaryDescriptor extends AbstractDictionaryDescriptor {
    record: CitizenDescriptor;
    public addRecord(data: any, _useless: any, isProtected = false, isDeleted = false): Promise<any> {
        return Promise.resolve();
    }
    public hasCustomTree() {
        return false;
    }
    public hasTemplateTree() {
        return true;
    }
    public extendCritery(critery, { mode, deleted }, selectedNode) {
        return super.extendCritery(critery, { mode, deleted }, selectedNode);
    }

    public getRoot() {
        return this.getData({
            CITIZEN: ALL_ROWS
        });
    }
    public updateRecord(originalData, updates, appendToChanges): Promise<any> {
        return super.updateRecord(originalData, updates, appendToChanges);
    }
    public getTemplateTree(data): Promise<any> {
        return Promise.resolve([]);
    }
    public getChildren(): Promise<any[]> {
        return this.getData();
    }

    public getSubtree(): Promise<any[]> {
        return Promise.resolve([]);
    }
    public onPreparePrintInfo(): Promise<any> {
        return Promise.reject('Type of dictionary not true!');
    }
    public cutNode(node?: EosDictionaryNode): void {
        console.log(this);
    }
    protected _initRecord(data: ITreeDictionaryDescriptor) {
        this.record = new CitizenDescriptor(this, data);
    }
}
