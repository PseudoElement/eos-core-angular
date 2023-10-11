import { AfterViewInit, Component } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';

@Component({
  selector: 'lib-about-systems',
  templateUrl: './about-systems.component.html',
  styleUrls: ['./about-systems.component.scss']
})
export class AboutSystemsComponent implements AfterViewInit {
    scriptsUrl: any;

    constructor() {
    }
    ngAfterViewInit(): void {
      Manager.loadPlugins({targets: ['AboutSystem'], mountPoint: 'about_system_plug', scriptsAppendPoint: "scriptAppend"}).then(() => {
        console.log('loaded AboutSystemPlugin');
      });
    }

    // ngOnDestroy(): void {
      // EosUtils.removeUselessStyles('data-styled')
      // EosUtils.removeUselessStyles('id', 'AboutSystem-style')
    // }
}
