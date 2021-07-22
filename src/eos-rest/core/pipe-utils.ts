import { Metadata } from '../core/metadata';
import { URL_LIMIT } from './consts';
import { IEnt } from '../interfaces/interfaces';
import { _ES, _T } from '../core/consts';


export class Deferred<T> {
    promise: Promise<T>;
    resolve: (value?: T | PromiseLike<T>) => void;
    reject:  (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject  = reject;
        });
    }
}

export class PipeUtils {
    protected _metadata: Metadata;

    protected static distinctIDS(l: any[]): string {
        let result = ',';
        for (let i = 0; i < l.length; i++) {
            if (l[i] !== null) {
                const id = typeof (l[i]) !== 'string' ? (l[i] + ',') : ('\'' + l[i] + '\',');

                if (result.indexOf(',' + id) === -1) {
                    result += id;
                }
            }
        }
        result = result.substr(1, result.length - 2);
        return result;
    }

    protected static chunkIds(ids: any): string[] {
        const ss = ids.split(',');
        const result = [''];
        let cp = 0;
        for (let i = 0; i < ss.length; i++) {
            if (result[cp].length > URL_LIMIT) {
                result.push('');
                result[cp] = result[cp].substring(1);
                cp++;
            }
            result[cp] += ',' + ss[i];
        }
        result[cp] = result[cp].substring(1);
        return result;
    }

    private static combinePath(path: string, s: string) {
        if (path.length !== 0) { path += '/'; }
        return path + s;
    }

    public changeList(entities: IEnt[]) {
        // const startTime = new Date().getTime();

        const chr: any[] = [];
        for (let i = 0; i < entities.length; i++) {
            const it = entities[i];
            this.appendChange(it, chr, '');
        }
        // console.log('changeList ' + (new Date().getTime() - startTime));
        return chr;
    }

    protected nativeParser(data: any) {
        const md = data['odata.metadata'];
        const tn = md.split('#')[1].split('/')[0];
        const items = data.value || [data];
        const _sh = this.findVal(data, '_sh'); // если возвращает undefaned значит такого свойства нет
        if (_sh) {
            const names = {};
            // this.parseCompact(data, names);
            this.getFiniteValue(data, names);
        }
        if (tn !== 'Collection(Edm.Int32)' && tn !== 'Edm.String' && tn !== 'Int32') { // костыль для ответа от сопа по созданию пользователя
            this.parseEntity(items, tn);
        }
        if (data['$TotalRecords']) {
            items.TotalRecords = data['$TotalRecords'];
        }
        return items;
    }

    protected PKinfo(it: any) {
        const etn = this._metadata.etn(it);
        const et = this._metadata.typeDesc(etn);
        if (et.pk.indexOf(' ') !== -1) {
            const ss = et.pk.split(' ');
            const pkv = [];
            for (let i = 0; i < ss.length; i++) {
                pkv[i] = it[ss[i]];
            }
            return '(\'' + pkv.join(' ') + '\')';
        }
        const v = it[et.pk];
        return (et.properties[et.pk] === _T.s) ? ('(\'' + v + '\')') : ('(' + v + ')');
    }

