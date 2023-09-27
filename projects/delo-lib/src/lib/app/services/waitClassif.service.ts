import { AppContext } from './../../eos-rest/services/appContext.service';
import { Injectable } from '@angular/core';
import { IOpenClassifParams } from '../../eos-common/interfaces';
import { PipRX } from '../../eos-rest';

declare function openPopup(url: string, callback?: Function): boolean;
declare class Delo {
    static Carousel: (flag: boolean) => any;
}
const LIST_OLD_PAGES: string[] = [
    'CARDINDEX',
    'USER_CL',
    'ORGANIZ_CL',
    // 'CONTACT',
    'LINK_CL',
    'SECURITY_CL',
    'DOCVID_CL',
    'SEV_RULE',
    'NOMENKL_CL'
];
// const OLD_VIEW_URL: string = '../Pages/Classif/ChooseClassif.aspx?';
const OLD_VIEW_URL: string = '../Eos.Delo.JsControls/Classif/ChooseClassif.html?';
const NEW_VIEW_URL: string = '../classifChoose/cl?';
// const URL_PATH = '../classifChoose/cl?';
const USER_LISTS: string = '../Pages/User/USER_LISTS.aspx';
const TECH_LISTS: string = '../Pages/Common/TECH_LISTS.aspx';
const StdText: string = '../WebRC/Pages/StdText.html';
const CITIZEN_dict: string = '../GOPRC/CITIZEN/CITIZEN.html';
const ORGANIZ_dict: string = '../GOPRC/ORGANIZATION/ORGANIZATION.html';
const AR_EDITOR: string = '../WebRC/AR_EDITOR/AR_EDITOR.html';
const SharingLists: string = '../WebRC/Pages/SharingLists.html';
const CERT_INFO = "../CertInfoPlugin/certview";
const COMMON_LIST = "../WebRC/Pages/CommonLists.html";
const CHANGE_DL = "../WebRC/Pages/ChangeDl.html";

@Injectable()
export class WaitClassifService {
    private isCtrl = null;

    constructor(private _apiSrv: PipRX, private _appContext: AppContext) {
        window['Rootpath'] = function () {
            return 'classif';
        };
    }

    canChangeClassifRequest(type: string, oper: string, args: any): Promise<any> {
        const qargs = Object.assign({ type: type, oper: oper }, args);
        const query = { args: qargs };
        const req = { CanChangeClassif: query };
        return this._apiSrv.read(req);
    }

    ctrlClickHandler(isCtrl: boolean) {
        this.isCtrl = isCtrl;
    }

    chooseDocGroup(): Promise<string | void> {
        return this.openClassif({
            classif: 'DOCGROUP_CL',
            selectMulty: false,
            skipDeleted: false,
            return_due: true,
        }, true)
            .then((due: string) => {
                return due;
                // if (isn) {
                //     if (this.rec_to.ISN_NODE.toString() === isn) {
                //         this.hideModal();
                //         this._msgSrv.addNewMessage(THE_SAME_GROUP_WARNING_MESSAGE);
                //         return null;
                //     } else {
                //         this._apiSrv.read<DOCGROUP_CL>({DOCGROUP_CL: PipRX.criteries({ISN_NODE: isn})})
                //             .then(([docGroup]) => {
                //                 this.rec_from = {};
                //                 Object.assign(this.rec_from, docGroup);
                //                 if (docGroup.RC_TYPE.toString() !== this.rec_to.RC_TYPE.toString()) {
                //                     this.hideModal();
                //                     this._msgSrv.addNewMessage(RC_TYPE_IS_DIFFERENT_WARNING_MESSAGE);
                //                 }
                //                 this.form.controls.NODE_TO_COPY.setValue(docGroup.CLASSIF_NAME);
                //             });
                //     }
                // } else {
                //     this.hideModal();
                // }
                // this.isUpdating = false;
            }).catch(() => {
                // console.log('window closed');
                return null;
            });
    }

    /**
     * 
     * @param params Параметры
     * @param ignoreClickMode Не учитывать нажатие Ctrl и открывать всегда одно окно
     */
    openClassif(params: IOpenClassifParams, ignoreClickMode?: boolean): Promise<string> {

        let carouselInSilentMode: any;
        try {
            // carouselInSilentMode = Delo.Carousel(true);
            if (params.datas) {
                carouselInSilentMode = Delo.Carousel.prototype;
            }
        } catch (error) {
            console.log('не найден модуль для карусели');
        }
        let url: string = '';
        if (params.classif === 'USER_LISTS') {
            url = USER_LISTS;
            if (params.user_id !== undefined && params.user_id !== null) {
                url += `?user_id=${params.user_id}`;
            }
        } else if (params.classif === 'TECH_LISTS') {
            url = TECH_LISTS;
        } else if (params.classif === 'COMMON_LIST') {
            url = COMMON_LIST;
        } else if (params.classif === 'StdText') {
            url = this.stdTextUrl(StdText, params);
        } else if (params.classif === 'SharingLists') {
            url = this.sharingListsUrl(SharingLists, params);
        } else if (params.classif === 'gop_rc') {
            url = this._createUrlDict(url, params);
        } else if (params.classif === 'AR_EDITOR') {
            url = AR_EDITOR;
            if (params.id) {
                url += `#type=` + params.id;
            }
        } else if (params.classif === "CERT_INFO") {
            url = CERT_INFO;
        } else if (params.classif === "CHANGE_DL") {
            url = this.createUrlTransferDocuments(CHANGE_DL, params);
        } else {
            setTimeout(() => {
                url = this._prepareUrl(params, ignoreClickMode);
            }, 0);
        }

        return new Promise((resolve, reject) => {
            let w;
            let flagPar = false;
            if (window['dontCheckExistPopUp'] === undefined) {
                flagPar = true;
                window['dontCheckExistPopUp'] = true;
            }
            setTimeout(() => {
                if (carouselInSilentMode && params.datas) {
                    carouselInSilentMode.carouselDataToLs(url, params.datas);
                }
                w = openPopup(url, function (event, str) {
                    if (flagPar) {
                        delete window['dontCheckExistPopUp'];
                    }
                    if (str !== '') {
                        return resolve(str);
                    }
                    return reject();
                });
            });

            const checkDialClosed = setInterval(function () {
                try {
                    if (!w || w['closed']) {
                        clearInterval(checkDialClosed);
                        if (flagPar) {
                            delete window['dontCheckExistPopUp'];
                        }
                        reject();
                    }
                } catch (e) {
                    if (flagPar) {
                        delete window['dontCheckExistPopUp'];
                    }
                    reject();
                }
            }, 500);
        });
    }

