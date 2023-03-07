import { IEnt, PipRX } from '../../eos-rest';
import { ALL_ROWS } from '../../eos-rest/core/consts';

// tslint:disable-next-line: class-name
export interface CALENDAR_CL_BY_DEP extends IEnt {
    /**
     * ISN календаря
     */
    ISN_CALENDAR: number;
    /**
     * Дата
     */
    DATE_CALENDAR: string;
    /**
     * Тип даты
     */
    DATE_TYPE: number;
    OWNER_ID?: string;
}

export class CalendarHelper {

    static clearHardCalendarForDue(pip: PipRX, due: any): Promise<any> {
        if (!due) {
            return Promise.resolve(null);
        }

        return CalendarHelper.readDB(pip, due).then ((records: CALENDAR_CL_BY_DEP[]) => {
            const changes = [];
            for (let i = 0; i < records.length; i++) {
                const rec = records[i];
                if (rec.OWNER_ID === due) {
                    if (rec.ISN_CALENDAR) {
                        changes.push({
                            method: 'DELETE',
                            data: '',
                            requestUri: 'CALENDAR_CL(' + rec.ISN_CALENDAR + ')',
                        });
                    }
                }
            }
            if (changes.length) {
                return pip.batch(changes, '')
                    .then(() => {
                        return true;
                    })
                    .catch((err) => {
                        return err;
                    });
            }

            return null;
        });
    }

    static readDB(pip: PipRX, due: any): Promise<any> {
        /* const query = {
        }; */
        const req: any = due ? {
            ['CalendarByDep']: ALL_ROWS,
            mode: '0',
            due_dep: due,
        } : {
            ['CALENDAR_CL']: ALL_ROWS,
            orderby: 'DATE_CALENDAR',
            foredit: true,
        };

        return pip.read<CALENDAR_CL_BY_DEP>(req).then((data) => {
            return due ? data : data.filter( (rec) => !rec.OWNER_ID);
        });
    }


}
