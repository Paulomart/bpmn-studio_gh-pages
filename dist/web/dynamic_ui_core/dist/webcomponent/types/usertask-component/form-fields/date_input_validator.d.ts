import { IKeyDownOnInputEvent } from './ikey_down_on_input_event';
export declare class DateInputValidator {
    validateKey(event: IKeyDownOnInputEvent): boolean;
    isValidDate(value: string): boolean;
    private isDayInMonth;
    private isCopyAndPastePressed;
    private isKeyValid;
}
