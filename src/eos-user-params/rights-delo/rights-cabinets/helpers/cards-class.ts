import {USERCARD, USER_CABINET, CABINET} from 'eos-rest/interfaces/structures';
import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
export class Cabinets {
    name: string;
    isnCabinet: number;
    isnClassif: number;
    folders = [];
    originFolders = [];
    isEmpty: boolean;
    isEmptyOrigin: boolean;
    homeCabinet: boolean = false;
    originHomeCabinet: boolean = false;
    foldersString: string = '';
    deleted: boolean = false;
    isChanged = false;
    parent: CardsClass;
    get stringFolders() {
        let str = '';
        let t = '';
        this.folders.forEach(el => {
            if (el['value'] === 'A' && el['selected']) {
                t = el['value'];
            } else if (el['value'] !== 'H' && el['value'] !== 'HR') {
                if (el['selected'] === true) {
                    str += el['value'];
                }
            }
        });
        return str + t;
    }
    get hideAccess() {
        if (this.folders[10].selected) {
            return 1;
        } else {
            return 0;
        }
    }

    get hideAccessPR() {
        if (this.folders[11].selected) {
            return 1;
        } else {
            return 0;
        }
    }
    private arrayKey = new Map()
    .set('Поступившие', 1)
    .set('На исполнении', 2)
    .set('На контроле', 3)
    .set('У руководства', 4)
    .set('На рассмотрении', 5)
    .set('В дело', 6)
    .set('Надзорные производства', 'A')
    .set('Управление проектами', 7)
    .set('На визировании', 8)
    .set('На подписи', 9)
    .set('Учитывать ограничения доступа к РК по грифам и группам документов', 'H')
    .set('Учитывать права для работы с РКПД', 'HR');
    constructor(classif: number, cabinetName: CABINET, parent: CardsClass, cuserCard?: USER_CABINET[], ) {
        this.parent = parent;
        this.isnCabinet = cabinetName.ISN_CABINET;
        this.isnClassif = classif;
        this.name = cabinetName.CABINET_NAME;
        this.createFolders(cuserCard);
    }
    createFolders(data: USER_CABINET[]): void {
        let findDate: USER_CABINET[] = null;
        let arrgAvalable = [];
        findDate =  this.initProperties(data);
        if (findDate.length) {
            arrgAvalable = this.foldersString.split('');
        }
        this.setvaluesVoldeers(arrgAvalable, findDate);
    }
    initProperties(data): USER_CABINET[] {
        const parceString = data.filter((user_cab: USER_CABINET) => {
            return user_cab.ISN_CABINET === this.isnCabinet && this.isnClassif  === user_cab.ISN_LCLASSIF;
        });
        if (parceString.length) {
            this.isEmpty = false;
            this.foldersString = parceString[0].FOLDERS_AVAILABLE;
            this.homeCabinet = parceString[0]['HOME_CABINET'] ? true : false;
            if (this.homeCabinet) {
                this.parent.homeCardCabinet = true;
            }
        }   else {
            this.isEmpty = true;
            this.homeCabinet = false;
        }
        this.isEmptyOrigin = this.isEmpty;
        this.originHomeCabinet = this.homeCabinet;
        return parceString;
    }
    setvaluesVoldeers(arrgAvalable, arrayUser_Cabinet): void {
        this.arrayKey.forEach((value, key, map) => {
            const obj = {
                name: key,
                value: value,
            };
            if (value === 'H') {
                obj['selected'] =  !arrayUser_Cabinet.length ? false :  arrayUser_Cabinet[0]['HIDE_INACCESSIBLE'] ? true : false;
                obj['disabled'] = !this.checkDisabled(arrayUser_Cabinet[0] ? this.foldersString : '', true);
                this.folders.push(obj);
            } else if (value === 'HR') {
                obj['selected'] =  !arrayUser_Cabinet.length ? false :  arrayUser_Cabinet[0]['HIDE_INACCESSIBLE_PRJ'] ? true : false;
                obj['disabled'] = !this.checkDisabled(arrayUser_Cabinet[0] ? this.foldersString : '', false);
                this.folders.push(obj);
            }  else {
                obj['selected'] = this.searchValueForParceString(value, arrgAvalable);
                this.folders.push(obj);
            }
        });
        this.originFolders = JSON.parse(JSON.stringify(this.folders));
    }
    checkDisabled(folderAvalable: string, flag: boolean) {
        if (flag) {
            return /[123456]/g.test(folderAvalable);
        }   else {
            return /[789]/g.test(folderAvalable);
        }
    }
    searchValueForParceString(value, arrayValues: Array<any>): boolean {
        if (arrayValues.length) {
            return arrayValues.some(el => {
                return String(el) === String(value);
            });
        }   else {
            return false;
        }
    }
}

export class CardsClass {
    public cardTitle;
    public get cardName () {
        return this.cardTitle;
    }
    public set cardName(name: string) {
        this.cardTitle = name;
    }
    public cabinetsName;
    public homeCard: boolean;

    public homeCardOrigin: boolean;
    public cardDue: string;
    public isnClassif: number;
    // меняется только при смене флага главного кабинета
    public changed: boolean = false;
    public deleted: boolean = false;
    public newCard: boolean;
    public homeCardCabinet: boolean = false;
    current: boolean = false;
    cabinets: Array<Cabinets> = [];
    data: USERCARD;
    public SetChangedCabinets = new Set();
    constructor(card: USERCARD, cardsInfo?: CardInit) {
        this.data = card;
        this.initProperties(cardsInfo);
        this.createCabinets(card, cardsInfo);
    }
    initProperties(cardsInfo: CardInit) {
        this.data.HOME_CARD !== 1 ? this.homeCard = false : this.homeCard = true;
        this.homeCardOrigin = this.homeCard;
        this.cardDue = this.data.DUE;
        this.isnClassif = this.data.ISN_LCLASSIF;
        this.newCard = cardsInfo.create;
    }
    createCabinets(card: USERCARD, cardsInfo) {
        if (card['_d'].length) {
            card['_d'].forEach((cab: CABINET) => {
                    this.cabinets.push(new Cabinets(this.isnClassif, cab, this, cardsInfo.USER_CABINET_info, ));
            });
        }
    }
}
