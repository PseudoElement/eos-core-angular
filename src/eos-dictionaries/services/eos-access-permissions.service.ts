import { CALENDAR_DICT } from './../consts/dictionaries/calendar.consts';
import { LINK_DICT } from './../consts/dictionaries/link.consts';
import { NOMENKL_DICT } from './../consts/dictionaries/nomenkl.const';
import { ADDR_CATEGORY_DICT } from './../consts/dictionaries/addr-category.consts';
import { DOCGROUP_DICT } from './../consts/dictionaries/docgroup.consts';
import { CABINET_DICT } from './../consts/dictionaries/cabinet.consts';
import { RUBRICATOR_DICT } from './../consts/dictionaries/rubricator.consts';
import { Injectable } from '@angular/core';
import { AppContext } from 'eos-rest/services/appContext.service';
import { NADZOR_DICTIONARIES as NADZOR_DICTIONARIES, NADZOR_FOLDER } from 'eos-dictionaries/consts/dictionaries/nadzor/nadzor.consts';
import { E_TECH_RIGHT } from 'eos-rest/interfaces/rightName';
import { DEPARTMENTS_DICT } from 'eos-dictionaries/consts/dictionaries/department.consts';
import { SIGN_KIND_DICT } from 'eos-dictionaries/consts/dictionaries/sign-kind.consts';
import { DELIVERY_DICT } from 'eos-dictionaries/consts/dictionaries/delivery.consts';
import { SECURITY_DICT } from 'eos-dictionaries/consts/dictionaries/security.consts';
import { EDS_CATEGORY_CL } from 'eos-dictionaries/consts/dictionaries/category-eds.consts';
import { RESPRJ_PRIORITY_DICT } from 'eos-dictionaries/consts/dictionaries/resprj-priority.consts';
import { REGION_DICT } from 'eos-dictionaries/consts/dictionaries/region.consts';
import { ORGANIZ_DICT } from 'eos-dictionaries/consts/dictionaries/organiz.consts';
import { STATUS_REPLY_DICT } from 'eos-dictionaries/consts/dictionaries/status-reply.consts';
import { STATUS_EXEC_DICT } from 'eos-dictionaries/consts/dictionaries/status-exec.consts';
import { CITSTATUS_DICT } from 'eos-dictionaries/consts/dictionaries/citstatus.consts';
import { VISA_TYPE_DICT } from 'eos-dictionaries/consts/dictionaries/visa-type.consts';
import { REESTRTYPE_DICT } from 'eos-dictionaries/consts/dictionaries/reestrtype.consts';
import { ORG_TYPE_DICT } from 'eos-dictionaries/consts/dictionaries/org-type.consts';
import { RESOL_CATEGORY_DICT as RESOL_CATEGORY_DICT } from 'eos-dictionaries/consts/dictionaries/resolution-category.consts';
import { RESPRJ_STATUS_DICT } from 'eos-dictionaries/consts/dictionaries/resprj-status.consts';
import { Templates } from 'eos-dictionaries/consts/dictionaries/templates.consts';
import { CA_CATEGORY_CL } from 'eos-dictionaries/consts/dictionaries/ca-category.consts';
import { CITIZENS_DICT } from 'eos-dictionaries/consts/dictionaries/citizens.const';
import { SEV_FOLDER, SEV_DICTIONARIES } from 'eos-dictionaries/consts/dictionaries/sev/folder-sev.consts';
import { TYPE_DOCUM_DICT } from 'eos-dictionaries/consts/dictionaries/type-docum.const';
import { FILE_TYPE_DICT } from 'eos-dictionaries/consts/dictionaries/file-type.const';
import { FILE_CATEGORIES_DICT } from 'eos-dictionaries/consts/dictionaries/file-categories.consts';
import { FORMAT_DICT } from 'eos-dictionaries/consts/dictionaries/format.const';

