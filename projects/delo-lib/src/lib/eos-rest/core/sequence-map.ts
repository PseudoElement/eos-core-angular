export class SequenceMap {
    private nextIsn: number = -20000;
    private fixed: any = {};

    GetTempISN() {
        return (++this.nextIsn);
    }

    GetTempDUE(parentDue) {
        return parentDue + (++this.nextIsn).toString() + '.';
    }

    GetFixed(tempID: any) {
        return this.fixed[tempID];
    }
    Fix(tempID: any, id: any) {
        this.fixed[tempID] = id;
    }

    FixMapItem(data: any) {
        if (data.TempID) {
            this.Fix(data.TempID, data.ID);
        }
        if (data.TempISN) {
            this.Fix(data.TempISN, data.FixedISN);
        }

    }
}
