import { Component, OnInit } from '@angular/core';
import { Manager } from '@eos/jsplugins-manager';

@Component({
  selector: 'lib-about-systems',
  templateUrl: './about-systems.component.html',
  styleUrls: ['./about-systems.component.scss']
})
export class AboutSystemsComponent implements OnInit {
    private deletedStyleIds = ["AboutSystem-style"];

    scriptsUrl: any;

    constructor() {
    }

    ngOnInit() {

    }
    ngAfterViewInit(): void {
      Manager.loadPlugins({'target': 'AboutSystem', mountPoint: 'about_system_plug', scriptsAppendPoint: "scriptAppend"}).then(() => {
        console.log('loaded AboutSystemPlugin');
      });
    }

    ngOnDestroy(): void {
        this.deletedStyleIds.forEach(ids => {
            const elementsToRemove = document.querySelectorAll("style#" + ids);
            elementsToRemove?.forEach(element => {
                element?.remove();
            });
        })
    }
}
