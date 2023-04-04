import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'eos-extends-linked-search-default',
    templateUrl: './linked-search-default.component.html',
    styleUrls: ['./linked-search-default.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})

export class ExtendsLinkedSearch implements OnInit, OnChanges {
    @Input() appMode: any;
    @Input() isCurrentSettings!: boolean;
    @Input() input: any;
    @Input() form: any;
    public isLoading = false;
    get isLinkFlag(): boolean {
        return Boolean(this.form?.controls['rec.LINKED_SEARCHYEAR']);
    }
    constructor() {
    }
    ngOnInit() {
        this.isLoading = true;
    }
    ngOnChanges(changes: SimpleChanges): void {
        
    }
}
