import { Injector } from '@angular/core';

export let InjectorInstance: Injector;

export class StaticHelper {
    static setInjectorInstance(injector: Injector) {
        InjectorInstance = injector;
    }

}
