import { USERCARD, USER_CABINET, CABINET } from '../../../../eos-rest/interfaces/structures';
import { AppContext } from '../../../../eos-rest/services/appContext.service';
// import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
export class Cabinets {
    get name(): string {
        return this.cabinetInfo.CABINET_NAME;
    }
    folders = [];
    origin: USER_CABINET = null;
    data: USER_CABINET = null;
    isChanged = false;

    parent: CardsClass;
    // get stringFolders() {
    //     let str = '';
    //     let t = '';
    //     this.folders.forEach(el => {
    //         if (el['value'] === 'A' && el['selected']) {
    //             t = el['value'];
    //         } else if (el['value'] !== 'H' && el['value'] !== 'HR') {
    //             if (el['selected'] === true) {
    //                 str += el['value'];
    //             }
    //         }
    //     });
    //     return str + t;
    // }
    // get hideAccess() {
    //     if (this.folders[9].selected) {
    //         return 1;
    //     } else {
    //         return 0;
    //     }
    // }

    // get hideAccessPR() {
    //     if (this.folders[10].selected) {
    //         return 1;
    //     } else {
    //         return 0;
    //     }
    // }
    // private arrayKey = new Map()
    //     .set('Поступившие', 1)
    //     .set('На исполнении', 2)
    //     .set('На контроле', 3)
    //     .set('У руководства', 4)
    //     .set('На рассмотрении', 5)
    //     .set('В дело', 6)
    //     .set('Управление проектами', 7)
    //     .set('На визировании', 8)
    //     .set('На подписи', 9)
    //     .set('Учитывать ограничения доступа к РК по грифам и группам документов', 'H')
    //     .set('Учитывать права для работы с РКПД', 'HR');
    public cabinetInfo: CABINET;
    constructor(cabinet: CABINET, parent: CardsClass, cabinet_folders?: USER_CABINET[]) {
        this.parent = parent;
        this.cabinetInfo = cabinet;
        this.initData(cabinet_folders);
    }
    initData(folders: USER_CABINET[]) {
        const findCabinets = folders.filter((folder: USER_CABINET) => {
            return folder.ISN_CABINET === this.cabinetInfo.ISN_CABINET && this.parent.data.ISN_LCLASSIF === folder.ISN_LCLASSIF;
        });
        if (findCabinets.length) {
            this.data = { ...findCabinets[0] };
            this.origin = { ...findCabinets[0] };
        } else {
            this.data = this.initEmptyData();
        }
    }
    change() {
        if (this.origin) {
            for (const key in this.data) {
                if (this.data.hasOwnProperty(key)) {
                    const element = this.data[key];
                    if (element !== this.origin[key]) {
                        this.isChanged = true;
                        return;
                    }
                }
            }
            this.isChanged = false;
        } else {
            if (this.data.FOLDERS_AVAILABLE !== '') {
                this.isChanged = true;
                return;
            }
            this.isChanged = false;
        }
    }
    initEmptyData(): USER_CABINET {
        return {
            ISN_CABINET: this.cabinetInfo.ISN_CABINET,
            ISN_LCLASSIF: this.parent.data.ISN_LCLASSIF,
            FOLDERS_AVAILABLE: '',
            ORDER_WORK: null,
            HOME_CABINET: 0,
            HIDE_CONF_RESOL: 0,
            HIDE_INACCESSIBLE: 0,
            HIDE_INACCESSIBLE_PRJ: 0,
            IS_ASSISTANT: 0,
            DEPARTMENT_DUE: this.parent.data.DUE,
        };
    }
}

export class CardsClass {
    public cardTitle;
    public get cardName() {
        return this.cardTitle;
    }
    public set cardName(name: string) {
        this.cardTitle = name;
    }
    public deleted = false;
    public logDelet = false;
    public current = false;
    public cabinets: Cabinets[] = [];
    public data: USERCARD;
    public origin: USERCARD;
    appSrv: AppContext;
    constructor(appSrv: AppContext, card: USERCARD, isNew?: boolean) {
        this.data = card;
        this.origin = !isNew ? Object.assign({}, card) : null;
        this.appSrv = appSrv;
    }

    createCabinets({ cabinets, folders }) {
        if (cabinets.length) {
            cabinets.forEach((cabinet: CABINET) => {
                this.cabinets.push(new Cabinets(cabinet, this, folders));
            });
            this.cabinets.sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    get allowed() {
        if (this.appSrv && this.appSrv.limitCardsUser.length) {
            return this.appSrv.limitCardsUser.some(_due => {
                return _due === this.data.DUE;
            });
        }
        return true;
    }
}
