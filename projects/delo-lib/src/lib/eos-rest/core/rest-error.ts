export class RestError {
    code: number;
    message: string;

    constructor(error: any) {
        /*
        super();
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RestError.prototype);
        */
        if (error.http) {
            this.code = error.http.status;
            switch (error.http.status) {
                case 0:
                    this.message = "Ошибка соединения";
                    break;
                case 401:
                case 403:
                case 434:
                    this.message = "Ошибка авторизации";
                    break;
                case 404: // Просто так ошибкой не считаем
                    this.message = "Не найдено";
                    break;
                default:
                    this._defaultErrorHandler(error.http);
            }
        } else if (error.isLogicException) {
            this.code = 1000;
            this.message = error.message;
        } else if (error.odataErrors) {
            this.code = 2000;
            this._odataErrorsHandler(error);
        }
    }

    private _defaultErrorHandler(e: any) {
        // console.log('http error', e);
        let message = e.message || "";
        if (e.data) {
            const error = e.data["odata.error"] || e.data["error"];
            message = error.message ? error.message.value : message;
            if (error.innererror && error.innererror.type === "Eos.Delo.Exceptions.LogicException") {
                let data = error["logicException.data"];
                if (data) {
                    data = JSON.parse(data);
                }
                this._defaultLogicExceptionHandler(error.innererror, data);
                return;
            } else if (error.innererror) {
                this.message = error.innererror.message;
                return;
            }
        }
        if (e.statusCode) {
            this.message = message;
        }
        try {
            let odataerr;
            try {
                odataerr = e.error["odata.error"].innererror.message || e.error["odata.error"].innererror.Message;
            } catch {
                const str = JSON.parse(e.error);
                odataerr = str["odata.error"].innererror.message || str["odata.error"].innererror.Message;
            }

            if (odataerr) {
                this.message = odataerr;
            }
        } catch (err) {
            this.message = e.message;
            return;
        }
    }

    private _defaultLogicExceptionHandler(e, data) {
        // console.log('_defaultLogicExceptionHandler');
        if (data.ErrorKind === "InvalidEntityRef") {
            // TODO: специальное исключени - ссылка на уже не существующий объект, для интерфейса пытались отдать с подробностями
            // из ошибки берем имя сущности и по ее первичному ключу извлекаем его значение
            // завязка на метаданные здесь выглядит избыточной
            // если будем в это играть, проще передать данные, вызывающая сторона легче поймет что из них нужно
            // чтобы спозиционироваться на форме в нужное место.
            // let etn = data.EntityName;
            // let et = _meta<D2.iTypeDef>(etn);
            // let isn = data[et.pk];
            // if (this.InvalidRefErrorHandler(e, etn, isn))
            // 	return;
        }
        this.message = e.message;
    }

    private _odataErrorsHandler(err) {
        const erl = err.odataErrors;
        let logic = "";
        for (let i = 0; i < erl.length; i++) {
            const e = erl[i].innererror || erl[i];
            if (e.type === "Eos.Delo.Exceptions.LogicException") {
                logic += e.message + "\n";
            } else {
                // console.log('non logic odata error', e);
                if (e.message.value) {
                    this.message = e.message.value;
                } else {
                    this.message = e.message;
                }
                return;
                // this.WriteErrorHtml(e.message, e.stacktrace);
            }
        }
        this.message = logic;
    }
}
