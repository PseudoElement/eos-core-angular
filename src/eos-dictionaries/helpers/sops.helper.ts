import { PipRX } from 'eos-rest/services/pipRX.service';

export class SopsHelper {
    static InjectorInstance: any;

    // возвращает true когда что-то есть, начиная с данного номера, для данного года, для данной группы документов (включая дочерние без других нумераторов),
    // 0 - когда ничего нет
    public static sopExistsDocRcByOrderNum(due: string, order_num: number, year: number): Promise<boolean> {
        const pip: PipRX = SopsHelper.InjectorInstance.get(PipRX);
        const query = { args: { due: due, order_num: order_num, year: year } };
        const req = { ExistsDocRcByOrderNum: query};
        return pip.read(req).then((response) => {
            return (String(response) === '1');
        });
    }
    public static ExistsPrjRcByOrderNum(due: string, order_num: number, year: number): Promise<boolean> {
        const pip: PipRX = SopsHelper.InjectorInstance.get(PipRX);
        const query = { args: { due: due, order_num: order_num, year: year } };
        const req = { ExistsPrjRcByOrderNum: query};
        return pip.read(req).then((response) => {
            return (String(response) === '1');
        });
    }

    // public static _minNumberValidation(due, order_num, year): Promise<boolean> {
    //     // Сопы выдают 1, когда что-то есть, начиная с данного номера, для данного года, для данной группы документов (включая дочерние без других нумераторов), 0 - когда ничего нет
    //     // ExistsDocRcByOrderNum
    //     // ExistsPrjRcByOrderNum
    //     // new KeyValuePair<string, Type>("due", typeof(string)),
    //     // new KeyValuePair<string, Type>("order_num", typeof(int)),
    //     // new KeyValuePair<string, Type>("year", typeof(int)));
    //     this._apiSrv.
    // }
}
