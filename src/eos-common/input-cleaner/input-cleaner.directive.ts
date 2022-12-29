import { Directive, ElementRef, Renderer, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Directive({ selector: '[eosInputCleaner]' })
export class InputCleanerDirective implements OnInit {
    @Input() eosInputCleaner = true;
    @Output() formCleaned: EventEmitter<string> = new EventEmitter(null);

    constructor(private _element: ElementRef, private _renderer: Renderer) {
    }
    ngOnInit() {
        if (this._element && this._element.nativeElement && this.eosInputCleaner) {
            const btn = this._renderer.createElement(this._element.nativeElement.parentNode, 'button');
            this._renderer.setElementClass(btn, 'input-cleaner', true);
            this._renderer.setElementClass(btn, 'btn', true);
            this._renderer.listen(btn, 'click', () => {
                this.formCleaned.emit('');
                this._element.nativeElement.value = '';
            });
            const icon = this._renderer.createElement(btn, 'span');
            this._renderer.setElementClass(icon, 'fa', true);
            this._renderer.setElementClass(icon, 'fa-remove', true);
            this._renderer.setElementClass(icon, 'clean-icon', true);
        }
        // const btn = this.renderer.createElement(this.el.nativeElement.parentNode, 'eos-adm-input-cleaner');
    }
}
