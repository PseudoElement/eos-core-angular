import {Injectable} from '@angular/core';

@Injectable()

export class LoginLengthService {
    public definitionValue(userType: string) {
        let maxLength: string;
        switch (userType) {
            case '0':
                maxLength = '12';
                break
            case '1':
                maxLength = '64';
                break
            case '2':
                maxLength = '64'
                break
            case '3':
                maxLength = '256';
                break
            case '4':
                maxLength = '256';
                break
            default :
                maxLength = '12';
        }
        return maxLength;
    }
}
