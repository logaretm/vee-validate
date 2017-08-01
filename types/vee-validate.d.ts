import Vue = require("vue")

export class FieldFlags {
    untouched: boolean;
    touched: boolean;
    dirty: boolean;
    pristine: boolean;
    valid?: boolean;
    invalid?: boolean;
    validated: boolean;
    required: boolean;
    pending: boolean;
}

export class Field {
    id: string;
    name: string;    
    scope: string;    
    flags: FieldFlags;
    isRequired: boolean;    
    el: any;
    value: any;
    rules: any;
}

export class ErrorBag {
    constructor();
    add(field: string, msg: string, rule: string, scope?: string): void;
    all(scope?: string): string[];
    any(scope?: string): boolean;
    clear(scope?: string): void;
    collect(field?: string, scope?: string, map?: boolean): any;
    count(): number;
    first(field: string, scope?: string): string;
    firstByRule(name: string, rule: string, scope?: string): any;
    firstRule(field: string, scope: string): string;
    has(field: string, scope?: string): boolean;
    remove(field: string, scope?: string): void;
}

export class FieldBag {
    filter(matcher: {name?: string, scope?: string, id?: string}): Field[];
    find(matcher: {name?: string, scope?: string, id?: string}): Field;
}

export class FieldFlagsBag {
    [field: string]: FieldFlags;
}

export class Validator {
    errors: ErrorBag;
    fields: FieldBag;
    fieldBag: FieldFlagsBag;
    strict: boolean;
    readonly dictionary: any;

    constructor(validations: any, options: any);    
    attach(name: string, checks: string|Object, options?: Object): void;
    clean(): void;
    detach(name: string, scope?: string): void;
    extend(name: string, validator: Object|Function): void;
    flag(name: string, flags: Object): void;
    getErrors(): ErrorBag;
    getLocale(): string;
    init(): Validator;
    installDateTimeValidators(moment: any): void;
    on(name: string, fieldName: string, scope: string, callback: Function): void;
    off(name: string, fieldName: string, scope: string): void;
    pause(): Validator;
    remove(name: string): void;
    resume(): Validator;
    setLocale(language?: string): void;
    setStrictMode(strictMode?: boolean): void;
    updateDictionary(data: Object): void;
    validate(name: string, value: any, scope?: string, throws?: boolean): Promise<any>;
    validateAll(values?: Object, scope?: string): Promise<any>;
    validateScopes(): Promise<any>;
    static create(validations: Object, options: any): Validator;
    static extend(name: string, validator: Object|Function): void;
    static installDateTimeValidators(moment: any): any;
    static remove(name: string): void;
    static setLocale(language?: string): void;
    static setStrictMode(strictMode?: boolean): void;
    static updateDictionary(data: any): void;
    static addLocale(local: Object): void;
}

export const version: string;

export const install: Vue.PluginFunction<never>
