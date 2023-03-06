import { Component, OnInit } from '@angular/core';

import { DEPARTMENT, USER_CL, CB_PRINT_INFO, SEV_ASSOCIATION, CABINET, ORGANIZ_CL, CONTACT } from '../interfaces/structures';
import { /*ALL_ROWS,*/ _ES } from '../core/consts';
import { PipRX } from '../services/pipRX.service';
// import { IEnt } from 'eos-rest';
import { SevIndexHelper } from '../services/sevIndex-helper';
//

// tslint:disable-next-line:class-name
class vmDEPARTMENT {
    row: DEPARTMENT;
    parentRow: DEPARTMENT;

    CB_PRINT_INFO: CB_PRINT_INFO;
    SEV_ASSOCIATION: SEV_ASSOCIATION;
    USER: USER_CL;
    public cabinet: CABINET;
    ORGANIZ: ORGANIZ_CL;

    static Load(pip: PipRX, due: string, _forEdit: boolean): Promise<vmDEPARTMENT> {
        // const startReadTime: any = new Date();

        // Читаем себя, НЕ из кеша
        const rDep = pip.read<DEPARTMENT>({ DEPARTMENT: due });
        // Здесь предсталены все запросы, которые вспомнил для подробной инофрмации о подразделении
        // в принципе ORGANIZ_CL, CABINET, USER_CL(?) можно и кешировать

        // загружаем от корня дерева до запрашиваемой вершины
        // поскольку органицация, картотека и чтото еще могут быть определены выше по дереву

        const rParents = pip.cache.read<DEPARTMENT>({ DEPARTMENT: treeDues(parentDue(due)) });

        const rDeps = Promise.all([rDep, rParents])
            .then(([dep, parents]) => {
                parents.push(dep[0]);
                parents.sort((a, b) => {
                    return a.DUE.length - b.DUE.length;
                });
                // console.log('Чтение ДЛ шаг1:' + (<any>new Date() - startReadTime) + 'ms');
                return parents;
            });
        // TODO: разобраться почему без прохода через промис запрос выполняется дважды
        // или Pipe для крепкости переписать на промисы

        // ищем пользователя ассоцированного с показываемым дл
        const rUser = pip.read<USER_CL>({ USER_CL: PipRX.criteries({ DUE_DEP: due }) });
        const rDopInfo = rDeps.then(d => {
            const l = d.length - 1;
            // загружаем доп. инфо о ДЛ и подразделении
            const rPrintInfo = pip.read<CB_PRINT_INFO>({
                CB_PRINT_INFO: PipRX.criteries({
                    ISN_OWNER: d[l].ISN_NODE.toString() + '|' + d[l].ISN_HIGH_NODE.toString(),
                    OWNER_KIND: '104'
                })
            });
            let rOrg = Promise.resolve<ORGANIZ_CL[]>([]);
            for (let i = l; i !== -1; i--) {
                if (d[i].DUE_LINK_ORGANIZ !== null) {
                    rOrg = pip.cache.read<ORGANIZ_CL>({ ORGANIZ_CL: [d[i].DUE_LINK_ORGANIZ] });
                    break;
                }
            }
            const rCab = d[l].ISN_CABINET === null ? Promise.resolve<CABINET[]>([])
                : pip.cache.read<CABINET>({ CABINET: [d[l].ISN_CABINET] });
            return Promise.all([rPrintInfo, rOrg, rCab]);
        });
        // загружаем индекс СЭВ
        const rSevIndex = pip.read<SEV_ASSOCIATION>({ SEV_ASSOCIATION: [SevIndexHelper.CompositePrimaryKey(due, 'DEPARTMENT')] });
        return Promise.all([rDeps, rUser, rDopInfo, rSevIndex])
            .then(([a, _b, [pi, org, cab], d]) => {
                // console.log('Чтение ДЛ ' + (<any>new Date() - startReadTime));
                const result = new vmDEPARTMENT();
                result.row = a[a.length - 1];
                // tslint:disable-next-line:no-debugger
                // debugger;

                // TODO: решить нужно ли делать стабы, пока сделал
                // решил делать стабы(запись со всеми нужными properties), тогда биндинг проще
                // и можно сразу разобраться, что делать
                // ничего - если не заполнили ценных полей или ничего не изменили
                // INSERT, если записи нет, но чтото заполнили
                // UPDATE, если чтото изменили
                result.CB_PRINT_INFO = pip.entityHelper.prepareForEdit(pi[0], 'CB_PRINT_INFO');
                result.ORGANIZ = pip.entityHelper.prepareForEdit(org[0], 'ORGANIZ_CL');
                // Здесь врапить не надо - запись кабинете мы редатировать не должны
                // а ссылку на него можно и по другому поставить.
                result.cabinet = <CABINET>cab[0];
                result.SEV_ASSOCIATION = pip.entityHelper.prepareForEdit<SEV_ASSOCIATION>(d[0], 'SEV_ASSOCIATION');

                return result;
            });
    }
}


