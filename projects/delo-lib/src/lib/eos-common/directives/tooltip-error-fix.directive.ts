import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({ selector: '[eosTooltipErrorFix]' })
export class TooltipErrorFixDirective implements OnInit, OnDestroy {
    @Input() scrollableParent;
    private scrollSubscribe;
    private parentTop;
    private parentBottom;

    constructor(private ref: ElementRef) { }

    ngOnInit() {
        if (!this.scrollSubscribe && this.scrollableParent && this.ref) {
            const source = fromEvent(this.scrollableParent, 'scroll');

            this.scrollSubscribe = source.subscribe(() => {
                if (!this.parentTop || !this.parentBottom) {
                    this.parentTop = this.scrollableParent.getBoundingClientRect().top;
                    this.parentBottom = this.scrollableParent.getBoundingClientRect().bottom;
                }
                const childBottom = this.ref.nativeElement.getBoundingClientRect().bottom;
                const childTop = this.ref.nativeElement.getBoundingClientRect().top;
                const tooltipEl: any = Array.from(this.ref.nativeElement.children).filter((child: any) => child.nodeName === 'BS-TOOLTIP-CONTAINER')[0];

                if (tooltipEl) {
                    if (this.parentTop > childBottom || this.parentBottom < childTop) {
                        tooltipEl.style.visibility = 'hidden';
                    } else {
                        tooltipEl.style.visibility = 'visible';
                    }
                }
            });
        }
    }
    ngOnDestroy() {
        if (this.scrollSubscribe) {
            this.scrollSubscribe.unsubscribe();
        }
    }
}
