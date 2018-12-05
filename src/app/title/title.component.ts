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
        let url = document.location.href.split('#')[0];
        url = url.slice(0, url.lastIndexOf('Classif')) + 'main.aspx';
        document.location.assign(url);
    }
}
