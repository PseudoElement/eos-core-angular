import { NOMENKL_DICT } from './../consts/dictionaries/nomenkl.const';
import { Injectable, Injector } from '@angular/core';
import { IDictionaryDescriptor, E_DICT_TYPE } from '../../eos-dictionaries/interfaces';
import { AbstractDictionaryDescriptor } from '../../eos-dictionaries/core/abstract-dictionary-descriptor';
import { DICTIONARIES } from '../../eos-dictionaries/consts/dictionaries.consts';
import { PipRX } from '../../eos-rest/services/pipRX.service';
import { DictionaryDescriptor } from '../../eos-dictionaries/core/dictionary-descriptor';
import { TreeDictionaryDescriptor } from '../../eos-dictionaries/core/tree-dictionary-descriptor';
import { DepartmentDictionaryDescriptor } from '../../eos-dictionaries/core/department-dictionary-descriptor';
import { OrganizationDictionaryDescriptor } from '../../eos-dictionaries/core/organization-dictionary-descriptor';
import { CabinetDictionaryDescriptor } from '../../eos-dictionaries/core/cabinet-dictionary-descriptor';
import { DocgroupDictionaryDescriptor } from '../../eos-dictionaries/core/docgroup-dictionary-descriptor';
import {BroadcastChanelDictionaryDescriptor} from './broadcast-chanel-dictionary-descriptor';
import {EosBroadcastChannelService} from '../services/eos-broadcast-channel.service';
import {SevCollisionsDictionaryDescriptor} from './sev/sev-collisions-dictionary-descriptor';
import {EosSevRulesService} from '../services/eos-sev-rules.service';
import {SevRulesDictionaryDescriptor} from './sev/sev-rules-dictionary-descriptor';
import {LinkDictionaryDescriptor} from './link-dictionary-descriptor';
import {NomenklDictionaryDescriptor} from './nomenkl-dictionary-descriptor';
import { ReestrtypeDictionaryDescriptor } from './reestrtype-dictionary-descriptor';
import { TemplateDictionaryDescriptor } from './template-dictionary-descriptor';
import { CA_CATEGORY_CL } from '../../eos-dictionaries/consts/dictionaries/ca-category.consts';
import { CaCategoryDictionaryDescriptor } from './ca-category-dictionary-descriptor';
import { CALENDAR_DICT } from '../../eos-dictionaries/consts/dictionaries/calendar.consts';
import { CalendarDictionaryDescriptor } from './calendar-dictionary-descriptor';
import { CitizensDictionaryDescriptor } from './citizens-dictionary-descriptor';
import { SEV_DICTIONARIES } from '../../eos-dictionaries/consts/dictionaries/sev/folder-sev.consts';
import { PARTICIPANT_SEV_DICT } from '../../eos-dictionaries/consts/dictionaries/sev/sev-participant';
import { SevParticipantDictionaryDescriptor } from './sev/sev-participant-dictionary-descriptor';
import { ADDR_CATEGORY_DICT } from '../../eos-dictionaries/consts/dictionaries/addr-category.consts';
import { AddrCategoryDictionaryDescriptor } from './addr-category-dictionary-descriptor';
import { SevDictionaryDescriptor } from './sev/sev-dictionary-descriptor';
import { ConfirmWindowService } from '../../eos-common/confirm-window/confirm-window.service';
import { FILE_CATEGORIES_DICT } from '../../eos-dictionaries/consts/dictionaries/file-categories.consts';
import { FileCategoryDictionaryDescriptor } from './file-category-dictionary-descriptor';
import { FormatDictionaryDescriptor } from './format-dictionary-descriptor';
import { MedoNodeDictionaryDescriptor } from './medo-node-dictionary-descriptor';
import { AppContext } from '../../eos-rest/services/appContext.service';
import { GraphQLService } from '../../eos-dictionaries/services/graphQL.service';
import { DictionaryOverrideService } from '../../eos-rest';
import { EosCommonOverriveService } from '../../app/services/eos-common-overrive.service';
import { E_DICTIONARY_ID } from '../consts/dictionaries/enum/dictionaryId.enum';

@Injectable()
export class DictionaryDescriptorService {
    private _mDicts: Map<string, IDictionaryDescriptor>;
    private _mDictClasses: Map<string, AbstractDictionaryDescriptor>;

