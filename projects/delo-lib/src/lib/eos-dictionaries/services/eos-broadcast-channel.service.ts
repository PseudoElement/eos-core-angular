import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
// import {AUTH_METHOD, ENCRYPTION_TYPE} from '../consts/sev-const';
// import { EosStorageService } from 'app/services/eos-storage.service';

@Injectable()
export class EosBroadcastChannelService {
    private _params: string;
    private _data: any;

    parseXml(value: string): Promise<any> {
        this._params = value;
        const parseString = xml2js.parseString;
        if (this._params) {
            return new Promise<any>((resolve, reject) => {
                parseString(this._params, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const channel = result['Channel'];
                    this._data = {};
                    // this._data['SMTP_DELAY'] = +channel['Schedule'][0].$['Delay'];
                    if (channel['Transport'] && channel['Transport'].length > 0) {
                        const transport = channel['Transport'][0];
                        if (transport['MailParams']) {
                            const mailParams = transport['MailParams'][0].$;
                            switch (mailParams['AuthMethod']) {
                                case 'NONE':
                                    this._data['AUTH_METHOD'] = 0;
                                    break;
                                case 'NTLM':
                                    this._data['AUTH_METHOD'] = 1;
                                    break;
                                case 'LOGIN':
                                    this._data['AUTH_METHOD'] = 2;
                                    break;
                            }
                            switch (mailParams['SmtpSsl']) {
                                case 'NONE':
                                    this._data['ENCRYPTION_TYPE'] = 0;
                                    break;
                                case 'SSL':
                                    this._data['ENCRYPTION_TYPE'] = 1;
                                    break;
                                case 'STARTTLS':
                                    this._data['ENCRYPTION_TYPE'] = 2;
                                    break;
                            }
                            this._data['SMTP_EMAIL'] = mailParams['SmtpEmailFrom'];
                            this._data['SMTP_SERVER'] = mailParams['SmtpServer'];
                            this._data['SMTP_PORT'] = +mailParams['SmtpPort'];
                            this._data['SMTP_LOGIN'] = mailParams['SmtpUser'];
                            this._data['SMTP_PASSWORD'] = mailParams['SmtpPassword'];
                            this._data['POP3_SERVER'] = mailParams['Pop3Server'];
                            this._data['POP3_PORT'] = mailParams['Pop3Port'];
                            this._data['POP3_LOGIN'] = mailParams['Pop3User'];
                            this._data['POP3_PASSWORD'] = mailParams['Pop3Password'];
                            this._data['POP3_ENCRYPTION'] = (mailParams['Pop3Ssl'] === 'true');
                        } else {
                            const fsParams = transport['FileSystemParams'][0].$;
                            this._data['IN_FOLDER'] = fsParams['SourceDir'];
                            this._data['IN_STORAGE'] = fsParams['SourceStorage'];
                            this._data['OUT_FOLDER'] = fsParams['DestDir'];
                            this._data['OUT_STORAGE'] = fsParams['DestStorage'];
                        }
                    }
                    resolve(this._data);
                });
            });
        }
        return new Promise<any>((resolve, reject) => {
           resolve(true);
        });
    }

    public toXml(): string {
        if (this._data['CHANNEL_TYPE'] === 'email') {
            return '<Channel><Schedule Start="automatic"/></Channel>'
        } else {
            return `<Channel>
                        <Schedule Start="automatic"/>
                        <Transport>
                        <FileSystemParams 
                            DestStorage="${this._data['OUT_STORAGE']}" 
                            DestDir="${this._data['OUT_FOLDER']}" 
                            SourceStorage="${this._data['IN_STORAGE']}" 
                            SourceDir="${this._data['IN_FOLDER']}" 
                            CompressMessage="true" />
                        </Transport>
                    </Channel>` 
        }
    }

    get params() {
        return this._params;
    }
    get data() {
        return this._data;
    }

    set data(value: any) {
        this._data = value;
    }

}