@Component({
    selector: 'eos-rest-department',
    templateUrl: './department.component.html'
})
export class DepartmentComponent implements OnInit {
    treeItems: DEPARTMENT[] = [];
    listItems: DEPARTMENT[] = [];
    currentListItem: DEPARTMENT;
    detailedItem: any;

    constructor(private pip: PipRX) { }

    ngOnInit() {
        this.getData();
    }

    getData() {
        this.pip.cache.read<DEPARTMENT>({
            DEPARTMENT: PipRX.criteries({ LAYER: '0:2', IS_NODE: '0' })
            , orderby: 'DUE'
            , top: 100
        }).then(r => {
            this.treeItems = r;
        });
    }

    onSelectTreeItem(cur: DEPARTMENT): void {
        this.pip.read<DEPARTMENT>({
            DEPARTMENT: PipRX.criteries({ ISN_HIGH_NODE: cur.ISN_NODE.toString() })
            , orderby: 'WEIGHT'
        }).then(r => { this.listItems = r; });
    }

    onSelectListItem(cur: DEPARTMENT): void {
        this.currentListItem = cur;
        vmDEPARTMENT.Load(this.pip, cur.DUE, false)
            .then(vm => { this.detailedItem = vm; });
    }

    onAdd() {
        /*
        const tisn = this.pip.sequenceMap.GetTempISN();
        const tmp = this.pip.prepareAdded<DEPARTMENT>( {
            DUE: this.currentItem.DUE + tisn + '.',
            ISN_NODE: tisn,
            CLASSIF_NAME: 'Добавляем?'
        }, 'DEPARTMENT');
        this.currentItem = tmp;
        */
    }

    onSave() {
        // tslint:disable-next-line:no-debugger
        debugger;
        const item = this.detailedItem;
        const changed = [];
        if (SevIndexHelper.PrepareForSave(item.SEV_ASSOCIATION, item.row)) {
            changed.push(item.SEV_ASSOCIATION);
        }
        if (this.prepareCB_PRINT_INFOforSave(item.CB_PRINT_INFO, item.row)) {
            changed.push(item.CB_PRINT_INFO);
        }
        const chl = this.pip.changeList(changed);
        this.pip.batch(chl, '')
            .then(() => {
                alert('oki');
            });
    }

    onAddContact() {
        // tslint:disable-next-line:no-debugger
        debugger;
        const organiz = <ORGANIZ_CL>this.detailedItem.ORGANIZ;
        if ( organiz.CONTACT_List === undefined) {
            organiz.CONTACT_List = [];
        }
        const tisn = this.pip.sequenceMap.GetTempISN();
        organiz.CONTACT_List.push(this.pip.entityHelper.prepareAdded<CONTACT>(
            {ISN_CONTACT: tisn, ISN_ORGANIZ: organiz.ISN_NODE, SURNAME: 'Портнов И.А. dnjhj'}, 'CONTACT'));
        const chl = this.pip.changeList([organiz]);
            this.pip.batch(chl, '').then((r) => {
                alert(this.pip.sequenceMap.GetFixed(tisn));
            });
    }

    onPreparePrintInfo() {
        const q = { SURNAME: 'Иванов', NAME: 'Иван', PATRON: 'Иванович', GENDER: 2, DUTY: 'начальника' };
        // вызов в случае GENDER=null - его надо опустить. Вообще, пустые поля походе надо опускать
        // const q = {SURNAME: 'Иванов', NAME: 'Иван', PATRON: 'Иванович', DUTY: 'начальника'};

        this.pip.read<CB_PRINT_INFO>({ PreparePrintInfo: PipRX.args(q) })
            .then(() => {
                // console.log(res);
            });
    }

    private prepareCB_PRINT_INFOforSave(rec: CB_PRINT_INFO, owner: DEPARTMENT): boolean {
        // удаление CB_PRINT_INFO, если все поля в нем пустые
        // как сраснить все поля не пишу - они разные для подразделения и ДЛ.
        // это пример создания, редактирования, удаления записи
        if ((rec.SURNAME_DP === null) || (rec.SURNAME_DP.trim() === '')) {
            // tslint:disable-next-line:curly
            if (rec._State === _ES.Stub) return false;
            rec._State = _ES.Deleted;
        } else if (rec._State === _ES.Stub) {
            // Добавление - превращаем Stub в Added
            rec._State = _ES.Added;
            rec.ISN_OWNER = owner.ISN_NODE;
            rec.OWNER_KIND = 104;
        }
        return true;
    }
}


export function parentDue(due: string) {
    const ss = due.split('.');
    ss.pop();
    return ss.join('.') + '.';
}

export function treeDues(due: string) {
    const ss = due.split('.');
    const result = [];
    ss.pop();
    for (; ss.length > 0; ss.pop()) {
        result.push(ss.join('.') + '.');
    }
    return result;
}
