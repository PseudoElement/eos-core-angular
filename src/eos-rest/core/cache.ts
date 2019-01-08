import { Metadata } from '../core/metadata';
import { IRequest, ICachePolicy, IR } from '../interfaces/interfaces';
import { PipRX } from '../services/pipRX.service';
import { PipeUtils} from '../core/pipe-utils';


// tslint:disable:curly
export class Cache extends PipeUtils {
    private _store: any = {
        reqCache: {}
    };

    constructor (private pip: PipRX, metadata: Metadata) {
        super();
        this._metadata = metadata;
    }

    /**
     * Прочитать и положить в кеш
     * @param req запрос
     */
    public read<T>(req: IRequest, _policy?: ICachePolicy): Promise<T[]> {
        const unread = [];
        const res = this.readOnlyCached<T>(req, unread);
        if ((res !== undefined) && ( unread.length === 0))
            return Promise.resolve(res);

        const r = this.pip.read<T>(req);
        r.then(d => {
            const ids = [];
            this.remember(d, ids);
            // TODO: учесть полиси
            // const rck = this.idsCacheKey(req);
            // this._store.reqCache[rck] = ids;
        });
        return r;
    }

    /**
     * прочитать только сохраненные
     */
    public readOnlyCached<T> (req: IRequest, unreadIds?: any[]): T[] {
        const r = req as IR;
        const _et = Object.keys(req)[0];
        const place = this.place(_et);
        const result = [];
        const urIds = unreadIds || [];
        const ids = r[_et];
        if ( ids instanceof Array) {
            for (let i = 0; i < ids.length; i++) {
                const pk = ids[i];
                const cached = place[pk];
                if (cached !== undefined)
                    result.push(cached);
                else
                    urIds.push(ids[i]);

            }
        } else if (place[ids]) {
            result.push(place[ids]);
            return result;
        } else
            return undefined;
        return result;
    }

    public idsCacheKey(req: IRequest): string {
        return JSON.stringify(req);
    }

    public clear(_req: IRequest) {

    }

    public clearZone(_policy?: ICachePolicy) {

    }

    private place(tn: string) {
        if (!this._store.hasOwnProperty(tn))
            this._store[tn] = {};
        return this._store[tn];
    }

    private remember(d: any[], ids: any[]) {
        if ( d.length === 0) return;
        const tn = this._metadata.etn(d[0]);
        const pkn = this._metadata.typeDesc(tn).pk;

        const place = this.place(tn);
        for (let i = 0; i < d.length; i++) {
            const item = d[i];
            const pk = item[pkn];
            ids.push(pk);
            place[pk] = item;
            // const test = place[pk];
        }
    }
}
