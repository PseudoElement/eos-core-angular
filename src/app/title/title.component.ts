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
        try {
            document.location.assign('../main.aspx');
        } catch (e) {
            // IE fix if user click 'stay in page'
            console.error('openDelo failed', e);
        }

    }
}
