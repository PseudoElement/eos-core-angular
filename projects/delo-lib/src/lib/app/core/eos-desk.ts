import { IDeskItem } from './desk-item.interface';

export interface IDesk {
    id: string;
    name: string;
    references: IDeskItem[];
}

export class EosDesk implements IDesk {
    id: string;
    name: string;
    references: IDeskItem[];
    edited: boolean;

    constructor(data: any) {
        Object.assign(this, data);
    }
}
