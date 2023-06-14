import { Injectable } from '@angular/core';
import { ECellToAll, ITableData, ITableHeader } from '../../../eos-parameters/parametersSystem/shared/interfaces/tables.interfaces';
import { EQueryPosition, ETypeDeloRight, HTML_ABSOLUT_RIGHT_REPORT, HTML_ABSOLUT_RIGH_DATE, HTML_ABSOLUT_RIGH_HEADER, HTML_ABSOLUT_RIGH_TITLE, HTML_ABSOLUT_ROW, IAbsRightMapSet } from './absolute-rights.consts';
import { E_RIGHT_DELO_ACCESS_CONTENT } from './right-delo.intefaces';
import { NodeAbsoluteRight } from './node-absolute';
import { IParamUserCl } from '../../../eos-user-params/shared/intrfaces/user-parm.intterfaces';
import { UserParamsService } from '../../../eos-user-params/shared/services/user-params.service';
import { USERDEP, USER_ORGANIZ } from '../../../eos-rest/interfaces/structures';
import { WaitClassifService } from '../../../app/services/waitClassif.service';
import { OPEN_CLASSIF_DEPARTMENT_FULL, OPEN_CLASSIF_ORGANIZ_FULL } from '../../../app/consts/query-classif.consts';
import { saveAs } from 'file-saver';
enum EFindRight {
    curentRight = 0
}

