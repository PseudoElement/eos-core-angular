import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import RuntimePluginsManager from '@eos/jsplugins-manager';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
    enableProdMode();
}
RuntimePluginsManager.loadPlugins({ target: 'tech_tasks', registryFolder: '..' }).then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule);
});

