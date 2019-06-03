import { LINK_DICT } from './../consts/dictionaries/link.consts';
import { NOMENKL_DICT } from './../consts/dictionaries/nomenkl.const';
import { ADDR_CATEGORY_DICT } from './../consts/dictionaries/addr-category.consts';
import { DOCGROUP_DICT } from './../consts/dictionaries/docgroup.consts';
import { CABINET_DICT } from './../consts/dictionaries/cabinet.consts';
import { RUBRICATOR_DICT } from './../consts/dictionaries/rubricator.consts';
import { Injectable } from '@angular/core';
import { AppContext } from 'eos-rest/services/appContext.service';
import { NADZORDICTIONARIES, NADZOR } from 'eos-dictionaries/consts/dictionaries/nadzor.consts';
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



const dictsTechs: { id: string,     tech: E_TECH_RIGHT,  listedUT: boolean, } [] = [
    // Рубрикатор
    {   id: RUBRICATOR_DICT.id,       tech: E_TECH_RIGHT.Rubrics,
        listedUT: true },
    // Подразделения
    {   id: DEPARTMENTS_DICT.id,      tech: E_TECH_RIGHT.Departments,
        listedUT: true },
    // Кабинеты
    { id: CABINET_DICT.id,          tech: E_TECH_RIGHT.Cabinets,
        listedUT: true },
    // Виды доставки
    { id: DELIVERY_DICT.id,         tech: E_TECH_RIGHT.DeliveryTypes,
        listedUT: false },
    // Виды подписей
    { id: SIGN_KIND_DICT.id,        tech: E_TECH_RIGHT.SignTypes,
        listedUT: false },
    // Грифы доступа
    { id: SECURITY_DICT.id,         tech: E_TECH_RIGHT.SecurGrifs,
        listedUT: false },
    // Группы документов
    { id: DOCGROUP_DICT.id,         tech: E_TECH_RIGHT.Docgroups,
        listedUT: false },
    // Категории ЭП
    { id: EDS_CATEGORY_CL.id,       tech: E_TECH_RIGHT.EdsCategory,
        listedUT: false },
    // Категории адресатов
    { id: ADDR_CATEGORY_DICT.id,    tech: E_TECH_RIGHT.AdresatCategories,
        listedUT: false },
    // Номенклатура дел
    {   id: NOMENKL_DICT.id,          tech: E_TECH_RIGHT.DeloNomenkl,
        listedUT: true },
    // Приоритеты проектов резолюций
    { id: RESPRJ_PRIORITY_DICT.id,  tech: E_TECH_RIGHT.ResPriority,
        listedUT: false },
    // Регионы
    { id: REGION_DICT.id,           tech: E_TECH_RIGHT.Regions,
        listedUT: false },
    // Cтатус исполнения (исполнитель)
    { id: STATUS_REPLY_DICT.id,     tech: E_TECH_RIGHT.ReplyStatuses,
        listedUT: false },
    // Cтатус исполнения (поручение)
    { id: STATUS_EXEC_DICT.id,      tech: E_TECH_RIGHT.ExecStatuses,
        listedUT: false },
    // Статус заявителя
    { id: CITSTATUS_DICT.id,        tech: E_TECH_RIGHT.Citstatuses,
        listedUT: false },
    // Список организаций
    { id: ORGANIZ_DICT.id,          tech: E_TECH_RIGHT.OrganizList,
        listedUT: false },
    // Типы виз
    { id: VISA_TYPE_DICT.id,        tech: E_TECH_RIGHT.VisaTypes,
        listedUT: false },
    // Типы организаций
    { id: ORG_TYPE_DICT.id,         tech: E_TECH_RIGHT.OrganizTypes,
        listedUT: false },
    // Типы реестров
    { id: REESTRTYPE_DICT.id,       tech: E_TECH_RIGHT.ReestrTypes,
        listedUT: false },
    // Типы связок
    { id: LINK_DICT.id,             tech: E_TECH_RIGHT.LinkTypes,
        listedUT: false },
    // Группа справочников Надзора
    { id: NADZOR.id,                tech: E_TECH_RIGHT.NadzorCL,
        listedUT: false },
    // Категории поручений
    { id: RESOL_CATEGORY_DICT.id,   tech: E_TECH_RIGHT.ResCategories,
        listedUT: false },
    // Статусы проекта поручения
    { id: RESPRJ_STATUS_DICT.id,    tech: E_TECH_RIGHT.StatPrjPor,
        listedUT: false },
];


export enum APS_DICT_GRANT {
    denied = 0,
    read = 1,
    readwrite = 2,
}

@Injectable()
export class EosAccessPermissionsService {
    constructor (
        private appCtx: AppContext,
    ) {}

    // --------------------------------------------------------------
    isAccessGrantedForDictionary (dictId: string, due: string): APS_DICT_GRANT {
        const dt = dictsTechs.find(d => dictId === d.id);
        if (dt) {
            const grant = this._checkAccessTech(dt.tech);

            // Если к кабинетам есть доступ, а подразделениям - нет, то подразделения отдаем в readonly
            if (dt.id === DEPARTMENTS_DICT.id && !grant) {
                const cab_grant = this.isAccessGrantedForDictionary(CABINET_DICT.id, due);
                if (cab_grant !== APS_DICT_GRANT.denied) {
                    return APS_DICT_GRANT.read;
                }
            }

            // проверить дерево USER_TECH
            if (grant && dt.listedUT && due) {
                return this._userTechListGranted(dt.tech, due);
            }

            return grant ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
        }

        const dNadzor =  NADZORDICTIONARIES.find (n => n.id === dictId);
        if (dNadzor) {
            return this._checkAccessTech(E_TECH_RIGHT.NadzorCL) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
        }

        return APS_DICT_GRANT.denied;
    }
    // --------------------------------------------------------------
    public isAccessGrantedForUsers(): boolean {
        return this._checkAccessTech(E_TECH_RIGHT.Users);
    }

    // --------------------------------------------------------------
    private _checkAccessTech(tr: E_TECH_RIGHT): boolean {
        const r: string = this.appCtx.CurrentUser.TECH_RIGHTS;
        return (r[tr - 1] === '1');
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
