import Vue = require("vue")

export interface VeeValidateComponentOptions {
    validator?: 'new' | 'inherit';
    name?: () => string;
    value?: () => string;
    rejectsFalse?: boolean;
    events?: string;
}

export interface Configuration {
    locale?: string;
    delay?: number;
    errorBagName?: string;
    dictionary?: any;
    strict?: boolean;
    fieldsBagName?: string;
    classes?: any;
    classNames?: any;
    events?: string;
    inject?: boolean;
    fastExit?: boolean;
    aria?: boolean;
    validity?: boolean;
}

export interface FieldFlags {
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

export interface FieldOptions {
    name: string;
    alias?: string;
    aria?: boolean;
    classNames?: {
        touched: string;
        untouched: string;
        valid: string;
        invalid: string;
        pristine: string;
        dirty: string;
    };
    classes?: boolean;
    component?: any;
    delay?: number;
    el?: HTMLElement;
    events?: string;
    getter?: () => any;
    initial?: boolean;
    initialValue?: any;
    listen?: boolean;
    rules?: string | Object;
    scope?: string | null;
    targetOf?: string | null;
    validity?: boolean;
    vm?: any; 
}

export class Field {
    id: string;
    name: string;
    scope: string;
    flags: FieldFlags;
    isRequired: boolean;
    initial: boolean;
    el: any;
    value: any;
    rules: any;
    update(options:object): void;
}

export interface ErrorField {
    field: string;
    msg: string;
    scope?: string;
    rule?: string;
    id?: string;
}

export class ErrorBag {
    constructor();
    items: ErrorField[];
    add(error: ErrorField): void;
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
    removeById(id: string): void;
    firstById(id: string): string;
    update(id: string, diff: Object): void;
}

export class FieldBag {
    items: Field[];
    filter(matcher: {name?: string, scope?: string, id?: string}): Field[];
    find(matcher: {name?: string, scope?: string, id?: string}): Field;
    map(fn: Function): Field[];
}

export interface FieldFlagsBag {
    [field: string]: FieldFlags;
}

export interface FieldMatchOptions {
    id?: string;
    scope?: string;
    name?: string;
}

export class Validator {
    errors: ErrorBag;
    fields: FieldBag;
    fieldBag: FieldFlagsBag;
    strict: boolean;
    locale: string;
    readonly dictionary: any;
    readonly rules: Object;
    static locale: String;
    static readonly rules: Object;
    static readonly dictionary: any;

    constructor(validations: any, options: any);
    attach(name: string, checks: string|Object, options?: Object): Field;
    attach(options: FieldOptions): Field;
    reset(matcher?: FieldMatchOptions): Promise<void>;
    detach(name: string, scope?: string): void;
    extend(name: string, validator: Object|Function): void;
    flag(name: string, flags: Object): void;
    pause(): Validator;
    remove(name: string): void;
    update(id: string, diff: Object): void;
    resume(): Validator;
    localize(rootDictionary?: Object) :void;
    localize(language: string, dictionary?: Object) :void;
    setStrictMode(strictMode?: boolean): void;
    validate(name: string, value?: any, scope?: string, silent?: boolean): Promise<any>;
    validateAll(values?: Object, scope?: string, silent?: boolean): Promise<any>;
    validateScopes(silent?: boolean): Promise<any>;
    static create(validations: Object, options: any): Validator;
    static extend(name: string, validator: Object|Function): void;
    static remove(name: string): void;
    static setStrictMode(strictMode?: boolean): void;
    static localize(rootDictionary: Object): void;
    static localize(language: string, dictionary?: Object): void;
}

export const version: string;

export const install: Vue.PluginFunction<never>

export const directive: Vue.DirectiveOptions;
