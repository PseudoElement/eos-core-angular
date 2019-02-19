import { Component } from '@angular/core';

// import { EosDeskService } from '../services/eos-desk.service';

@Component({
    selector: 'eos-title',
    templateUrl: 'title.component.html'
})
export class TitleComponent {
    /* todo: define it or remove. Mocked now*/
    title = 'Администрирование системы';
    openDelo() {
        document.location.assign('../main.aspx');
    }
}
