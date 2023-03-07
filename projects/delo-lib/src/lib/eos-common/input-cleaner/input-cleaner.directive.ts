import { Directive, ElementRef, OnInit, Output, EventEmitter, Input, Renderer2 } from '@angular/core';

@Directive({ selector: '[eosInputCleaner]' })
export class InputCleanerDirective implements OnInit {
    @Input() eosInputCleaner = true;
    @Output() formCleaned: EventEmitter<string> = new EventEmitter(null);

    constructor(private _element: ElementRef, private _renderer: Renderer2) {
    }
    ngOnInit() {
        if (this._element && this._element.nativeElement && this.eosInputCleaner) {
            const btn = __ngRendererCreateElementHelper(this._renderer, this._element.nativeElement.parentNode, 'button');
            this._renderer.addClass(btn, 'input-cleaner');
            this._renderer.addClass(btn, 'btn');
            this._renderer.listen(btn, 'click', () => {
    this.formCleaned.emit('');
    this._element.nativeElement.value = '';
});
            const icon = __ngRendererCreateElementHelper(this._renderer, btn, 'span');
            this._renderer.addClass(icon, 'fa');
            this._renderer.addClass(icon, 'fa-remove');
            this._renderer.addClass(icon, 'clean-icon');
        }
        // const btn = this.renderer.createElement(this.el.nativeElement.parentNode, 'eos-adm-input-cleaner');
    }
}

type AnyDuringRendererMigration = any;

function __ngRendererSplitNamespaceHelper(name: AnyDuringRendererMigration) {
    if (name[0] === ':') {
        const match = name.match(/^:([^:]+):(.+)$/);
        return [match[1], match[2]];
    }
    return ['', name];
}

function __ngRendererCreateElementHelper(renderer: AnyDuringRendererMigration, parent: AnyDuringRendererMigration, namespaceAndName: AnyDuringRendererMigration) {
    const [namespace, name] = __ngRendererSplitNamespaceHelper(namespaceAndName);
    const node = renderer.createElement(name, namespace);
    if (parent) {
        renderer.appendChild(parent, node);
    }
    return node;
}
