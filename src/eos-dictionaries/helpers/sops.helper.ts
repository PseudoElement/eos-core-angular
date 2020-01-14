import { PipRX } from 'eos-rest/services/pipRX.service';
import { InjectorInstance } from 'app/app.static';

export class SopsHelper {

    // возвращает true когда что-то есть, начиная с данного номера, для данного года, для данной группы документов (включая дочерние без других нумераторов),
    // 0 - когда ничего нет
    public static sopExistsDocRcByOrderNum(due: string, order_num: number, year: number): Promise<boolean> {
        const pip: PipRX = InjectorInstance.get(PipRX);
        const query = { args: { due: due, order_num: order_num, year: year } };
        const req = { ExistsDocRcByOrderNum: query};
        return pip.read(req).then((response) => {
            return (String(response) === '1');
        });
    }

    public static sopExistsPrjRcByOrderNum(due: string, order_num: number, year: number): Promise<boolean> {
        const pip: PipRX = InjectorInstance.get(PipRX);
        const query = { args: { due: due, order_num: order_num, year: year } };
        const req = { ExistsPrjRcByOrderNum: query};
        return pip.read(req).then((response) => {
            return (String(response) === '1');
        });
    }

}
