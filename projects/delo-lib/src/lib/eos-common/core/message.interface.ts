export const SUCCESS_DISMISS_TIMEOUT = 3000;
export const DEFAULT_DISMISS_TIMEOUT = 3000;
export const DANGER_DISMISS_TIMEOUT = 5000;

export interface IMessage {
    type: 'success' | 'info' | 'warning' | 'danger';
    title: string;
    msg: string;
    dismissOnTimeout?: number;
    authMsg?: boolean;
}
