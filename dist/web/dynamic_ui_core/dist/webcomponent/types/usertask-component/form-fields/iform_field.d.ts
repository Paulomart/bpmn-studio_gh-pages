export interface IFormField {
    readonly name: string;
    readonly value: any;
    isValid: boolean;
    render(): void;
}