    protected getAjax(url): Promise<any> {
        // const starttime: any = new Date();
        const xhr = new XMLHttpRequest();
        const result = new Deferred<string>();
        xhr.open('GET', url);

        xhr.onreadystatechange = function () {

            if (xhr.readyState > 3 && xhr.status === 200) {
                // console.log('чтение ' + (<any>new Date() - starttime).toString() + 'ms')
                // const ans = xhr.responseText;
                // const d = JSON.parse(ans);
                result.resolve(xhr.responseText);
                /**
                 Observable.fromPromise(this.getAjax(urls[0]).then(r => {
            return this.nativeParser(JSON.parse(r));
        }));
                 */
            } // success(xhr.responseText);
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('MaxDataServiceVersion', '3.0');
        xhr.setRequestHeader('Accept', 'application/json;odata=light;q=1,application/json;odata=minimalmetadata;');
        xhr.send();
        return result.promise;
    }
    /* findVal поиск ключа в объекте если ключ будет найден то функция вернёт его значения поиск выполняется через рекурсию */
    protected findVal(object: any, key: string) {
        let value;
        Object.keys(object).some((k) => {
            if (k === key) {
                value = object[k];
                return true;
            }
            if (object[k] && typeof object[k] === 'object') {
                value = this.findVal(object[k], key);
                return value !== undefined;
            }
        });
        return value;
    }
    private parseMoreJson(item: any/*, tn: string*/) {
        if (typeof(item._more_json) === 'string') {
            item._more_json = JSON.parse(item._more_json);
        }
        const exp = item._more_json.expand;
        if (exp) {
            for (const ln in exp) {
                if (exp.hasOwnProperty(ln)) {
                    item[ln] = exp[ln];
                }
            }

            delete item._more_json.expand;
        }
    }

    private parseEntity(items: any[], tn: string) {
        // TODO: если понадобится публичный, подумаем
        const t = (tn) ? this._metadata.typeDesc(tn) : undefined;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item._more_json) {
                this.parseMoreJson(item/*, tn*/);
            }
            for (const pn in item) {
                if (pn.indexOf('@') !== -1 || pn.indexOf('.') !== -1) {
                    delete item[pn];
                } else if (t) {
                    // const pt = t.properties[pn];
                    const pv = item[pn];
                    if (pv !== null) {
                        if (pn.lastIndexOf('_List') !== -1) {
                            const chT = pn.replace('_List', '');
                            this.parseEntity(pv, chT);
                        }
                    }
                }
            }

            item.__metadata = { __type: tn };
        }
    }
    /* getFiniteValue рекурсивная проходка по более низким уровням объекта и изменение найденых записей на переделаные данные
    names используется для запоминания ключей для различных записей*/
    private getFiniteValue(obj: any, names?) {
        if (typeof(obj) === 'object') {
            if (obj._f && obj._sh) {
                this.parseElemF(obj, obj['_sh']['names']);
            }
            Object.keys(obj).forEach( prop => {
                if (obj[prop] && typeof(obj[prop]) === 'object') {
                    if (this.findElem(obj[prop])) {
                        const el = obj[prop][0];
                        if (!names[prop] && obj[prop] && el['_sh'] && el['_sh']['names']) {
                            names[prop] = obj[prop][0]['_sh']['names'];
                        }
                        this.parseElemValue(obj[prop], names[prop]);
                    }
                    this.getFiniteValue(obj[prop], names);
                }
            });
        }
    }
    /* findElem проверяем есть ли нужные мне записи на нужном мне уровне */
    private findElem(object: any): boolean {
        return object && ((object.value && object.value[0]['_f']) || (object[0] && object[0]['_f']));
    }
    /* @parseCompact data объект для проверки и переделки. names используется если внутри массива для переделки не будет _sh
    добавил из-за вкладки "Права в картотеках" там встретился данный недостаток*/
    /* private parseCompact(data: any, names?) {
        if (data.value) {
            this.parseElemValue(data.value, data.value[0]['_sh']['names']);
            Object.keys(data.value[0]).forEach(key => {
                if (data.value[0][key] && typeof data.value[0][key] === 'object' && this.findVal(data.value[0][key], '_sh')) {
                    const el = data.value[0][key];
                    if (!names[key] && el[0]['_sh'] && el[0]['_sh']['names']) {
                        names[key] = el[0]['_sh']['names'];
                    }
                    this.parseElemValue(data.value[0][key]);
                }
            });
        } else if (data._f) {
            this.parseElemF(data, data['_sh']['names']);
            Object.keys(data).forEach(key => {
                if (data[key] && typeof data[key] === 'object' && this.findVal(data[key], '_sh')) {
                    this.parseElemValue(data[key]);
                }
            });
        }
    } */
    /* parseElemF принимает объект для переделки и массив имён сделано из-за частного случая когда _f и _sh встречаются сразу в объекте
    а не во внутренних элементах */
    private parseElemF(data: any, arrName: string[]) {
        data['_f'].forEach((element, index) => {
            data[arrName[index]] = element;
        });
        delete data['_f'];
        delete data['_sh'];
    }
    /* parseElemValue главная функция в которую передаётся сразу объект в котором на 1 или 2 уровня ниже и будут находиться записи которые необходимо
    переделать  arrName используется в случае если будет передан массив ключей если же нет то предполагается, что ключ есть в 0 элементе массива*/
    private parseElemValue(data: any, arrName?: string[]) {
        let ans = {};
        const name = arrName ? arrName : data[0]['_sh']['names'];
        if (data[0] && data[0]['_f']) {
            Object.keys(data).forEach((arr) => {
                Object.keys(data[arr]).forEach((elem) => {
                    if ('' + elem === '__metadata') { // прост опереносим __metadata без изменений
                        ans[elem] = data[arr][elem];
                    } else {
                        if ('' + elem !== '_sh' && '' + elem !== '_f') { // если в обекте или в поле нет _f то просто переносим это поле
                            ans[elem] = data[arr][elem];
                        } else if (elem === '_f') {
                            data[arr][elem].forEach((element, index) => {
                                ans[name[index]] = element;
                            });
                        }
                    }
                });
                data[arr] = JSON.parse(JSON.stringify(ans));
                ans = {};
            });
        }
    }
    private appendChange(it: any, chr: any[], path: string) {
        const etn = this._metadata.etn(it);
        const et = this._metadata[etn];
        // const pkn = et.pk;
        let hasChanges = it._State === _ES.Added || it._State === _ES.Deleted;
        const ch: any = { method: it._State };

        if (it._State === _ES.Added || it._State === _ES.Modified || (!it._State && it._orig)) {
            ch.data = {};

            for (const pn in et.properties) {
                if (et.readonly.indexOf(pn) === -1 && it[pn] !== undefined) {
                    let v = it[pn];
                    if (v instanceof Function) { v = v(); }
                    if (!it._orig || it._State === _ES.Added || v !== it._orig[pn]) {
                        ch.data[pn] = v;
                        hasChanges = true;
                    }
                }
            }

            if (hasChanges && !it._State) {
                ch.method = _ES.Modified;
            }

        }
        if (hasChanges) {
            ch.requestUri = (path.length !== 0) ? path : etn;
            if (ch.method !== _ES.Added) {
                ch.requestUri += this.PKinfo(it._orig || it);
            }
            chr.push(ch);
        }
        if (et.prepareChange) {
            et.prepareChange(it, ch, path, chr);
        }

        if (et.relations && it._State !== _ES.Deleted) {
            for (let i = 0; i < et.relations.length; i++) {
                const pr = et.relations[i];
                if (pr.name.indexOf('_List') !== -1) {
                    const l = it[pr.name];
                    if (l !== undefined) {

                        for (let j = 0; j < l.length; j++) {
                            l[j].__metadata = l[j].__metadata || {};
                            l[j].__metadata.__type = pr.__type || pr.name.replace('_List', '');

                            if (!l[j].hasOwnProperty(pr.tf)) {
                                l[j][pr.tf] = it[pr.sf];
                            }

                            this.appendChange(l[j], chr,
                                PipeUtils.combinePath((path ? path : etn) + this.PKinfo(it._orig || it),
                                    pr.name));
                            if (l[j].__metadata.__type === 'CONTACT') {
                                delete l[j].__metadata;
                                // l[j].method = _ES.Added
                            }
                        }
                    }
                }
            }
        }
    }
}

