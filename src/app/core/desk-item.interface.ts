export enum DeskItemVisibleType {
    enabled = 0,
    disabled = 1,
}
export interface IDeskItem {
    url: string;
    title: any;
    iconName?: string;
    linkType?: DeskItemVisibleType; // Для отображения прав доступа к справочникам
    /* fullTitle: string; */
}
