import Vue = require("vue");
import { Moment } from 'moment'

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


export class Validator {

    errorBag: ErrorBag
    fieldBag: any
    strictMode: boolean
    dictionary: Dictionary

    constructor(validations: any, $vm: any, options: any);
    addScope(scope: string): void;
    append(name: string, checks: string|Object, options: any): void;
    attach(name: string, checks: string|Object, options: any): void;
    detach(name: string, scope: string): void;
    extend(name: string, validator: Object|Function): void;
    getErrors(): ErrorBag;
    getLocale(): string;
    init(): any;
    installDateTimeValidators(moment: Moment): void;
    remove(name: string): void;
    setLocale(language?: string): void;
    setStrictMode(strictMode: boolean): void;
    updateDictionary(data: Object): void;
    updateField(name: string, checks: string|Object, options: any): void;
    validate(name: string, value: any, scope?: string): boolean|Promise<any>;
    validateAll(values?: Object): Promise<any>;
    validateScopes(): Promise<any>;
    static create(validations: Object, $vm: any, options: any): Validator;
    static extend(name: string, validator: Object|Function): void;
    static installDateTimeValidators(moment: Moment): any;
    static remove(name: string): void;
    static setLocale(language?: string): void;
    static setStrictMode(strictMode: boolean): void;
    static updateDictionary(data: any): void;
}
export const version: string;

export const install: Vue.PluginFunction<never>