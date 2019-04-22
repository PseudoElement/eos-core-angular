
export const DEFAULT_DISMISS_TIMEOUT = 15000;
export const WARN_DISMISS_TIMEOUT = 15000;
export const DANGER_DISMISS_TIMEOUT = 15000;

export interface IMessage {
    type: 'success' | 'info' | 'warning' | 'danger';
    title: string;
    msg: string;
    dismissOnTimeout?: number;
    authMsg?: boolean;
}
