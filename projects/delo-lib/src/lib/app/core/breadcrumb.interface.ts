import { IDeskItem } from './desk-item.interface';

export interface IBreadcrumb extends IDeskItem {
    url: string;
    title: string;
    params?: any;
    data?: any;
}