@Injectable()
export class RughtDeloAbsRightService {
    curentUser: IParamUserCl;
    listRight: NodeAbsoluteRight[] = [];
    listRightNew = new Map();
    tabelData: ITableData;
    selectedRow = [];
    deloRights22;
    paramsToQuery: IAbsRightMapSet;
    maxWeightDep: number = -1;
    maxWeightOrg: number = -1;
    constructor(
        private _userParmSrv: UserParamsService,
        private _waitClassifSrv: WaitClassifService,){
    }
    addOrg() {
        const ORGANIZ = Object.assign({}, OPEN_CLASSIF_ORGANIZ_FULL);
        ORGANIZ.skipDeleted = true;
        return this._waitClassifSrv.openClassif(ORGANIZ)
        .then((data) => {
            const newOrg = data.split('|');
            const oldOrg = [];
            this.tabelData.data.forEach((row) => {
                if (row['__metadata'] && row['__metadata']['__type'] === 'ORGANIZ_CL') {
                    oldOrg.push(row['DUE']);
                }
            });
            newOrg.forEach((org, index) => {
                if (oldOrg.indexOf(org) !== -1) {
                    newOrg[index] = '';
                }
            });
            const dataQuery = newOrg.join('|');
            if (dataQuery) {
                return this._userParmSrv.getOrganizFromUser(dataQuery.split('|'))
                .then((dataOrg) => {
                    const nMap = this.paramsToQuery;
                    dataOrg.forEach((org) => {
                        if (this.maxWeightOrg > 0) {
                            this.maxWeightOrg++;
                            org['ROW_WEIGHT'] = this.maxWeightOrg;
                        } else {
                            this.maxWeightOrg = 1;
                            org['ROW_WEIGHT'] = this.maxWeightOrg;
                        }
                        /* 
                        * Создать новую строку
                        */
                        this.createOrgRow(org, this.tabelData.tableHeader, nMap);
                        /* 
                        * Добавить её в массив
                        */
                        this.tabelData.data.push(org);
                        /* 
                        * Установить все чекбоксы
                        */
                        Object.keys(org).forEach((key) => {
                            if (org[key] && org[key].type === ECellToAll.checkbox && key !== 'CLASSIF_NAME') {
                                this.chechNewInfoOrg(org, key, true);
                                org[key].check = true;
                            }
                        });
                    }); 
                });
            }
        })
        .catch((er) => {
            console.log('er', er);
        });
        
    }
    addDep() {
        const DEPART = Object.assign({}, OPEN_CLASSIF_DEPARTMENT_FULL);
        return this._waitClassifSrv.openClassif(DEPART)
        .then((data) => {
            const newDep = data.split('|');
            const oldDep = [];
            this.tabelData.data.forEach((row) => {
                if (row['__metadata'] && row['__metadata']['__type'] === 'DEPARTMENT') {
                    oldDep.push(row['DUE']);
                }
            });
            newDep.forEach((org, index) => {
                if (oldDep.indexOf(org) !== -1) {
                    newDep[index] = '';
                }
            });
            const dataQuery = newDep.join('|');
            if (dataQuery) {
                return this._userParmSrv.getDepartmentFromUser(dataQuery.split('|'))
                .then((dataDep) => {
                    const nMap = this.paramsToQuery;
                    dataDep.forEach((dep) => {
                        if (this.maxWeightDep > 0) {
                            this.maxWeightDep++;
                            dep['ROW_WEIGHT'] = this.maxWeightDep;
                        } else {
                            this.maxWeightDep = 1;
                            dep['ROW_WEIGHT'] = this.maxWeightDep;
                        }
                        /* 
                        * Создать новую строку
                        */
                        this.createDepRow(dep, this.tabelData.tableHeader, nMap);
                        /* 
                        * Добавить её в массив
                        */
                        const indexRep = this.tabelData.data.findIndex((item) => item['CLASSIF_NAME'] === 'Организации' && item.rowNotCount);
                        this.tabelData.data.splice(indexRep, 0, dep);
                        /* 
                        * Установить все чекбоксы
                        */
                        Object.keys(dep).forEach((key) => {
                            if (dep[key] && dep[key].type === ECellToAll.checkbox && key !== 'CLASSIF_NAME' && dep[key].disabled !== true) {
                                this.chechNewInfoDep(dep['key'], key, true);
                                dep[key].check = true;
                            }
                        });
                    }); 
                });
            }
        })
        .catch((er) => {
            console.log('er', er);
        });
    }
    deletedRow() {
        const allDeletKey = [];
        this.selectedRow.forEach((row) => {
            allDeletKey.push(row['key'])
            this.tabelData.tableHeader.forEach((header) => {
                if (row[header.id] && header.id !== 'CLASSIF_NAME' && row[header.id]['type'] === ECellToAll.checkbox && row[header.id]['check']) {
                    if (row.__metadata.__type === 'DEPARTMENT') {
                        this.chechNewInfoDep(row['key'], header.id, false);
                    } else {
                        this.chechNewInfoOrg(row, header.id, false);
                    }
                }
                if (row[header.id] && row[header.id]['type'] === ECellToAll.buttons && row[header.id]['value'] !== undefined) {
                    this.clickToButton(row['key'], header.id, undefined)
                }
            });
        });
        this.selectedRow = [];
        this.updateBtn();
        this.tabelData.data = this.tabelData.data.filter((item) => allDeletKey.indexOf(item.key) === -1);
    }
    /* 
    * Тут обрабатываем строки берём
    */
    initWeightSortDep(newData: any[]) {
        const allDepWeight: number[] = [0];
        Object.keys(this.paramsToQuery.mapDepWeight).forEach((due) => {
            if (due === '0.') {
                this.paramsToQuery.mapDepWeight[due] = 0;
            } else if (this.paramsToQuery.mapDepWeight[due].size === 1) {
                const weight: number = Array.from<number>(this.paramsToQuery.mapDepWeight[due])[0];
                if (allDepWeight.indexOf(weight) === -1) {
                    allDepWeight.push(weight);
                    this.paramsToQuery.mapDepWeight[due] = weight;
                } else {
                    allDepWeight.push(Math.max(...allDepWeight) + 1);
                    this.paramsToQuery.mapDepWeight[due] = Math.max(...allDepWeight);
                }
            } else {
                allDepWeight.push(Math.max(...allDepWeight) + 1);
                this.paramsToQuery.mapDepWeight[due] = Math.max(...allDepWeight);
            }          
        });
        newData.forEach((item) => {
            if (this.paramsToQuery.mapDepWeight[item['DUE']]) {
                item['ROW_WEIGHT'] = this.paramsToQuery.mapDepWeight[item['DUE']];
            }
        });
        return newData.sort((a, b) => {
            if (a['ROW_WEIGHT'] > b['ROW_WEIGHT']) {
                return 1;
            } else if (a['ROW_WEIGHT'] < b['ROW_WEIGHT']) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    /* 
    * Тут обрабатываем строки берём
    */
    initWeightSortOrg(newData: any[]) {
        const allOrgWeight: number[] = [0];
        Object.keys(this.paramsToQuery.mapOrgWeight).forEach((org) => {
            if (org === '0.') {
                this.paramsToQuery.mapOrgWeight[org] = 0;
            } else if (this.paramsToQuery.mapOrgWeight[org].size === 1) {
                const weight: number = Array.from<number>(this.paramsToQuery.mapOrgWeight[org])[0];
                if (allOrgWeight.indexOf(weight) === -1) {
                    allOrgWeight.push(weight);
                    this.paramsToQuery.mapOrgWeight[org] = weight;
                } else {
                    allOrgWeight.push(Math.max(...allOrgWeight) + 1);
                    this.paramsToQuery.mapOrgWeight[org] = Math.max(...allOrgWeight);
                }
            } else {
                allOrgWeight.push(Math.max(...allOrgWeight) + 1);
                this.paramsToQuery.mapOrgWeight[org] = Math.max(...allOrgWeight);
            }          
        });
        newData.forEach((item) => {
            if (this.paramsToQuery.mapOrgWeight[item['DUE']]) {
                item['ROW_WEIGHT'] = this.paramsToQuery.mapOrgWeight[item['DUE']];
            }
        });
        return newData.sort((a, b) => {
            if (a['ROW_WEIGHT'] > b['ROW_WEIGHT']) {
                return 1;
            } else if (a['ROW_WEIGHT'] < b['ROW_WEIGHT']) {
                return -1;
            } else {
                return 0;
            }
        });

    }
    getNewRowToTable(arrayAns, tableHeader: ITableHeader[], objectMap): any[] {
        const newData = [];
        this.selectedRow = [];
        if (arrayAns[EQueryPosition.department].length > 0) {
            arrayAns[EQueryPosition.department] = this.initWeightSortDep(arrayAns[EQueryPosition.department]);
        }
        if (arrayAns[EQueryPosition.organiz].length > 0) {
            arrayAns[EQueryPosition.organiz] = this.initWeightSortOrg(arrayAns[EQueryPosition.organiz]);
        }
        this.deloRights22 = '' + this.listRight.filter((r) => r.key === ETypeDeloRight.IntroductionOfDraftResolutions)[EFindRight.curentRight].value;
        newData.push({'CLASSIF_NAME': 'Должностные лица и подразделения', rowNotCount: true, background: 'white'}); /* 'bold': true,  */
        if (arrayAns && arrayAns[EQueryPosition.department]) {
            arrayAns[EQueryPosition.department].forEach((dep) => {
                if (this.maxWeightDep < dep['ROW_WEIGHT']) {
                    this.maxWeightDep = dep['ROW_WEIGHT'];
                }
                this.createDepRow(dep, tableHeader, objectMap);
                if (dep['key'] === '0.') {
                    newData.unshift(dep);
                } else {
                    newData.push(dep);
                }
            });
        }
        newData.push({'CLASSIF_NAME': 'Организации', rowNotCount: true, heightCount: 2, background: 'white'}); /* 'bold': true,  , 'style': {height: '80px'}*/
        if (arrayAns && arrayAns[EQueryPosition.organiz]) {
            arrayAns[EQueryPosition.organiz].forEach((org) => {
                if (this.maxWeightOrg < org['ROW_WEIGHT']) {
                    this.maxWeightOrg = org['ROW_WEIGHT'];
                }
                this.createOrgRow(org, tableHeader, objectMap);
                newData.push(org);
            });
        }
        return newData;
    }
    updateWeight(queryAll) {
        const alreadyWeight = new Map();
        if (this.paramsToQuery && (this.paramsToQuery.mapOrgWeight || this.paramsToQuery.mapDepWeight)) {
            queryAll.forEach((query) => {
                if (query.requestUri && query.requestUri.indexOf('USER_ORGANIZ_List') !== -1) { // организации
                    const weighNew = this.paramsToQuery.mapOrgWeight['DUE'];
                    if (weighNew && query.data['WEIGHT'] !== weighNew && (query.method === 'POST' || query.method === 'MERGE')) {
                        query.data['WEIGHT'] = weighNew;
                        alreadyWeight.set(query.data['DUE'] + '_' + query.data['FUNC_NUM'], true);
                    }
                }
                if (query.requestUri && query.requestUri.indexOf('USERDEP_List') !== -1) { // подразделения
                    const weighNew = this.paramsToQuery.mapDepWeight['DUE'];
                    if (weighNew && query.data['WEIGHT'] !== weighNew) {
                        query.data['WEIGHT'] = weighNew;
                        alreadyWeight.set(query.data['DUE'] + '_' + query.data['FUNC_NUM'], true);
                    }
                }
            });
            this.curentUser.USERDEP_List.forEach((dep) => {
                if (this.paramsToQuery.mapDepWeight[dep['DUE']] && this.paramsToQuery.mapDepWeight[dep['DUE']] !== dep['WEIGHT'] && !alreadyWeight.has(dep['DUE'] + '_' + dep['FUNC_NUM'])) {
                    dep['WEIGHT'] = this.paramsToQuery.mapDepWeight[dep['DUE']];
                    queryAll.push({
                        requestUri: `USER_CL(${this.curentUser.ISN_LCLASSIF})/USERDEP_List('${this.curentUser.ISN_LCLASSIF} ${dep['DUE']} ${dep['FUNC_NUM']}')`,
                        method: 'MERGE',
                        data: {
                            WEIGHT: this.paramsToQuery.mapDepWeight[dep['DUE']],
                            DUE: dep['DUE'],
                            FUNC_NUM: dep['FUNC_NUM']
                        }
                    });
                }
            });
            this.curentUser['USER_ORGANIZ_List'].forEach((org) => {
                if (this.paramsToQuery.mapOrgWeight[org['DUE']] &&
                this.paramsToQuery.mapOrgWeight[org['DUE']] !== org['WEIGHT'] &&
                !alreadyWeight.has(org['DUE'] + '_' + org['FUNC_NUM']) &&
                this.tabelData.tableHeader.findIndex((header) => +header.id + 1 === org.FUNC_NUM) !== -1) {
                    org['WEIGHT'] = this.paramsToQuery['mapOrgWeight'][org['DUE']];
                    queryAll.push({
                        requestUri: `USER_CL(${this.curentUser.ISN_LCLASSIF})/USER_ORGANIZ_List('${this.curentUser.ISN_LCLASSIF} ${org['DUE']} ${org['FUNC_NUM']}')`,
                        method: 'MERGE',
                        data: {
                            WEIGHT: this.paramsToQuery.mapOrgWeight[org['DUE']],
                            DUE: org['DUE'],
                            FUNC_NUM: org['FUNC_NUM']
                        }
                    });
                }
            });
        }
    }
    createDepRow(dep, tableHeader: ITableHeader[], objectMap ) {
        dep['key'] = dep['DUE'];
        if (dep['DUE'] === '0.') {
            dep['rowNotCount'] = true;
        }
        if (dep['DELETED'] === 1) {
            dep['style'] = {color: '#BABABA'}
        }
        tableHeader.forEach((header) => {
            const flagDisabled = dep['key'] !== '0.' && header['data'] && header['data']['checkBoxAll'] ? this.curentUser.USERDEP_List.findIndex((item) => item['DUE'] === '0.' && ('' + (item['FUNC_NUM'] - 1)) === header.id) !== -1 : false;
            let deep = objectMap['mapDepInfo'].get(dep['key'] + '_' + header.id);
            deep = deep ? deep['DEEP'] : undefined;
            if (header['data'] && header['data']['optionBtn'] && dep['key'] !== '0.') { // тут добавляются button
                dep[header.id] = {
                    type: dep['IS_NODE'] === 0 ? ECellToAll.buttons : ECellToAll.checkbox,
                    value: deep
                };
                if (dep['IS_NODE'] === 0) {
                    dep[header.id]['info'] = [
                        {
                            id: 1,
                            title: 'С ВЛ.',
                            disabled: flagDisabled,
                            click: () => {this.clickToButton(dep['key'], header.id, 1)},
                            active: deep === 1,
                            width: '54px'
                        },
                        {
                            id: 0,
                            title: 'БЕЗ ВЛ.',
                            disabled: flagDisabled,
                            click: () => {this.clickToButton(dep['key'], header.id, 0)},
                            active: deep === 0,
                            width: '54px'
                        },
                        {
                            id: undefined,
                            title: 'НЕТ',
                            disabled: flagDisabled,
                            click: () => {this.clickToButton(dep['key'], header.id, undefined)},
                            active: deep === undefined,
                            width: '54px'
                        },
                    ];
                } else {
                    dep[header.id]['check'] = deep !== undefined;
                    dep[header.id]['disabled'] = flagDisabled;
                    dep[header.id]['click'] = ($event) => {this.chechNewInfoDep(dep['DUE'], header.id, $event)};
                }
            } else if (header.id !== 'CLASSIF_NAME') {
                if (header['data'] && header['data']['onlyDL'] && dep['IS_NODE'] === 0 && dep['key'] !== '0.') { // если в столбце должны быть только ДЛ то для подразделений пустота
                    dep[header.id] = '';
                } else if ((!header['data'] || !header['data']['checkBoxAll']) && dep['key'] === '0.') {
                    dep[header.id] = '';
                } else if (objectMap['mapDep'].get(dep['DUE'])) {
                    const toAllTitle = header.id === ETypeDeloRight.IntroductionOfDraftResolutions ? 'Рассылка проект. рез.' : 'За всех'
                    /* 
                    * Особый случай для права ввод проектов резолюций строчка За всех
                    */
                    if (header.id === ETypeDeloRight.IntroductionOfDraftResolutions) {
                        if (this.deloRights22 && dep['key'] === '0.') {
                            deep = this.deloRights22 === '2' ? true : undefined;
                        }
                    }
                    dep[header.id] = {
                        type: ECellToAll.checkbox,
                        disabled: flagDisabled,
                        check: deep !== undefined,
                        click: ($event) => {this.chechNewInfoDep(dep['DUE'], header.id, $event)},
                        title: dep['key'] === '0.' ? toAllTitle : '',
                    };
                } else {
                    dep[header.id] = {type: ECellToAll.checkbox, disabled: flagDisabled, check: false, click: () => {this.chechNewInfoDep(dep['DUE'], header.id, Boolean(deep))}};
                }
            } else {
                if(dep['key'] === '0.') {
                    dep['CLASSIF_NAME'] = 'За всех';
                } else {
                    dep['' + header.id] = {
                        type: ECellToAll.checkbox,
                        check: Boolean(deep),
                        click: ($event) => {this.selectRow(dep, $event)},
                        title: dep['CLASSIF_NAME'],
                        Icons: dep['DELETED'] === 1 ? ['eos-adm-icon-bin-grey'] : undefined
                    };
                }
            }
        });
    }
    
    createOrgRow(org, tableHeader: ITableHeader[], objectMap) {
        org['key'] = org['DUE'];
        if (org['DELETED'] === 1) {
            org['style'] = {color: '#BABABA'}
        }
        tableHeader.forEach((header) => {
            if (header['data'] && header['data']['data']['rightContent'] !== E_RIGHT_DELO_ACCESS_CONTENT.departOrganiz) {
                org[header.id] = '';
            } else if (header.id !== 'CLASSIF_NAME') {
                if (objectMap['mapOrg'].get(org['DUE'])) {
                    let deep = objectMap['mapOrgInfo'].get(org['key'] + '_' + header.id);
                    deep = deep ? 1 : undefined;
                    org[header.id] = {
                        type: ECellToAll.checkbox,
                        check: deep !== undefined,
                        click: ($event) => {this.chechNewInfoOrg(org, header.id, $event)},
                        title: org['key'] === '0.' ? 'За всех' : ''
                    };
                } else  {
                    org[header.id] = {type: ECellToAll.checkbox, check: false, click: ($event) => {this.chechNewInfoOrg(org, header.id, $event)}};
                }
            } else {
                if(org['key'] === '0.') {
                    org['CLASSIF_NAME'] = 'За всех';
                } else {
                    org['' + header.id] = {
                        type: ECellToAll.checkbox,
                        check: false,
                        click: ($event) => {this.selectRow(org, $event)},
                        title: org['CLASSIF_NAME'],
                        Icons: org['DELETED'] === 1 ? ['eos-adm-icon-bin-grey'] : undefined
                    };
                }
            }
        });
    }
    chechNewInfoDep(due, funcNum, $event) {
        const checked = $event.target ? $event.target.checked : $event;
        if(due === '0.' && funcNum === ETypeDeloRight.IntroductionOfDraftResolutions) { // Разрешить операцию рассылки проекта резолюции
            this.deloRights22 = checked ? '2' : '1';
            return;
        }
        if (due === '0.' && funcNum !== ETypeDeloRight.IntroductionOfDraftResolutions) { // если поставили галочку за всех то особое поведение
            this.updateAllCheck(funcNum, checked);
        } else {
            this.updatePutchValue(due, funcNum, checked);
        }
    }
    clickToButton(due, funcNum, deep) {
        const newUserDep: USERDEP = this._userParmSrv.createEntyti<USERDEP>({
            ISN_LCLASSIF: this._userParmSrv.userContextId,
            DUE: due,
            FUNC_NUM: +funcNum + 1,
            WEIGHT: -1,
            DEEP: deep,
            ALLOWED: null,
        }, 'USERDEP');
        const item = this.listRightNew.get(newUserDep.DUE + '_' + funcNum);
        const findInd = this.curentUser.USERDEP_List.findIndex((dep) => dep['DUE'] === newUserDep.DUE && +dep['FUNC_NUM'] === +(+funcNum + 1));
        if (deep === undefined) {
            if (item && item['method'] === 'POST') {
                this.listRightNew.delete(newUserDep.DUE + '_' + funcNum);
            } else {
                this.listRightNew.set(newUserDep.DUE + '_' + funcNum, {
                    method: 'DELETE',
                    due: newUserDep.DUE,
                    user_cl: true,
                    data: newUserDep,
                    __metadata: {
                        __type: "USERDEP"
                    }
                });
            }
        } else {
            if (item && item['method'] === 'DELETE') {
                this.listRightNew.delete(newUserDep.DUE + '_' + funcNum);
            } else {
                this.listRightNew.set(newUserDep.DUE + '_' + funcNum, {
                    method: findInd === -1 ? 'POST' : 'MERGE',
                    due: newUserDep.DUE,
                    user_cl: true,
                    data: newUserDep,
                    __metadata: {
                        __type: "USERDEP"
                    }
                });
            }
        }
        this.tabelData.data.forEach((item) => {
            if (item['DUE'] === due) {
                item[funcNum]['value'] = deep;
                item[funcNum]['info'].forEach((btn) => {
                    if (btn.id === deep) {
                        btn.active = true;
                    } else {
                        btn.active = false;
                    }
                });
            }
        });
    }
    updatePutchValue(due, funcNum, checked) {
        const newUserDep: USERDEP = this._userParmSrv.createEntyti<USERDEP>({
            ISN_LCLASSIF: this._userParmSrv.userContextId,
            DUE: due,
            FUNC_NUM: +funcNum + 1,
            WEIGHT: -1,
            DEEP: 1,
            ALLOWED: null,
        }, 'USERDEP');
        const check = this.listRightNew.get(newUserDep.DUE + '_' + funcNum);
        if (checked) {
            if (!check) {
                this.listRightNew.set(newUserDep.DUE + '_' + funcNum, {
                    method: 'POST',
                    due: newUserDep.DUE,
                    data: newUserDep
                });
            } else if(check['method'] === 'DELETE') {
                this.listRightNew.delete(newUserDep.DUE + '_' + funcNum);
            }
        } else {
            if (!check) {
                this.listRightNew.set(newUserDep.DUE + '_' + funcNum, {
                    method: 'DELETE',
                    due: newUserDep.DUE,
                    data: newUserDep
                });
            } else if(check['method'] !== 'DELETE') {
                this.listRightNew.delete(newUserDep.DUE + '_' + funcNum);
            }
        }
    }
    chechNewInfoOrg(node, funcNum, $event) {
        const checked = $event.target ? $event.target.checked : $event;
        const newUserDep: USER_ORGANIZ = this._userParmSrv.createEntyti<USER_ORGANIZ>({
            ISN_LCLASSIF: this._userParmSrv.userContextId,
            DUE: node['DUE'],
            FUNC_NUM: +funcNum + 1,
            WEIGHT: node['ROW_WEIGHT'],
        }, 'USER_ORGANIZ');
        if (checked) {
            const check = this.listRightNew.get(newUserDep.DUE + '_' + funcNum);
            if (!check) {
                this.listRightNew.set(newUserDep.DUE + '_' + funcNum, {
                    method: 'POST',
                    due: newUserDep.DUE,
                    data: newUserDep
                });
            } else if (check['method'] === 'DELETE') {
                this.listRightNew.delete(newUserDep.DUE + '_' + funcNum);
            }
        } else {
            const check = this.listRightNew.get(newUserDep.DUE + '_' + funcNum);
            if (!check) {
                this.listRightNew.set(newUserDep.DUE + '_' + funcNum, {
                    method: 'DELETE',
                    due: newUserDep.DUE,
                    data: newUserDep
                });
            } else if (check['method'] === 'POST') {
                this.listRightNew.delete(newUserDep.DUE + '_' + funcNum);
            }
        }
    }
    /* 
    * Метод обновляющий таблицу при нажатии на галочку За всех
    */
    updateAllCheck(funcNum: string, flag: boolean) {
        this.tabelData.data.forEach((item) => {
            if (item['key'] === '0.' && item.__metadata.__type === 'DEPARTMENT') {
                if (item[funcNum].type === ECellToAll.checkbox) {
                    this.updatePutchValue(item['key'], funcNum, flag);
                    item[funcNum]['check'] = flag;
                }
            } else if(item[funcNum] && item.__metadata.__type === 'DEPARTMENT') {
                if (item[funcNum].type === ECellToAll.checkbox) {
                    if (item[funcNum]['check'] && flag) {
                        this.updatePutchValue(item['key'], funcNum, !flag);
                    } else if (!item[funcNum]['check'] && !flag) {
                        this.updatePutchValue(item['key'], funcNum, !flag);
                    }
                    item[funcNum]['check'] = !flag;
                    item[funcNum]['disabled'] = flag;
                }
                if (item[funcNum].type === ECellToAll.buttons) {
                    let checked = false;
                    item[funcNum]['info'].forEach((btn) => {
                        btn['disabled'] = flag;
                        if ((btn.id === 0 || btn.id === 1) && btn.active) {
                            btn['active'] = true;
                            checked = true;
                        }
                        if (!flag && btn.id === 1) {
                            item[funcNum]['value'] = 1;
                            this.clickToButton(item['key'], funcNum, 1);
                        } else if (btn.id === undefined && checked) {
                            btn['active'] = true;
                            item[funcNum]['value'] = undefined;
                            this.clickToButton(item['key'], funcNum, undefined);
                        }
                    });
                }
            }
        });
    }
    getParamsToQuery(curentUser): IAbsRightMapSet {
        this.paramsToQuery = undefined;
        const newMapDep = [];
        const newMapOrg = [];
        const mapDep = new Map();
        const mapOrg = new Map();
        const mapDepInfo = new Map();
        const mapOrgInfo = new Map();
        const mapDepWeight = {};
        const mapOrgWeight = {};
        curentUser.USERDEP_List.forEach((dep) => {
            if (mapDepWeight[dep['DUE']] === undefined) {
                mapDepWeight[dep['DUE']] = new Set([dep['WEIGHT']]);
            } else {
                mapDepWeight[dep['DUE']].add(dep['WEIGHT']);
            }
            newMapDep.push(dep['DUE']);
            mapDepInfo.set(dep['DUE'] + '_' + (+dep['FUNC_NUM'] - 1), dep);
            if (mapDep.has(dep['DUE'])) {
                mapDep.set(dep['DUE'], mapDep.get(dep['DUE']) + ' ' + dep['FUNC_NUM']);
            } else {
                mapDep.set(dep['DUE'], dep['FUNC_NUM']);
            }
        });
        curentUser['USER_ORGANIZ_List'].forEach((org) => {
            if (mapOrgWeight[org['DUE']] === undefined) {
                mapOrgWeight[org['DUE']] = new Set([org['WEIGHT']]);
            } else {
                mapOrgWeight[org['DUE']].add(org['WEIGHT']);
            }
            newMapOrg.push(org['DUE']);
            mapOrgInfo.set(org['DUE'] + '_' + (+org['FUNC_NUM'] - 1), org);
            if (mapOrg.has(org['DUE'])) {
                mapOrg.set(org['DUE'], mapOrg.get(org['DUE']) + ' ' + org['FUNC_NUM']);
            } else {
                mapOrg.set(org['DUE'], org['FUNC_NUM']);
            }
        });
        this.paramsToQuery = {
            newMapDep: newMapDep, // тут храним все DUE подразделениq которые меня интересуют
            newMapOrg: newMapOrg,// тут храним все DUE организаций которые меня интересуют
            mapDep: mapDep, // сохраняем все FUNC_NUM
            mapOrg: mapOrg, // сохраняем все FUNC_NUM
            mapDepInfo: mapDepInfo, // сохраняем всю информацию 
            mapOrgInfo: mapOrgInfo, // сохраняем всю информацию 
            mapOrgWeight: mapOrgWeight, // сохраняем все веса организаций чтобы привести таблицу в норму
            mapDepWeight: mapDepWeight, // сохраняем все веса департаментов чтобы привести таблицу в норму
        }
        return this.paramsToQuery;
    }
    /* 
    * Тут происходит перенос изменений из нового окна, в старые абсолютные права
    */
    updateCurentUser() {
        let flagDeloRights = true;
        this.listRightNew.forEach((value, key) => {
            const right = this.listRight.filter((r) => r.key === key.split('_')[1])[EFindRight.curentRight];
            if (right) {
                if (!right.value) {
                    right.value = this.deloRights22 === '2' ? 2 : 1;
                    flagDeloRights = false;
                }
                right.pushChange(value);
            }
            if ((value.method === 'POST' || value.method === 'MERGE') && value['data'].__metadata.__type === 'USERDEP') {
                if (value.method === 'MERGE') {
                    let flag = true;
                    this._userParmSrv.curentUser.USERDEP_List.forEach((dep) => {
                        if (dep['DUE'] === value.due && dep['FUNC_NUM'] === value['data']['FUNC_NUM']) {
                            flag = false;
                            dep['DEEP'] = value['data']['DEEP'];
                        }
                    });
                    if (flag) {
                        this._userParmSrv.curentUser.USERDEP_List.push(value.data);
                    }
                } else {
                    this._userParmSrv.curentUser.USERDEP_List.push(value.data);
                }
            }
            if ((value.method === 'POST' || value.method === 'MERGE') && value['data'].__metadata.__type === 'USER_ORGANIZ') {
                this._userParmSrv.curentUser['USER_ORGANIZ_List'].push(value.data);
            }
        });
        this._userParmSrv.curentUser.USERDEP_List = this._userParmSrv.curentUser.USERDEP_List.filter((item) => {
            const query = this.listRightNew.get(item.DUE + '_' + (item.FUNC_NUM - 1));
            if (query && query.method === 'DELETE') {
                return false;
            }
            return true;
        });
        this._userParmSrv.curentUser['USER_ORGANIZ_List'] = this._userParmSrv.curentUser['USER_ORGANIZ_List'].filter((item) => {
            const query = this.listRightNew.get(item.DUE + '_' + (item.FUNC_NUM - 1));
            if (query && query.method === 'DELETE') {
                return false;
            }
            return true;
        });
        /* 
        * Ососбое поведение для Разрешить операцию рассылки проекта резолюции
        */
        const right = this.listRight.filter((r) => r.key === ETypeDeloRight.IntroductionOfDraftResolutions)[EFindRight.curentRight];
        if (flagDeloRights && this.deloRights22 !== '' + right.value) {
            right.value = +this.deloRights22;
        }
        this._userParmSrv.curentUser.USERDEP_List.forEach((depart) => {
            if (this.paramsToQuery.mapDepWeight[depart.DUE] !== undefined &&
                this.paramsToQuery.mapDepWeight[depart.DUE] !== depart.WEIGHT &&
                this.tabelData.tableHeader.findIndex((header) => +header.id + 1 === depart.FUNC_NUM) !== -1) {
                const right = this.listRight.filter((r) => r.key === '' + (depart.FUNC_NUM - 1))[EFindRight.curentRight];
                right.touched = true;
            }
        });
        this.listRightNew.clear();
    }
    clearInfo() {
        this.paramsToQuery = undefined;
    }
    selectRow(item: string, $event) {
        if ($event.target.checked) {
            this.selectedRow.push(item);
        } else {
            this.selectedRow = this.selectedRow.filter((dep) => item['DUE'] !== dep['DUE']);
        }
        this.updateBtn();
    }
    updateBtn() {
        let ind;
        if (this.selectedRow[0]) {
            this.tabelData.data.forEach((item, index) => {
                if (this.selectedRow[0]['DUE'] === item['DUE']) {
                    ind = index;
                }
            });
        }
        this.tabelData.tableBtn.forEach((btn) => {
            if (btn.id === 'deleted') {
                btn.disable = !this.selectedRow.length;
            }
            if (btn.id === 'up') {
                btn.disable = this.selectedRow.length !== 1 || typeof(this.tabelData.data[ind - 1]['CLASSIF_NAME']) === 'string';
            }
            if (btn.id === 'down') {
                btn.disable = this.selectedRow.length !== 1 || this.tabelData.data[ind + 1] === undefined || typeof(this.tabelData.data[ind + 1]['CLASSIF_NAME']) === 'string';
            }
            if (btn.id === 'export') {
                
                btn.disable = !(this.tabelData.data.length > 3);
            }
        });
    }
    sortStringVew() {
        let ind;
        if (this.selectedRow[0]) {
            this.tabelData.data.forEach((item, index) => {
                if (this.selectedRow[0]['DUE'] === item['DUE']) {
                    ind = index;
                }
            });
        }
        this.tabelData.tableBtn.forEach((btn) => {
            if (btn.id === 'sort') {
                btn.active = !btn.active;
            }
            if (btn.id === 'up') {
                btn.notView = !btn.notView;
                btn.disable = this.selectedRow.length !== 1 || typeof(this.tabelData.data[ind - 1]['CLASSIF_NAME']) === 'string';
            }
            if (btn.id === 'down') {
                btn.notView = !btn.notView;
                btn.disable = this.selectedRow.length !== 1 || this.tabelData.data[ind + 1] === undefined || typeof(this.tabelData.data[ind + 1]['CLASSIF_NAME']) === 'string';
            }
        });
    }
    sortRow(whereMove) { // up +1
        let ind;
        let tempSecond;
        let itemMove;
        this.tabelData.data.forEach((item, index) => {
            if (item['DUE'] === this.selectedRow[0]['DUE']) {
                ind = index;
                const tempWeight = this.tabelData.data[index - whereMove]['ROW_WEIGHT'];
                this.tabelData.data[index - whereMove]['ROW_WEIGHT'] = item.ROW_WEIGHT;
                tempSecond = this.tabelData.data[index - whereMove];
                item.ROW_WEIGHT = tempWeight;
                itemMove = item;
            }
        });
        this.tabelData.data[ind - whereMove] = this.tabelData.data[ind];
        this.tabelData.data[ind] = tempSecond;
        if (itemMove.__metadata.__type === 'DEPARTMENT' && this.paramsToQuery.mapDepWeight[itemMove['DUE']] !== undefined) {
            this.paramsToQuery.mapDepWeight[tempSecond['DUE']] = tempSecond['ROW_WEIGHT'];
            this.paramsToQuery.mapDepWeight[itemMove['DUE']] = itemMove['ROW_WEIGHT'];
        } else if(this.paramsToQuery.mapOrgWeight[this.selectedRow[0]['DUE']] !== undefined) {
            this.paramsToQuery.mapOrgWeight[tempSecond['DUE']] = tempSecond['ROW_WEIGHT'];
            this.paramsToQuery.mapOrgWeight[itemMove['DUE']] = itemMove['ROW_WEIGHT'];
        }
        this.updateBtn();
    }
    
    action($event) {
        switch ($event) {
            case 'addDep':
                this.addDep();
                break;
            case 'addOrg':
                this.addOrg();
                break;
            case 'deleted':
                this.deletedRow();
                break;
            case 'sort':
                this.sortStringVew();
                break;
            case 'up':
                this.sortRow(1);
                break;
            case 'down':
                this.sortRow(-1);
                break;
            case 'export':
                this.export();
                break;
            default:
                break;
        }
    }
    export() {
        const headerHTML = [];
        /* 
        * Формирование шапки таблицы
        */
        this.tabelData.tableHeader.forEach((header) => {
            headerHTML.push(`<th width=${header.style['min-width']}>${header.title}</th>`)
        });
        const allRow = [];
        /* 
        * Формирование строк таблицы
        */
        this.tabelData.data.forEach((row) => {
            const oneRow = [];
            if (row['bold']) {
                oneRow.push(`<td colspan="${this.tabelData.tableHeader.length}">${row['CLASSIF_NAME']}</td>`); // td
            } else {
                this.tabelData.tableHeader.forEach((header) => {
                    if (row[header.id]) {
                        if (!row[header.id].type || header.id === 'CLASSIF_NAME') {
                            oneRow.push(`<td>${row[header.id].title || row[header.id] || ' '}</td>`)
                        } else if(row[header.id].type === ECellToAll.checkbox && header.id) {
                            oneRow.push(`<td><input type="checkbox" ${row[header.id]['check'] ? 'checked' : ''} disabled><label></label>${row[header.id].title || ' '}</td>`)
                        } else if(row[header.id].type === ECellToAll.buttons && header.id) {
                            let title = +row[header.id]['value'] === 0 ? 'БЕЗ ВЛ.': 'С ВЛ.';
                            title = row[header.id]['value'] === undefined ? '' : title;
                            oneRow.push(`<td><input type="checkbox" ${row[header.id]['value'] !== undefined ? 'checked' : ''} disabled><label></label>${title}</td>`);
                        } else {
                            oneRow.push(`<td> </td>`);
                        }
                    } else {
                        oneRow.push(`<td> </td>`);
                    }
                });
            }
            allRow.push('<tr>' + oneRow.join('') + '</tr>')
        });
        let html = HTML_ABSOLUT_RIGHT_REPORT
            .replace(HTML_ABSOLUT_RIGH_TITLE, `Права пользователя ${this.curentUser.SURNAME_PATRON}. Участники документооборота авторизованных прав`)
            .replace(HTML_ABSOLUT_RIGH_HEADER, headerHTML.join(''))
            .replace(HTML_ABSOLUT_ROW, allRow.join(''))
            .replace(HTML_ABSOLUT_RIGH_DATE, new Date().toString());
            
        const blobHtml = new Blob([html], {type: 'text/html;charset=utf-8'});
        saveAs(blobHtml, `Права пользователя ${this.curentUser.SURNAME_PATRON}. Участники документооборота авторизованных прав.html`);
    }
}
