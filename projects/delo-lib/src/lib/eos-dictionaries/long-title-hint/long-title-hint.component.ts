import { Component } from '@angular/core';
import { HintConfiguration } from './hint-configuration.interface';
import { EosDictionaryNode } from '../core/eos-dictionary-node';

@Component({
    selector: 'eos-longtitle-hint',
    templateUrl: 'long-title-hint.component.html'
})

export class LongTitleHintComponent {
    public title: string;
    public top: string;
    public left: string;
    public opacity = 0;

    public lkm = false;
    public show = false;
    private _moveCounter = 0;
    private _node: EosDictionaryNode;

    public showHint(hintConfig: HintConfiguration) {
        if (this._node && this._node.id === hintConfig.node.id && this.lkm) {
            return;
        }
        setTimeout(() => {
            this.title = hintConfig.text;
            this.show = true;
            this.top = hintConfig.top + 'px';
            this.left = hintConfig.left + 'px';
            this.opacity = 1;
            this._node = hintConfig.node;
            this.lkm = false;
        }, 100);
    }

    public hideHint(hintConfig?: HintConfiguration) {
        if (hintConfig) {
            this._node = hintConfig.node;
        }
        this.opacity = 0;
        setTimeout(() => this.show = false, 200);
    }

    public innerClick(evt: Event) {
        evt.preventDefault();
        evt.stopPropagation();
        this.lkm = true;
        this.hideHint();
        return false;
    }

    windowEventHandler(e: MouseEvent) {
        this._moveCounter--;
        if (this._moveCounter < 0) {
            this.hideHint();
            this._moveCounter = 0;
        }
    }

    componentEventHandler() {
        this._moveCounter++;
    }
}
