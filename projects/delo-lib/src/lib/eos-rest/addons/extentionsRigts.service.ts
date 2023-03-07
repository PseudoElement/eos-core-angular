import { Injectable } from '@angular/core';
import { NodeAbsoluteRight } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/node-absolute';
import { TECH_USER_CLASSIF } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.consts';
import { ITechUserClassifConst } from '../../eos-user-params/rights-delo/rights-delo-absolute-rights/absolute-rights-classif/tech-user-classif.interface';
@Injectable()
export class ExetentionsRigthsServiceLib {
    public extendsTechRigthsUser() {
        return [];
    }
    public disableRigths(): Array<{ key: number, checkStatus: any }> {
        return [];
    }
    public initialValues(): Array<{ key: number, setValue: any }> {
        return [];
    }
    public preSaveCheck(context: any): Promise<boolean> {
        return Promise.resolve(true);
    }
    public techUserRigth(): ITechUserClassifConst[] {
        const abs = TECH_USER_CLASSIF;
        return abs;
    }
    public checkListRigth(nodes: any): void {
    }
    public updateRigth(arr: string[]): string[]{
        const apdateArr = arr;
        apdateArr.forEach((i,  index) => {
            if (i === ' ' || index === 20 || index === 21 || index === 39 || index === 38 || index === 37) {
                arr[index] = '0';
            }
        });
        return apdateArr;
    }
    public updateRigthTabs(): void {}
    public getTechRigth(): string {
        return '111111111111111111110011111111111111100010100001011';
    }
    public disableNode(selectNode: NodeAbsoluteRight, techRight: string): void { }
}