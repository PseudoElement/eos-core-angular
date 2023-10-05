import { Component, Injector, OnInit, ViewEncapsulation } from "@angular/core";
import { BaseParamComponent } from "../shared/base-param.component";
import { PARAMS, TRACE_PARAMS, UPLOAD_PARAMS } from "../shared/consts/params-trace.const";
import { InputBase } from "../../../eos-common/core/inputs/input-base";
import { FormGroup } from "@angular/forms";
import { EosMessageService, InputControlService } from "../../../eos-common/index";
import { ALL_ROWS, PipRX, USER_CL } from "../../../eos-rest";
import { OPEN_CLASSIF_USER_CL } from "../../../eos-user-select/shered/consts/create-user.consts";

@Component({
    selector: "eos-param-trace",
    templateUrl: "./param-trace.component.html",
    styleUrls: ["./param-trace.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class ParamTraceComponent extends BaseParamComponent implements OnInit {
    inputsData: InputBase<string>[] = TRACE_PARAMS;
    form: FormGroup;
    public isShell: boolean = false;
    constructor(
        _injector: Injector,
        private _inputCntrlSrv: InputControlService,
        private _apiSrv: PipRX,
        private _msgSrv: EosMessageService
    ) {
        super(_injector, PARAMS);
    }

    ngOnInit(): void {
        this._loadAppSettings();
        this.form = this._inputCntrlSrv.toFormGroup(this.inputsData);
        this.form.disable({ emitEvent: false });
        this.form.valueChanges.subscribe((data) => {
            if (!data["USER_NAME"]) {
                this.form.controls["ISN_USER"].patchValue("", { emitEvent: false });
            }
        });
    }
    showDepChoose() {
        this.isShell = true;
        OPEN_CLASSIF_USER_CL.selectMulty = false;
        this._waitClassifSrv
            .openClassif(OPEN_CLASSIF_USER_CL, true)
            .then(async (userId: string) => {
                try {
                    const user = await this._apiSrv.read<USER_CL>({
                        [`USER_CL(${userId})`]: ALL_ROWS,
                    });
                    if (user.length) {
                        console.log(this.form.controls);

                        this.form.controls["USER_NAME"].patchValue(user[0].SURNAME_PATRON, { emitEvent: false });
                        this.form.controls["ISN_USER"].patchValue(user[0].ISN_LCLASSIF, { emitEvent: false });
                    }
                    this.isShell = false;
                } catch (error) {
                    this.form.controls["USER_NAME"].patchValue("", { emitEvent: false });
                    this.form.controls["ISN_USER"].patchValue("", { emitEvent: false });
                    this.isShell = false;
                }
            })
            .catch(() => {
                this.form.controls["USER_NAME"].patchValue("", { emitEvent: false });
                this.form.controls["ISN_USER"].patchValue("", { emitEvent: false });
                this.isShell = false;
            });
    }

    public edit() {
        this.form.enable({ emitEvent: false });
    }
    public async submit() {
        const protocolParams = this.form.controls["TRACE_PARAMS"].value || "{}";
        try {
            await this._apiSrv.setAppSetting(UPLOAD_PARAMS, protocolParams);
            this.disableForm();
        } catch (err) {
            this._msgSrv.addNewMessage({
                type: "danger",
                title: "Ошибка",
                msg: err?.message || "Ошибка загрузки трассировки",
            });
            console.error(err);
        }
    }
    public disableForm() {
        this.form.disable({ emitEvent: false });
        this.form.controls["USER_NAME"].patchValue("", { emitEvent: false });
        this.form.controls["ISN_USER"].patchValue("", { emitEvent: false });
    }
    private async _loadAppSettings(): Promise<void> {
        try {
            const res = await this._apiSrv.getAppSetting(UPLOAD_PARAMS);
            /*Заполнить value Параметры протоколирования(textarea) существующими настройками*/
            this.inputsData[0].value = res ? JSON.stringify(res) : "";
            this.form.controls["TRACE_PARAMS"].patchValue(this.inputsData[0].value);
        } catch (err) {
            console.error("loadAppSettings_error", err);
        }
    }
}
