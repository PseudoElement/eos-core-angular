
import {throwError as observableThrowError, of } from 'rxjs';

export class ErrorService /*implements IErrorService*/ {
    public LostConnectionAlerted = false;

    httpCatch = (e) => {
        return this.errorHandler({ http: e });
    }

    errorHandler(err) {
        if (err.http) {
            switch (err.http.status) {
                case 434:
                    if (!this.LostConnectionAlerted) {
                        /* alert('Потеря соединения.');*/
                        this.LostConnectionAlerted = true;
                        // TODO: показать окно логина
                        // window.location.href = "../login.aspx";
                    }
                    break;
                case 404: case 403: // Просто так ошибкой не считаем
                    return of([]);
                case 500: // InternalSerrverError
                    // this.$rootScope.$broadcast("srvError", err.http); // для обработки в поиске
                    this.defaultErrorHandler(err.http);
                    break;
                default:
                    this.defaultErrorHandler(err.http);
            }
        } else if (err.isLogicException) {
            // console.log('rest error handler', err.message);
        } else if (err.odataErrors) {
            return this.odataErrorsHandler(err);
        }

        return observableThrowError(new Error(err));
    }

    odataErrorsHandler(err) {
        const erl = err.odataErrors;
        let logic = '';
        for (let i = 0, n = erl.length; i < n; i++) {
            const e = erl[i].innererror || erl[i];
            if (e.type === 'Eos.Delo.Exceptions.LogicException') {
                logic += e.message + '\n';
            } else {
                this.WriteErrorHtml(e.message, e.stacktrace);
                return observableThrowError(e);
            }
        }
        if (logic !== '') {
            // console.log('odata error', logic);
        }
        return observableThrowError(err);
    }

    defaultLogicExceptionHandler(_e, data) {
        if (data.ErrorKind === 'InvalidEntityRef') {
            // TODO: специальное исключени - ссылка на уже не существующий объект, для интерфейса пытались отдать с подробностями
            // из ошибки берем имя сущности и по ее первичному ключу извлекаем его значение
            // завязка на метаданные здесь выглядит избыточной
            // если будем в это играть, проще передать данные, вызывающая сторона легче поймет что из них нужно
            // чтобы спозиционироваться на форме в нужное место.

            /* let etn = data.EntityName;
            let et = _meta<D2.iTypeDef>(etn);
            let isn = data[et.pk];
            */
            // if (this.InvalidRefErrorHandler(e, etn, isn))
            // 	return;
        }
        // LogicException показываем как alert?
        // console.log('rest logic error', e.message);
    }
    // //для переопределения на конкретной pm, для вывода более конкретного сообщения
    // InvalidRefErrorHandler = (e, etn, isn) => false;

    defaultErrorHandler(e) {
        let message = e.message || '';
        const error = e.data['odata.error'] || e.data['error'];
        message = error.message ? error.message.value : message;

        if (error.innererror && error.innererror.type === 'Eos.Delo.Exceptions.LogicException') {
            let data = error['logicException.data'];
            if (data) {
                data = JSON.parse(data);
            }

            this.defaultLogicExceptionHandler(error.innererror, data);
            return;
        } else if (error.innererror) {
            this.WriteErrorHtml(error.innererror.message, error.innererror.stacktrace);
            return;
        }
        if (e.statusCode) {
            this.WriteErrorHtml(message);
        }
    }

    WriteErrorHtml(_message, _stacktrace?) {
        // console.log('rest error', message + ' ' + stacktrace);
    }
}