const dictsTechs: { id: string, tech: E_TECH_RIGHT, listedUT: boolean /* проверить дерево USER_TECH */, }[] = [
    // Рубрикатор
    {
        id: RUBRICATOR_DICT.id, tech: E_TECH_RIGHT.Rubrics,
        listedUT: true
    },
    // Подразделения
    {
        id: DEPARTMENTS_DICT.id, tech: E_TECH_RIGHT.Departments,
        listedUT: true
    },
    // Кабинеты
    {
        id: CABINET_DICT.id, tech: E_TECH_RIGHT.Cabinets,
        listedUT: true
    },
    // Виды доставки
    {
        id: DELIVERY_DICT.id, tech: E_TECH_RIGHT.DeliveryTypes,
        listedUT: false
    },
    // Виды подписей
    {
        id: SIGN_KIND_DICT.id, tech: E_TECH_RIGHT.SignTypes,
        listedUT: false
    },
    // Грифы доступа
    {
        id: SECURITY_DICT.id, tech: E_TECH_RIGHT.SecurGrifs,
        listedUT: false
    },
    // Группы документов
    { id: DOCGROUP_DICT.id,         tech: E_TECH_RIGHT.Docgroups,
        listedUT: true },
    // Категории ЭП
    {
        id: EDS_CATEGORY_CL.id, tech: E_TECH_RIGHT.EdsCategory,
        listedUT: false
    },
    // Управление сертификатами
    {
        id: CA_CATEGORY_CL.id, tech: E_TECH_RIGHT.EdsCategory, // ManageCertificate,
        listedUT: false
    },
    // Категории адресатов
    {
        id: ADDR_CATEGORY_DICT.id, tech: E_TECH_RIGHT.AdresatCategories,
        listedUT: false
    },
    // Номенклатура дел
    {
        id: NOMENKL_DICT.id, tech: E_TECH_RIGHT.DeloNomenkl,
        listedUT: true
    },
    // Приоритеты проектов резолюций
    {
        id: RESPRJ_PRIORITY_DICT.id, tech: E_TECH_RIGHT.ResPriority,
        listedUT: false
    },
    // Регионы
    {
        id: REGION_DICT.id, tech: E_TECH_RIGHT.Regions,
        listedUT: false
    },
    // Состояние исполнения (исполнитель)
    {
        id: STATUS_REPLY_DICT.id, tech: E_TECH_RIGHT.ReplyStatuses,
        listedUT: false
    },
    // Состояние исполнения (поручение)
    {
        id: STATUS_EXEC_DICT.id, tech: E_TECH_RIGHT.ExecStatuses,
        listedUT: false
    },
    // Статус заявителя
    {
        id: CITSTATUS_DICT.id, tech: E_TECH_RIGHT.Citstatuses,
        listedUT: false
    },
    // Список организаций
    {
        id: ORGANIZ_DICT.id, tech: E_TECH_RIGHT.OrganizList,
        listedUT: false
    },
    // Типы виз
    {
        id: VISA_TYPE_DICT.id, tech: E_TECH_RIGHT.VisaTypes,
        listedUT: false
    },
    // Типы организаций
    {
        id: ORG_TYPE_DICT.id, tech: E_TECH_RIGHT.OrganizTypes,
        listedUT: false
    },
    // Типы реестров
    {
        id: REESTRTYPE_DICT.id, tech: E_TECH_RIGHT.ReestrTypes,
        listedUT: false
    },
    // Типы связок
    {
        id: LINK_DICT.id, tech: E_TECH_RIGHT.LinkTypes,
        listedUT: false
    },
    // Группа справочников Надзора
    {
        id: NADZOR_FOLDER.id, tech: E_TECH_RIGHT.NadzorCL,
        listedUT: false
    },
    // Категории поручений
    {
        id: RESOL_CATEGORY_DICT.id, tech: E_TECH_RIGHT.ResCategories,
        listedUT: false
    },
    // Статусы проекта поручения
    {
        id: RESPRJ_STATUS_DICT.id, tech: E_TECH_RIGHT.StatPrjPor,
        listedUT: false
    },
    // Ведение календаря
    {
        id: CALENDAR_DICT.id, tech: E_TECH_RIGHT.CalendarSettings,
        listedUT: false
    },
    // Справочники СЭВ
    {
        id: SEV_FOLDER.id, tech: E_TECH_RIGHT.SevCL,
        listedUT: false
    },
    {
        id: SEV_DICTIONARIES[1].id, tech: E_TECH_RIGHT.SevCL,
        listedUT: false
    },
    {
        id: SEV_DICTIONARIES[2].id, tech: E_TECH_RIGHT.SevCL,
        listedUT: false
    },
    // Шаблоны
    {
        id: Templates.id, tech: E_TECH_RIGHT.Templates,
        listedUT: false
    },
    {
        id: CITIZENS_DICT.id, tech: E_TECH_RIGHT.Citizens,
        listedUT: false
    },
    {
        id: TYPE_DOCUM_DICT.id, tech: E_TECH_RIGHT.Templates,
        listedUT: false
    },

    { id: FILE_TYPE_DICT.id, tech: E_TECH_RIGHT.FileType,
        listedUT: false },

    // @stub157113 - добавление нового справочника КАТЕГОРИИ ФАЙЛОВ
    { id: FILE_CATEGORIES_DICT.id, tech: E_TECH_RIGHT.FileCategories,
    listedUT: false }
];

const LicenseTech = {
    SEV: 23
};

export enum APS_DICT_GRANT {
    denied = 0,
    read = 1,
    readwrite = 2,
}

@Injectable()
export class EosAccessPermissionsService {
    constructor(
        private appCtx: AppContext,
    ) { }

