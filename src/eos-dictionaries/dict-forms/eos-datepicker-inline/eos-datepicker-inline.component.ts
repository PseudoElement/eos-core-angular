import { Input, OnInit, ViewChild, ElementRef, Renderer2, Component, EventEmitter, Output } from '@angular/core';




export interface EDPCustomedDate {
    date: Date;
    customClass?: string;
    isAnotherMonth?: boolean;
}

@Component({
    selector: 'eos-datepicker-inline',
    templateUrl: './eos-datepicker-inline.component.html',
    styleUrls: ['./eos-datepicker-inline.component.scss']
  })

export class EosDatepickerInlineComponent implements OnInit {

    displayYear: number;
    displayMonth: number;
    displayMode: number;

    rumonths = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь',
        'декабрь'
    ];

    @Input('bsValue') bsValue: Date;
    @Input('getClassForDate') getClassForDate: Function;

    @ViewChild('daystbody') daystbody: ElementRef;

    @Output('bsValueChange') bsValueChange: EventEmitter<Date>;
    // _bsValue: any;
    // getClassForDate: EventEmitter<Date>;

    constructor (
        // private elementRef: ElementRef,
        private renderer: Renderer2,
    ) {
        this.bsValueChange = new EventEmitter();
    }

    ngOnInit() {
        this.displayYear = this.bsValue.getFullYear();
        this.displayMonth = this.bsValue.getMonth();
        this.displayMode = 0;
        this._repaint();

    }

    sameDay(d1, d2) {
        if (!d1 || !d2) {
            return false;
        }
        return d1.getFullYear() === d2.getFullYear()
          && d1.getDate() === d2.getDate()
          && d1.getMonth() === d2.getMonth();
    }

    onLeftClick() {
        if (this.displayMode === 0) {
            if (this.displayMonth <= 0) {
                this.displayMonth = 11;
                this.displayYear--;
            } else {
                this.displayMonth--;
            }
        }
        this._repaint();
    }

    onRightClick() {
        if (this.displayMode === 0) {
            if (this.displayMonth >= 11) {
                this.displayMonth = 0;
                this.displayYear++;
            } else {
                this.displayMonth++;
            }
        }
        this._repaint();
    }

    get value() {
        return this.bsValue;
    }

    set value(value) {
        if (this.bsValue === value) {
            return;
        }
        this.bsValue = value;
        // this.value = value;
        this.bsValueChange.emit(value);
    }

    _repaint() {

        const childElements = this.daystbody.nativeElement.childNodes;
        while (childElements.length) {
            this.renderer.removeChild(this.daystbody.nativeElement, childElements[0]);
        }

        const today = new Date();
        const year = this.displayYear;
        const month = this.displayMonth + 1;
        let currentDate = new Date(year, month - 1, 1);
        const lastDayOfPreviousMonth = new Date(year, month - 1, 0).getDate();
        if (currentDate.getDay() !== 1 /* пон */) {
            currentDate = new Date(year, month - 2, lastDayOfPreviousMonth - currentDate.getDay() + 2);
        }

        const previousMonth = new Date(year, month - 2, 1).getMonth();
        const nextMonth = new Date(year, month, 1).getMonth();

        let tr;
        let rowcount = 0;

        while ((currentDate.getMonth() !== nextMonth ||
        currentDate.getDay() !== 1) || rowcount < 6) {

            if (currentDate.getDay() === 1) {
                tr = document.createElement('tr');
            }

            const td = document.createElement('td');
            const clickdate = new Date(currentDate.valueOf());
            td.setAttribute('role', 'gridcell');
            td.onclick = ((a) => {
                this.value = clickdate;
                this._repaint();
                a.preventDefault();

            }).bind(this);

            const span = document.createElement('span');
            span.textContent = String(currentDate.getDate());

            if (currentDate.getMonth() === previousMonth) {
                span.classList.add('is-other-month');
            } else if (currentDate.getMonth() === nextMonth) {
                span.classList.add('is-other-month');
            } else if (this.sameDay(currentDate, this.value)) {
                span.classList.add('selected');
            } else {
                if (this.getClassForDate) {
                    const strclass = this.getClassForDate(currentDate);
                    if (strclass) {
                        td.classList.add(strclass);
                    }
                }
            }
            if (this.sameDay(currentDate, today)) {
                span.classList.add('today');
            }
            this.renderer.appendChild(td, span);
            this.renderer.appendChild(tr, td);

            if (currentDate.getDay() === 0) {
                this.renderer.appendChild(this.daystbody.nativeElement, tr);
                rowcount++;
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    _dateforRowColumn(month: number, year: number): EDPCustomedDate {
        let currentDate = new Date(year, month, 1);
        let lastDayOfPreviousMonth = new Date(year, month - 1, 0).getDate();
        if (currentDate.getDay() !== 0) {
                    currentDate = new Date(year, month - 2, lastDayOfPreviousMonth - currentDate.getDay() + 1);
                }

        const res: EDPCustomedDate = {
            date: new Date(),
        }

        return res;
    }

    // textMonth(): string {

    //     // return rumonths[this.displayMonth];
    // }

    onYearClick() {

    }

    onMonthClick() {

    }


}
