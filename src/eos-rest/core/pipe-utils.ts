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
        if (tn !== 'Collection(Edm.Int32)' && tn !== 'Edm.String') { // костыль для ответа от сопа по созданию пользователя
            this.parseEntity(items, tn);
        }
        if (data['odata.nextLink']) { // TODO распарсить строку со значением вида: USER_CL?$orderby=ISN_LCLASSIF&$skiptoken=4,2,54
            items.TotalRecords = data['odata.nextLink']; // возможно лучше положить эти данные к _metadata
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

    private parseMoreJson(item: any/*, tn: string*/) {
        item._more_json = JSON.parse(item._more_json);
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

