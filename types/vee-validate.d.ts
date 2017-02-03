export class ErrorBag {
    constructor();
    add(field: any, msg: any, rule: any, scope: any): void;
    all(scope: any): any;
    any(scope: any): any;
    clear(scope: any): any;
    collect(field: any, scope: any, map: any): any;
    count(): any;
    first(field: any, scope: any): any;
    firstByRule(name: any, rule: any, scope: any): any;
    firstRule(field: any, scope: any): any;
    has(field: any, scope: any): any;
    remove(field: any, scope: any): any;
}
export class Validator {
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
export function install(Vue: any, ref: any): any;