    // --------------------------------------------------------------
    isAccessGrantedForDictionary(dictId: string, due: string): APS_DICT_GRANT {
        const dt = dictsTechs.find(d => dictId === d.id);
        if (dt) {
            const grant = this.checkAccessTech(dt.tech);

            // Если к кабинетам есть доступ, а подразделениям - нет, то подразделения отдаем в readonly
            if (dt.id === DEPARTMENTS_DICT.id && !grant) {
                const cab_grant = this.isAccessGrantedForDictionary(CABINET_DICT.id, due);
                if (cab_grant !== APS_DICT_GRANT.denied) {
                    return APS_DICT_GRANT.read;
                }
            }

            // Проверка прав на "Виды документов"
            if (dt.id === TYPE_DOCUM_DICT.id) {
                let curUserHasDocGroupe: boolean = false;
                const techList = this.appCtx.CurrentUser.USER_TECH_List;
                const isLimTech = techList.some((el) => el.FUNC_NUM === 9 && !el.ALLOWED);
                if (!isLimTech) {
                    curUserHasDocGroupe = true;
                }
                if (!this.appCtx.hasUnlimTech && !isLimTech) {
                    curUserHasDocGroupe = true;
                }
                if (!curUserHasDocGroupe) {
                    return APS_DICT_GRANT.denied;
                } else {
                    return this.checkAccessTech(E_TECH_RIGHT.Docgroups) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
                }
            }

            // проверить дерево USER_TECH
            if (grant && dt.listedUT && due) {
                return this._userTechListGranted(dt.tech, due);
            }
            return grant ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
        }
        if (dictId === FORMAT_DICT.id) {
            if (this.appCtx.CurrentUser['STREAM_SCAN_RIGHTS'][1] === '1') {
                return APS_DICT_GRANT.readwrite;
            }
        }
        let dict;

        dict = NADZOR_DICTIONARIES.find(n => n.id === dictId);
        if (dict) {
            return this.checkAccessTech(E_TECH_RIGHT.NadzorCL) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
        }

        dict = SEV_DICTIONARIES.find(n => n.id === dictId);
        if (dict) {
            return this.checkAccessTech(E_TECH_RIGHT.SevCL) && this.isAssessSev('SEV') ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.read;
        }




        return APS_DICT_GRANT.denied;
    }
    isAssessSev(dictionary: string) {
        const id = LicenseTech[dictionary];
        if (id) {
            const licenze: any[] = this.appCtx.licenze;
            if (licenze && licenze.length) {
                const l = licenze.filter((_l) => _l.Id === id);
                return l.length;
            } else {
                return false;
            }
        }
        return true;
    }
    // --------------------------------------------------------------
    public isAccessGrantedForUsers() {
        const access = this.appCtx.CurrentUser.USER_TECH_List.some(tech => tech.FUNC_NUM === 1);
        return this.checkAccessTech(E_TECH_RIGHT.Users) && !access;
    }

    // --------------------------------------------------------------
    public checkAccessTech(tr: E_TECH_RIGHT): boolean {
        const r: string = this.appCtx.CurrentUser.TECH_RIGHTS;
        if (!r) {
            return false;
        }
        // @stub157113 для обхода проверки прав для категорий файлов
        // if (tr === E_TECH_RIGHT.FileCategories) {
        // return true;
        // }
        return (r[tr - 1] === '1');
    }

    public checkShowDeleted(dictId: string): boolean {
        const dt = dictsTechs.find(d => dictId === d.id);
        if (dt) {
            return this.checkAccessTech(dt.tech);
        }
        return false;
    }
    /* системному технологу с доступом к справочнику "Подразделения" и разрешеной вершиной "Все подразделения" */
    public checkBaseDepartmentRight(): boolean {
        const direct_rule = this.appCtx.CurrentUser.USER_TECH_List.findIndex(e => (e['FUNC_NUM'] === 10 && e['DUE'] === '0.' && e['ALLOWED'] === 1));
        return direct_rule === -1 ? false : true;
    }

    // --------------------------------------------------------------
    private _userTechListGranted(tech: E_TECH_RIGHT, due: string): APS_DICT_GRANT {
        // сначала ищем явное правило
        const direct_rule = this.appCtx.CurrentUser.USER_TECH_List.find(e => (e['FUNC_NUM'] === tech && e['DUE'] === due));
        if (direct_rule) {
            if (direct_rule.ALLOWED) {
                return APS_DICT_GRANT.readwrite;
            } else {
                return APS_DICT_GRANT.denied;
            }
        }

        // Ищем правило по дереву, начиная с глубейших
        const list = this.appCtx.CurrentUser.USER_TECH_List
            .filter(e => (e['FUNC_NUM'] === tech) && due.substr(0, e.DUE.length) === e.DUE)
            .sort((a, b) => {
                if (a.DUE.length > b.DUE.length) {
                    return -1;
                } else {
                    return 1;
                }
            }
            );

        if (list && list.length) {
            const rec = list[0];
            if (rec.ALLOWED) {
                return APS_DICT_GRANT.readwrite;
            } else {
                return APS_DICT_GRANT.denied;
            }
        }
        return APS_DICT_GRANT.denied;
    }


}
