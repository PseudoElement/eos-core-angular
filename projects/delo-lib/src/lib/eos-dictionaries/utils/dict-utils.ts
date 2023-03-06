export interface IDaysVariant {
    daysLabel: string;
    options: any[];
}
export class DictUtils {

    static termExecOpts(opts: { value: any, title: string }[]): IDaysVariant[] {
        const result: IDaysVariant[] = [];

        let v = { daysLabel: 'дней', options: Array.from(opts, o => Object.assign({}, o)) };
        v.options.forEach(o => { o.title = o.title.replace('н.', 'ных').replace('ч.', 'чих'); });
        result.push(v);

        v = { daysLabel: 'день', options: Array.from(opts, o => Object.assign({}, o)) };
        v.options.forEach(o => { o.title = o.title.replace('н.', 'ный').replace('ч.', 'чий'); });
        result.push(v);

        v = { daysLabel: 'дня', options: Array.from(opts, o => Object.assign({}, o)) };
        v.options.forEach(o => { o.title = o.title.replace('н.', 'ных').replace('ч.', 'чих'); });
        result.push(v);

        return result;
    }

    static termExecOptsVariant(value: any): number {

        const mod100 = value % 100;

        if (mod100 >= 10 && mod100 <= 20) {
            return 0;
        }

        const mod10 = value % 10;
        switch (mod10) {
            case 1:
                return 1;
            case 2:
            case 3:
            case 4:
                return 2;
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 0:
            default:
                return 0;
        }

    }


}

