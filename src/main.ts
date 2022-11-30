import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Manager } from '@eos/jsplugins-manager';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
if (environment.production) {
    enableProdMode();
}

function bootstrap(event: unknown) {
    platformBrowserDynamic().bootstrapModule(AppModule);
    window.removeEventListener('error', bootstrap);
}

window.addEventListener('error', bootstrap);

Manager.loadPlugins({ targets: ['tech_tasks', 'DictionariesMetadata'] }).then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
});
