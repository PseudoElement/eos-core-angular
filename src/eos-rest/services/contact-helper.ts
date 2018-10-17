import { IEnt, CONTACT } from 'eos-rest';
import { _ES } from '../core/consts';
// import { _ES } from 'eos-rest/core/consts';

export class ContactHelper {
    // static chkFields = [
    //     'PRINT_SURNAME', 'PRINT_SURNAME_DP', 'PRINT_DUTY', 'PRINT_DEPARTMENT', 'DEPARTMENT_RP',
    //     'SURNAME', 'NAME', 'PATRON', 'SURNAME_RP', 'NAME_RP', 'PATRON_RP', 'SURNAME_DP', 'NAME_DP',
    //     'PATRON_DP', 'SURNAME_VP', 'NAME_VP', 'PATRON_VP', 'SURNAME_TP', 'NAME_TP', 'PATRON_TP', 'SURNAME_PP',
    //     'NAME_PP', 'PATRON_PP', 'DUTY_RP', 'DUTY_DP', 'DUTY_VP',
    // ];

    static PrepareForSave(rec: CONTACT, owner: IEnt): boolean {


        rec._State = _ES.Added;
        // for (const contact of owner['CONTACT_List']) {
        //     if (contact['__metadata']) {
        //         delete contact['__metadata'];
        //     }
        // }
        // for (const contact of owner._orig['CONTACT_List']) {
        //     if (contact['__metadata']) {
        //         delete contact['__metadata'];
        //     }
        // }
        // const fDelete = ContactHelper.chkFields
        //     .findIndex((key) => rec[key] && rec[key] !== null && rec[key].trim() !== '') < 0;
        //
        // // console.log('cbi owner', rec, owner['ISN_NODE']);
        // if (fDelete) {
        //     if (rec._State === _ES.Stub) {
        //         return false;
        //     }
        //     rec._State = _ES.Deleted;
        // } else if (rec._State === _ES.Stub) {
        //     // Добавление - превращаем Stub в Added
        //     // console.log('cbi owner', owner['ISN_NODE']);
        //     rec._State = _ES.Added;
        //     rec.ISN_OWNER = owner['ISN_NODE'];
        //     rec.OWNER_KIND = 104;
        // }
        return true;
    }
}
