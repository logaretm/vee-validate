import Vue = require("vue");

export class ErrorBag {
    constructor();
    add(field: string, msg: string, rule: string, scope?: string): void;
    all(scope: string): string[];
    any(scope: string): boolean;
    clear(scope: string): void;
    collect(field: string, scope: string, map: boolean): any;
    count(): number;
    first(field: string, scope?: string): string;
    firstByRule(name: string, rule: string, scope?: string): any;
    firstRule(field: string, scope: string): string;
    has(field: string, scope?: string): boolean;
    remove(field: string, scope: string): void;
}
export class Validator {

    errorBag: ErrorBag

    constructor(validations: any, $vm: any, options: any);
    addScope(scope: any): void;
    append(name: any, checks: any, options: any): void;
    attach(name: any, checks: any, options: any): void;
    detach(name: any, scope: any): void;
    extend(name: any, validator: any): void;
    getErrors(): any;
    getLocale(): any;
    init(): any;
    installDateTimeValidators(moment: any): void;
    remove(name: any): void;
    setLocale(language: any): void;
    setStrictMode(strictMode: any): void;
    updateDictionary(data: any): void;
    updateField(name: any, checks: any, options: any): void;
    validate(name: any, value: any, scope: any): any;
    validateAll(values: any): any;
    validateScopes(): any;
    static create(validations: any, $vm: any, options: any): any;
    static extend(name: any, validator: any): void;
    static installDateTimeValidators(moment: any): any;
    static remove(name: any): void;
    static setLocale(language: any): void;
    static setStrictMode(strictMode: any): void;
    static updateDictionary(data: any): void;
}
export const version: string;
export function install(Vue: Vue, ref: any): any;