    constructor(
        public dictionaryOverrideSrv: DictionaryOverrideService,
        private apiSrv: PipRX,
        private _channelSrv: EosBroadcastChannelService,
        private _rulesSrv: EosSevRulesService,
        private _injector: Injector,
        private _confirmSrv: ConfirmWindowService,
        private _appContext: AppContext,
        private _GraphQLService: GraphQLService,
        private _eosOverrideServices: EosCommonOverriveService,
    ) {
        this._mDicts = new Map<string, IDictionaryDescriptor>();
        this._mDictClasses = new Map<string, AbstractDictionaryDescriptor>();
        if (!this._appContext.sreamScane) {
            DICTIONARIES.forEach((item) => {
                if (item.id === E_DICTIONARY_ID.FORMAT) {
                    item.visible = false;
                }
                if (this._appContext.cbBase && item.id === E_DICTIONARY_ID.FILE_CATEGORIES) {
                    item.visible = false;
                }
            });
        }
        DICTIONARIES
            .sort((a, b) => {
                if (a.title > b.title) {
                    return 1;
                } else if (a.title < b.title) {
                    return -1;
                } else {
                    return 0;
                }
            })
            .forEach((dict) => this._mDicts.set(dict.id, dict));
        this._eosOverrideServices.setCollectionDescriptors(this._mDicts);

        SEV_DICTIONARIES
            // .sort((a, b) => {
            //     if (a.title > b.title) {
            //         return 1;
            //     } else if (a.title < b.title) {
            //         return -1;
            //     } else {
            //         return 0;
            //     }
            // })
            .forEach((dict) => {
                if (this._appContext.cbBase && dict.id === E_DICTIONARY_ID.PARTICIPANT_SEV) {
                    dict['allVisibleFields'] = dict['allVisibleFields'].filter((field) => field !== 'CRYPT');
                    dict['fieldDefault'] = dict['fieldDefault'].filter((field) => field !== 'CRYPT');
                    dict['quickViewFields'] = dict['quickViewFields'].filter((field) => field !== 'CRYPT');
                    dict['editFields'] = dict['editFields'].filter((field) => field !== 'CRYPT');
                    dict['fields'] = dict['fields'].filter((field) => field.key !== 'CRYPT');
                }
                this._mDicts.set(dict.id, dict)
            });
    }

    visibleDictionaries(): IDictionaryDescriptor[] {
        return DICTIONARIES.filter((dict) => dict.visible);
    }

    visibleSevDictionaries(): IDictionaryDescriptor[] {
        return SEV_DICTIONARIES.filter((dict) => dict.visible);
    }

    getDescriptorData(name: string): IDictionaryDescriptor {
        return this._mDicts.get(name);
    }

    getDescriptorClass(name: string): AbstractDictionaryDescriptor {
        let res = this._mDictClasses.get(name);
        if (!res) {
            const descr = this.getDescriptorData(name);
            if (descr) {
                switch (descr.id) {
                    case E_DICTIONARY_ID.DEPARTMENTS:
                        res = new DepartmentDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.ORGANIZ:
                        res = new OrganizationDictionaryDescriptor(descr, this.apiSrv, this._GraphQLService);
                        break;
                    case E_DICTIONARY_ID.BROADCAST_CHANNEL:
                        res = new BroadcastChanelDictionaryDescriptor(descr, this.apiSrv, this._channelSrv);
                        break;
                    case E_DICTIONARY_ID.RULES_SEV:
                        res = new SevRulesDictionaryDescriptor(descr, this.apiSrv, this._rulesSrv);
                        break;
                    case E_DICTIONARY_ID.CABINET:
                        res = new CabinetDictionaryDescriptor(descr, this.apiSrv, this._confirmSrv);
                        break;
                    case CA_CATEGORY_CL.id:
                        res = new CaCategoryDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case ADDR_CATEGORY_DICT.id:
                        res = new AddrCategoryDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.DOCGROUP:
                        res = new DocgroupDictionaryDescriptor(descr, this.apiSrv, this._injector);
                        break;
                    case E_DICTIONARY_ID.COLLISIONS_SEV:
                        res = new SevCollisionsDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case PARTICIPANT_SEV_DICT.id:
                        res = new SevParticipantDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.LINK:
                        res = new LinkDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case NOMENKL_DICT.id:
                        res = new NomenklDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.REESTRTYPE:
                        res = new ReestrtypeDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.TEMPLATES:
                        res = new TemplateDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case CALENDAR_DICT.id:
                        res = new CalendarDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.CITIZENS:
                        res = new CitizensDictionaryDescriptor(descr, this.apiSrv, this._GraphQLService);
                        break;
                    case E_DICTIONARY_ID.FORMAT:
                        res = new FormatDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case E_DICTIONARY_ID.MEDO_NODE:
                        res = new MedoNodeDictionaryDescriptor(descr, this.apiSrv);
                        break;
                    case FILE_CATEGORIES_DICT.id:
                        res = new FileCategoryDictionaryDescriptor(descr, this.apiSrv, this._GraphQLService);
                }

                if (!res) {
                    for (const d of SEV_DICTIONARIES) {
                        if (d.id && d.id === descr.id) {
                            res = new SevDictionaryDescriptor(descr, this.apiSrv);
                            break;
                        }
                    }
                }

                this._eosOverrideServices.setDescriptor(res, descr, this.apiSrv);

                if (!res) {
                    switch (descr.dictType) {
                        case E_DICT_TYPE.linear:
                            res = new DictionaryDescriptor(descr, this.apiSrv);
                            break;
                        case E_DICT_TYPE.tree:
                            res = new TreeDictionaryDescriptor(descr, this.apiSrv);
                            break;
                        case E_DICT_TYPE.department:
                            break;
                        default:
                            throw new Error('No API instance');
                    }
                }
            }
        }
        return res;
    }
}
