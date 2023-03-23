import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Manager } from '@eos/jsplugins-manager';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}
/* заглушка на загрузку плагинов , убрать когда плагины переведут на новый сборщик */
try {
    Manager.loadPlugins({ targets: ['tech_tasks', 'tech_tools'] }).then(() => {
        onlyOneDinamic();
    });
} catch (error) {
    onlyOneDinamic();
    console.log('err', error);
}

function onlyOneDinamic() {
    platformBrowserDynamic().bootstrapModule(AppModule);
}

onlyOneDinamic()
