import { IKeyDownOnInputEvent } from './ikey_down_on_input_event';
export declare class NumberInputValidator {
    private readonly _regex;
    constructor(regex: string);
    isValid(value: string): boolean;
    validateKey(event: IKeyDownOnInputEvent): boolean;
}
