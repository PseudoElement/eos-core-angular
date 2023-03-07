import { Injectable } from "@angular/core";
import { BtnActionFields } from "../../eos-user-select/shered/interfaces/btn-action.interfase";

@Injectable({ providedIn: "root" })
export class UserListsButtonAccessService {
    public checkVisibleButton(BtnAction: any): void {
    }
    public checkAccess(btn: BtnActionFields, context: any): boolean {
        return btn.disabled;
    }
}