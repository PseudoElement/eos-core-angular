import {Component} from '@angular/core';
// import { UserParamsService } from '../../shared/services/user-params.service';
// import { WaitClassifService } from 'app/services/waitClassif.service';
// import { EosMessageService } from 'eos-common/services/eos-message.service';
// import { Subject } from 'rxjs/Subject';
@Component({
    selector: 'eos-card-files',
    styleUrls: ['rights-card-files.component.scss'],
    templateUrl: 'rights-card-files.component.html'
})

export class RightsCardFilesComponent {
    public arrayKeysCheckboxforCabinets = [
        ['USER_ACCOUNTS_RECEIVED', 'Поступившие'],
        ['USER_ACCOUNTS_ON_PERFORMANCE', 'На исполнении'],
        ['USER_ACCOUNTS_UNDER_CONTROL', 'На контроле'],
        ['USER_ACCOUNTS_HAVE_LEADERSHIP', 'У руководства'],
        ['USER_ACCOUNTS_UNDER_CONSIDERATION', 'На рассмотрении'],
        ['USER_ACCOUNTS_IN_DELO', 'В дело'],
        ['USER_ACCOUNTS_SUPERVISORY_PROCEEDINGS', 'Надзорные производства'],
        ['USER_ACCOUNTS_PROJECT_MANAGEMENT', 'Управление проектами'],
        ['USER_ACCOUNTS_ON_SIGHT', 'На визировании'],
        ['USER_ACCOUNTS_ON_THE_SIGNATURE', 'На подписи'],
        ['HIDE_INACCESSIBLE', 'Учитывать ограничения доступа к РК по грифам и группам документов'],
        ['HIDE_INACCESSIBLE_PRJ', 'Учитывать права для работы с РКПД'],
    ];
    // private queryDepartment = {
    //     DEPARTMENT: {
    //         criteries: {
    //             CARD_FLAG: '1'
    //         }
    //     }
    // };
    // private queryUsercard = {
    //     USERCARD: {
    //         criteries: {
    //             ISN_LCLASSIF: '83274'
    //         }
    //     }
    // };
    // private queryCabinet = {
    //     CABINET: {
    //         criteries: {
    //         }
    //     }
    // };
    constructor() {

    }
}
