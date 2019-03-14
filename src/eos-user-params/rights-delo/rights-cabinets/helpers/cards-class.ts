import {USERCARD, USER_CABINET, CABINET} from 'eos-rest/interfaces/structures';
import {CardInit} from 'eos-user-params/shared/intrfaces/cabinets.interfaces';
export class Cabinets {
    name: string;
    change: boolean;
    isnCabinet: number;
    isnClassif: number;
    folders = [];
    isEmpty: boolean;
    private arrayKey = new Map()
    .set('Поступившие', 1)
    .set('На исполнении', 2)
    .set('На контроле', 3)
    .set('У руководства', 4)
    .set('На рассмотрении', 5)
    .set('В дело', 6)
    .set('Надзорные производства', 7)
    .set('Управление проектами', 8)
    .set('На визировании', 9)
    .set('На подписи', 'A')
    .set('Учитывать ограничения доступа к РК по грифам и группам документов', false)
    .set('Учитывать права для работы с РКПД', false);
    constructor(classif: number, cabinetName: CABINET, cuserCard?: USER_CABINET[]) {
        this.isnCabinet = cabinetName.ISN_CABINET;
        this.isnClassif = classif;
        this.name = cabinetName.CABINET_NAME;
        this.createFolders(cuserCard);
    }
    createFolders(data: USER_CABINET[]) {
        const parceString = data.filter((user_cab: USER_CABINET) => {
            return user_cab.ISN_CABINET === this.isnCabinet && this.isnClassif  === user_cab.ISN_LCLASSIF;
        });
        let findDate: USER_CABINET = null;
        let stringAvalable = [];
        if (parceString.length) {
            this.isEmpty = false;
            findDate = parceString[0];
            stringAvalable = findDate.FOLDERS_AVAILABLE.split('');
        }   else {
            this.isEmpty = true;
        }
        this.arrayKey.forEach((value, key, map) => {
            const obj = {
                name: key,
                value: value};
            if (key === ('HIDE_INACCESSIBLE' || 'HIDE_INACCESSIBLE_PRJ' )) {
                obj['selected'] =   parceString.length ?  findDate[key] ? true : false : false;
                this.folders.push(obj);
            }   else {
                obj['selected'] = this.searchValueForParceString(value, stringAvalable);
                this.folders.push(obj);
            }
        });
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
    public cardDue: string;
    public isnClassif: number;
    public changed: boolean = false;
    public deleted: boolean = false;
    public newCard: boolean;
    current: boolean = false;
    cabinets: Array<Cabinets> = [];
    data: USERCARD;
    constructor(cardInfo: USERCARD, cardsInfo?: CardInit) {
        this.data = cardInfo;
        this.initProperties(cardsInfo);
        this.createCabinets(cardsInfo);
    }
    initProperties(cardsInfo: CardInit) {
        this.data.HOME_CARD !== 1 ? this.homeCard = false : this.homeCard = true;
        this.cardDue = this.data.DUE;
        this.isnClassif = this.data.ISN_LCLASSIF;
        this.newCard = cardsInfo.create;
    }
    createCabinets(cardsInfo: CardInit) {
        if (cardsInfo.CABINET_info.length) {
            cardsInfo.CABINET_info.forEach((cab: CABINET) => {
                if (cab.DUE === this.cardDue) {
                    this.cabinets.push(new Cabinets(this.isnClassif, cab, cardsInfo.USER_CABINET_info));
                }
            });
        }
    }

}