    private _createUrlDict(url, params: IOpenClassifParams) {
        if (params.id === 'CITIZEN_dict') {
            url = CITIZEN_dict;
            url += `#rc_id=` + params.user_id;
            if (params.editMode) {
                url += `&editMode=` + params.editMode;
            }
            if (params.from_classif) {
                url += `&from_classif=` + params.from_classif;
            }
        } else if (params.id === 'ORGANIZ_dict') {
            url = ORGANIZ_dict;
            url += `#rc_id=` + params.user_id;
            if (params.folder_due) {
                url += `&folder_due=` + params.folder_due;
            }
            if (params.due) {
                url += `&due=` + params.due;
            }
            if (params.editMode) {
                url += `&editMode=` + params.editMode;
            }
            if (params.from_classif) {
                url += `&from_classif=` + params.from_classif;
            }
        }
        return url;
    }

    private sharingListsUrl(url, params: IOpenClassifParams) {
        if (params.isn_user !== undefined && params.isn_user !== null) {
            url += `?isn_classif=${params.isn_user}`;
        }
        return url;
    }

    private getSymbol(url: string) {
        return url.indexOf('?') === -1 ? '?' : '&';
    }

    private stdTextUrl(url, params: IOpenClassifParams) {
        if (params.isn_user !== undefined && params.isn_user !== null) {
            url += this.getSymbol(url) + `isn_user=${params.isn_user}`;
        }
        if (params.clUser === true) {
            url += this.getSymbol(url) + `clUser=${params.clUser}`;
        }
        // if (params.name !== undefined && params.name !== null) {
        //     url += `&name=${params.name}`;
        // }
        // if (params.form !== undefined && params.form !== null) {
        //     url += `&form=${params.form}`;
        // }
        if (params.idText !== undefined && params.idText !== null) {
            url += this.getSymbol(url) + `id=${params.idText}`;
            url += this.getSymbol(url) + `name=${params.idText}`;
        }
        if (params.formText !== undefined && params.formText !== null) {
            url += this.getSymbol(url) + `form=${params.formText}`;
        }
        if (params.selected !== undefined && params.selected !== null) {
            url += this.getSymbol(url) + `select=${params.selected}`;
        }
        return url;
    }

    private _prepareUrl(params: IOpenClassifParams, ignoreClickMode?: boolean): string {
        const clickMode = this._appContext.CurrentUser._more_json.ParamsDic['CLASSIF_WEB_SUGGESTION'];
        let url: string = '';
        if (LIST_OLD_PAGES.indexOf(params.classif) !== -1 || ignoreClickMode) {
            url += NEW_VIEW_URL;
        } else {
            if (clickMode === '1') {
                url += this.isCtrl ? NEW_VIEW_URL : OLD_VIEW_URL;
            } else {
                url += this.isCtrl ? OLD_VIEW_URL : NEW_VIEW_URL;
            }
        }
        url += `Classif=${params.classif}`;
        url += params.return_due ? '&return_due=true' : '';
        url += params.id ? `&value_id=${params.id}_Ids&name_id=${params.id}` : '';
        url += params.selected ? `&selected=${params.selected}` : '';
        url += params.Selected ? `&Selected=${params.Selected}` : '';
        if (params.selectMulty !== undefined && params.selectMulty !== null) {
            url += `&select_multy=${params.selectMulty}`;
        }
        if (params.selectNodes !== undefined && params.selectNodes !== null) {
            url += `&select_nodes=${params.selectNodes}`;
        }
        if (params.selectLeafs !== undefined && params.selectLeafs !== null) {
            url += `&select_leafs=${params.selectLeafs}`;
        }
        if (params.skipDeleted !== undefined && params.skipDeleted !== null) {
            url += `&Skip_deleted=${params.skipDeleted}`;
        }
        if (params.nomenkl_jou !== undefined && params.nomenkl_jou !== null) {
            url += `&nomenkl_jou=${params.nomenkl_jou}`;
        }
        if (params.user_id !== undefined && params.user_id !== null) {
            url += `&user_id=${params.user_id}`;
        }
        if (params.curdue !== undefined && params.curdue !== null) {
            url += `&curdue=${params.curdue}`;
        }
        if (params.can_tech !== undefined && params.can_tech !== null) {
            url += this.getSymbol(url) + `can_tech=${params.can_tech}`;
        }
        if (params.search_query !== undefined && params.search_query !== null) {
            url += '&search_query=' + params.search_query;
        }
        url += params.classif === 'CONTACT' || params.classif === 'ORGANIZ_CL' ? '&app=nadzor' : '';

        return url;
    }

    private createUrlTransferDocuments(url: string, params: IOpenClassifParams) {
        url += `?dl_from=${params.dl_from}&dl_to=${params.dl_to}`;
        return url;
    }
}
