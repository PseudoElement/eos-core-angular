import { Injectable } from "@angular/core";
// import { AppContext } from "../../eos-rest";

@Injectable()
export class logoOverrideServices {
    public pathLogo: string = "./delo-logo-48x48.png"
    constructor(/* private _appcontext: AppContext */) { }

    get tooltip() {
        return 'Вернуться на главную страницу';
        /* if (this._appcontext.cbBase) {
            return 'Вернуться в САДД БР-Web';
        } else {
            return 'Вернуться в Дело-Web';
        } */
    }
}