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
import { RESOLUTION_CATEGORY_DICT } from 'eos-dictionaries/consts/dictionaries/resolution-category.consts';



const dictsTechs: { id: string,     tech: E_TECH_RIGHT; } [] = [
    { id: RUBRICATOR_DICT.id,       tech: E_TECH_RIGHT.Rubrics },           // Рубрикатор
    { id: DEPARTMENTS_DICT.id,      tech: E_TECH_RIGHT.Departments },       // Подразделения
    { id: CABINET_DICT.id,          tech: E_TECH_RIGHT.Cabinets },          // Кабинеты
    { id: DELIVERY_DICT.id,         tech: E_TECH_RIGHT.DeliveryTypes},      // Виды доставки
    { id: SIGN_KIND_DICT.id,        tech: E_TECH_RIGHT.SignTypes},          // Виды подписей
    { id: SECURITY_DICT.id,         tech: E_TECH_RIGHT.SecurGrifs},         // Грифы доступа
    { id: DOCGROUP_DICT.id,         tech: E_TECH_RIGHT.Docgroups},          // Группы документов
    { id: EDS_CATEGORY_CL.id,       tech: E_TECH_RIGHT.EdsCategory},        // Категории ЭП
    { id: ADDR_CATEGORY_DICT.id,    tech: E_TECH_RIGHT.AdresatCategories},  // Категории адресатов
    { id: NOMENKL_DICT.id,          tech: E_TECH_RIGHT.DeloNomenkl},        // Номенклатура дел
    { id: RESPRJ_PRIORITY_DICT.id,  tech: E_TECH_RIGHT.ResPriority},        // Приоритеты проектов резолюций
    { id: REGION_DICT.id,           tech: E_TECH_RIGHT.Regions},            // Регионы
    { id: STATUS_REPLY_DICT.id,     tech: E_TECH_RIGHT.ReplyStatuses},      // Cтатус исполнения (исполнитель)
    { id: STATUS_EXEC_DICT.id,      tech: E_TECH_RIGHT.ExecStatuses},       // Cтатус исполнения (поручение)
    { id: CITSTATUS_DICT.id,        tech: E_TECH_RIGHT.Citstatuses},        // Статус заявителя
    { id: ORGANIZ_DICT.id,          tech: E_TECH_RIGHT.OrganizList},        // Список организаций
    { id: VISA_TYPE_DICT.id,        tech: E_TECH_RIGHT.VisaTypes},          // Типы виз
    { id: ORG_TYPE_DICT.id,         tech: E_TECH_RIGHT.OrganizTypes},       // Типы организаций
    { id: REESTRTYPE_DICT.id,       tech: E_TECH_RIGHT.ReestrTypes},        // Типы реестров
    { id: LINK_DICT.id,             tech: E_TECH_RIGHT.LinkTypes},          // Типы связок
    { id: NADZOR.id,                tech: E_TECH_RIGHT.NadzorCL},           // Группа справочников Надзора
    { id: RESOLUTION_CATEGORY_DICT.id, tech: E_TECH_RIGHT.ResCategories},   // Категории поручений
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

    isAccessGrantedForDictionary (dictId: string): APS_DICT_GRANT {
        const dt = dictsTechs.find(d => dictId === d.id);
        if (dt) {
            const grant = this._checkAccessTech(dt.tech) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;

            // Если к кабинетам есть доступ, а подразделениям - нет, то подразделения отдаем в readonly
            if (dt.id === DEPARTMENTS_DICT.id && grant === APS_DICT_GRANT.denied) {
                const cab_grant = this.isAccessGrantedForDictionary(CABINET_DICT.id);
                if (cab_grant !== APS_DICT_GRANT.denied) {
                    return APS_DICT_GRANT.read;
                }
            }
            return grant;
        }

        const dNadzor =  NADZORDICTIONARIES.find (n => n.id === dictId);
        if (dNadzor) {
            return this._checkAccessTech(E_TECH_RIGHT.NadzorCL) ? APS_DICT_GRANT.readwrite : APS_DICT_GRANT.denied;
        }

        return APS_DICT_GRANT.denied;
    }

    isAccessGrantedForUsers(): boolean {
        return this._checkAccessTech(E_TECH_RIGHT.Users);
    }

    private _checkAccessTech(tr: E_TECH_RIGHT): boolean {
        const r: string = this.appCtx.CurrentUser.TECH_RIGHTS;
        return (r[tr - 1] === '1');
    }

}
