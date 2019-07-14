import Vue, { DirectiveOptions, VueConstructor, ComponentOptions, PluginFunction, Component } from 'vue';

export type StringNullable = string | null

export interface VeeValidateComponentOptions {
    validator?: 'new' | 'inherit';
    name?: () => string;
    value?: () => any;
    rejectsFalse?: boolean;
    events?: string;
}

export interface ClassNames {
    touched?: string;
    untouched?: string;
    valid?: string;
    invalid?: string;
    pristine?: string;
    dirty?: string;
}

export interface Configuration {
    aria?: boolean;
    classNames?: ClassNames;
    classes?: boolean;
    delay?: number;
    dictionary?: PartialDictionary | null;
    errorBagName?: string;
    events?: string;
    fieldsBagName?: string;
    fastExit?: boolean;
    i18n?: any;
    i18nRootKey?: string;
    inject?: boolean;
    locale?: string;
    validity?: boolean;
    useConstraintAttrs?: boolean;
    mode?: string;
}

export interface MapObject {
    [key: string]: any;
}

export interface MessageGenerator {
    (field: string, params: any[], data: MapObject): string;
}

export interface Locale {
    messages?: object | { [key: string]: MessageGenerator };
    attributes?: object | { [key: string]: string };
    custom?: object | { [key: string]: MessageGenerator };
    dateFormat?: string;
}

export interface PartialDictionary {
    [lang: string]: Locale;
}

export interface IDictionary {
    locale: string;
    getMessage (locale: string, key: string, data: any[]): string;
    setMessage(locale: string, key: string, value: string | MessageGenerator): void;
    getAttribute(locale: string, key: string): string;
    setAttribute(locale: string, key: string, value: string): string;
    getFieldMessage(locale: string, field: string, key: string, data: any[]): string;
    merge(dictionary: MapObject): void;
    getDateFormat(locale: string): string | undefined;
    setDateFormat(locale: string, format: string): void;
}

export type ResultObject = {
    valid: boolean;
    data?: object;
}

export type RuleResult = boolean | ResultObject | boolean[] | ResultObject[] | Promise<boolean | ResultObject | boolean[] | ResultObject[]>

export interface RuleValidate {
    (value: any, args?: object | any[], data?: any): RuleResult
}

export interface Rule {
    validate: RuleValidate;
    options?: object;
    paramNames?: string[];
    getMessage? (field: string, params: any[], data: any): string;
}

export interface Rules {
    [rule: string]: Rule;
}

export const Rules: {
    [rule: string]: Rule;
}

export interface Watcher {
    tag: string;
    unwatch: () => void;
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
    classNames?: ClassNames;
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
    scope?: StringNullable;
    targetOf?: StringNullable;
    validity?: boolean;
    vm?: any;
}

export class Field {
    id: string;
    el: Element;
    updated: boolean;
    dependencies: { name: string, field: Field }[];
    watchers: Watcher[];
    events: string[];
    rules: Rules;
    validity: boolean;
    aria: boolean;
    vm: Vue | null;
    component: ComponentOptions<Vue> | null;
    ctorConfig: Configuration | null;
    flags: FieldFlags;
    getter: () => any;
    name: string;
    scope: StringNullable;
    targetOf: StringNullable;
    immediate: boolean;
    classes: boolean;
    classNames: ClassNames;
    delay: number;
    listen: boolean;
    model: { expression: StringNullable; lazy: boolean; } | null;
    readonly validator: Validator;
    readonly isRequired: boolean;
    readonly isDisabled: boolean;
    /**
     * Gets the display name (user-friendly name).
     */
    readonly alias: StringNullable;
    /**
     * Gets the input value.
     */
    readonly value: any;
    readonly bails: boolean;
    /**
     * If the field rejects false as a valid value for the required rule.
     */
    readonly rejectsFalse: boolean;

    constructor(options?: FieldOptions);
    /**
     * Determines if the instance matches the options provided.
     */
    matches(options: FieldMatchOptions | null): boolean;
    /**
     * Keeps a reference of the most current validation run.
     */
    waitFor (pendingPromise: Promise<any>): void;
    isWaitingFor (promise: Promise<any>): boolean;
    /**
     * Updates the field with changed data.
     */
    update(options: FieldOptions): void;
    /**
     * Resets field flags and errors.
     */
    reset(): void;
    /**
     * Sets the flags and their negated counterparts, and updates the classes and re-adds action listeners.
     */
    setFlags (flags: Partial<FieldFlags>): void;
    /**
     * Determines if the field requires references to target fields.
     */
    updateDependencies (): void;
    /**
     * Removes listeners.
     */
    unwatch(flag?: RegExp | null): void;
    /**
     * Updates the element classes depending on each field flag status.
     */
    updateClasses (isReset?: boolean): void;
    /**
     * Adds the listeners required for automatic classes and some flags.
     */
    addActionListeners (): void;
    checkValueChanged (): boolean;
    /**
     * Adds the listeners required for validation.
     */
    addValueListeners (): void;
    /**
     * Updates aria attributes on the element.
     */
    updateAriaAttrs (): void;
    /**
     * Updates the custom validity for the field.
     */
    updateCustomValidity (): void;
    /**
     * Removes all listeners.
     */
    destroy (): void;
}

export interface FieldError {
    field: string;
    msg: string;
    scope?: string;
    id?: string;
    rule?: string;
    regenerate?: () => string
}

export class ErrorBag {
    vmId: string;
    items: FieldError[];

    constructor(errorBag?: ErrorBag | null, id?: StringNullable);
    /**
     * Adds an error to the internal array.
     */
    add(error: FieldError | FieldError[]): void;
    /**
     * Regenrates error messages if they have a generator function.
     */
    regenerate (): void;
    /**
     * Updates a field error with the new field scope.
     */
    update (id: string, error: FieldError): void;
    /**
     * Gets all error messages from the internal array.
     */
    all(scope?: StringNullable): string[];
    /**
     * Checks if there are any errors in the internal array.
     */
    any(scope?: StringNullable): boolean;
    /**
     * Removes all items from the internal array.
     */
    clear(scope?: StringNullable): void;
    /**
     * Collects errors into groups or for a specific field.
     */
    collect(field?: string, scope?: StringNullable, map?: boolean): FieldError[];
    /**
     * Gets the internal array length.
     */
    count(): number;
    /**
     * Finds and fetches the first error message for the specified field id.
     */
    firstById (id: string): string | undefined
    /**
     * Gets the first error message for a specific field.
     */
    first(field: string, scope?: StringNullable): string;
    /**
     * Returns the first error rule for the specified field
     */
    firstRule(field: string, scope?: StringNullable): string | undefined;
    /**
     * Gets the first error message for a specific field and a rule.
     */
    firstByRule (name: string, rule: string, scope?: StringNullable): string | undefined;
    /**
     * Gets the first error message for a specific field that not match the rule.
     */
    firstNot (name: string, rule?: string, scope?: StringNullable): string | undefined;
    /**
     * Checks if the internal array has at least one error for the specified field.
     */
    has(field: string, scope?: StringNullable): boolean;
    /**
     * Removes errors by matching against the id or ids.
     */
    removeById (id: string | string[]): void;
    /**
     * Removes all error messages associated with a specific field.
     */
    remove (field: string, scope?: StringNullable, vmId?: StringNullable): void;
}

export class FieldBag {
    items: Field[];
    readonly length: number;

    constructor(items?: Field[]);
    /**
     * Finds the first field that matches the provided matcher object.
     */
    find(matcher: FieldMatchOptions): Field | undefined;
    /**
     * Filters the items down to the matched fields.
     */
    filter(matcher: FieldMatchOptions | FieldMatchOptions[]): Field[];
    /**
     * Maps the field items using the mapping function.
     */
    map(mapper: (value: Field, index: number, array: Field[]) => any): Field[];
    /**
     * Finds and removes the first field that matches the provided matcher object, returns the removed item.
     */
    remove (matcher: FieldMatchOptions | Field): Field | null
    /**
     * Adds a field item to the list.
     */
    push (item: Field): void
}

export interface FieldFlagsBag {
    [field: string]: FieldFlags;
}

export interface FieldMatchOptions {
    id?: string;
    scope?: string;
    name?: string;
}

export interface VerifyResult {
    valid: boolean;
    errors: string[];
    failedRules: { [x: string]: string };
}

export interface VerifyOptions {
    bails?: boolean;
    name?: string;
    values?: { [x: string]: any };
}

export interface ValidationSlotScopeData {
    errors: string[];
    flags: FieldFlags;
    valid: boolean;
    failedRules: { [x: string]: string };
    reset(): void;
    validate(value?: any): Promise<VerifyResult>
}

export class Validator {
    errors: ErrorBag;
    fields: FieldBag;
    fastExit: boolean;
    paused: boolean;
    /**
     * @deprecated
     */
    static readonly rules: Rules
    /**
     * @deprecated
     */
    readonly rules: Rules
    readonly dictionary: IDictionary
    static readonly dictionary: IDictionary
    readonly flags: FieldFlagsBag;
    locale: string;
    static locale: string;


    constructor(validations?: MapObject, options?: Configuration, pluginContainer?: object | null);
    /**
     * Registers a field to be validated.
     */
    attach(options: FieldOptions): Field;
    reset(matcher?: FieldMatchOptions): Promise<void>;
    /**
     * Removes a field from the validator.
     */
    detach(name: string, scope?: StringNullable): void;
    /**
     * Adds a custom validator to the list of validation rules.
     */
    extend(name: string, validator: Rule | RuleValidate, options?: ExtendOptions): void;
    /**
     * Sets the flags on a field.
     */
    flag(name: string, flags: Partial<FieldFlags>, uid?: string): void;
    /**
     * Pauses the validator.
     */
    pause(): this;
    /**
     * Removes a rule from the list of validators.
     * @deprecated
     */
    remove(name: string): void;
    /**
     * Updates a field, updating both errors and flags.
     */
    update(id: string, diff: Field): void;
    /**
     * Resumes the validator.
     */
    resume(): this;
    /**
     * Adds and sets the current locale for the validator.
     */
    localize(rootDictionary?: PartialDictionary): void;
    /**
     * Adds and sets the current locale for the validator.
     */
    localize(lang: string, dictionary?: Locale): void;
    /**
     * Validates a value against a registered field validations.
     */
    validate(fieldDescriptor?: string, value?: any, field?: Field): Promise<boolean>;
    /**
     * Validates each value against the corresponding field validations.
     */
    validateAll(values?: string | MapObject, field?: Field): Promise<boolean>;
    /**
     * Validates all scopes.
     */
    validateScopes(field?: Field): Promise<boolean>;
    /**
     * Validates a value against the rules.
     */
    verify(value: any, rules: string | Rules, options?: VerifyOptions): Promise<VerifyResult>;
    /**
     * Perform cleanup.
     */
    destroy(): void;
    /**
     * Static constructor.
     * @deprecated
     */
    static create(validations: MapObject, options: Configuration): Validator;
    /**
     * Adds a custom validator to the list of validation rules.
     */
    static extend(name: string, validator: Rule | RuleValidate, options?: ExtendOptions): void;
    /**
     * Removes a rule from the list of validators.
     * @deprecated
     */
    static remove(name: string): void;
    /**
     * Adds and sets the current locale for the validator.
     */
    static localize(rootDictionary: PartialDictionary): void;
    /**
     * Adds and sets the current locale for the validator.
     */
    static localize(lang: string | PartialDictionary, dictionary?: Locale): void;
}

export class ExtendOptions {
    hasTarget?: boolean;
    paramNames?: string[];
    computesRequired?: boolean;
    initial?: boolean;
    immediate?: boolean;
    isDate?: boolean;
}

/**
 * `mapFields` helper, which is similar to Vuex's `mapGetters` and `mapActions`
 * as it maps a field object to a computed property.
 */
export function mapFields(fields?: string[] | { [key: string]: string }): any;

export interface ValidationFlags {
  untouched: boolean;
  touched: boolean;
  dirty: boolean;
  pristine: boolean;
  valid: boolean | null;
  invalid: boolean | null;
  validated: boolean;
  pending: boolean;
  required: boolean;
  changed: boolean;
  [x: string]: boolean | null | undefined;
}

// maps known keys of a given type.
// https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-414782407
type KnownKeys<T> = { [K in keyof T]: string extends K ? never : number extends K ? never : K } extends {
  [_ in keyof T]: infer U
}
  ? U
  : never;

interface ObserverSlotData extends Pick<ValidationFlags, KnownKeys<ValidationFlags>> {
  errors: string[];
}

export interface PluginContext {
    Validator: Validator;
    ErrorBag: ErrorBag;
    Rules: Rules;
}

/**
 * The `ValidationObserver` is a convenient component that uses the `scoped slots` feature
 * to communicate the current state of your inputs as a whole.
 */
export interface ValidationObserverInstance extends Vue {
  /**
   * Trigger validation across all child components validation state, updates their validation state.
   * Can pass a silent flag to only report the current state of the observed children without triggering state change.
   */
  validate(opts?: { silent: boolean }): Promise<boolean>;

  /**
   * Reset all observed components validation state.
   */
  reset(): void;

  /**
   * Holds reference to the observed child observer components.
   */
  observers: ValidationObserverInstance[];

  /**
   * Contains an id, provider-instances pairs of the observed children.
   */
  refs: { [x: string]: ValidationProviderInstance };

  /**
   * Validation state object representing the combined state of the observed children.
   */
  ctx: ObserverSlotData;
}

/**
 * The `ValidationProvider` component is a regular component
 * that wraps your inputs and provides validation state using `scoped slots`.
 */
export interface ValidationProviderInstance extends Vue {
  messages: string[];
  flags: ValidationFlags;

  /**
   * Updates the validation state with the given result.
   */
  applyResult(result: VerifyResult): void;

  /**
   * Triggers a validation, updates messages and flags.
   */
  validate(value: any): Promise<VerifyResult>;

  /**
   * Resets validation state, clears error messages.
   */
  reset(): void;

  /**
   * Triggers a validation without setting flags or updating messages.
   */
  validateSilent(): Promise<VerifyResult>;

  /**
   * Forces the provider value to the given value without triggering validation.
   */
  syncValue(value: any): void;

  /**
   * Sets the current flags for the provider instance.
   */
  setFlags(value: Partial<ValidationFlags>): void;
}

/**
 * The `ValidationProvider` component is a regular component
 * that wraps your inputs and provides validation state using `scoped slots`.
 */
export const ValidationProvider: Component;

/**
 * The `ValidationObserver` is a convenient component that uses the `scoped slots` feature
 * to communicate the current state of your inputs as a whole.
 */
export const ValidationObserver: Component;

export interface ValidationContext {
    errors: string[];
    flags: ValidationFlags;
    classes: { [k: string]: string | string[] };
    valid: boolean;
    failedRules: { [k: string]: string };
    reset: () => void;
    validate: (evtOrNewValue: Event | any) => Promise<VerifyResult>;
    aria: {
      'aria-invalid': 'true' | 'false';
      'aria-required': 'true' | 'false';
    };
  }


type ValidationContextMapper = (ctx: ValidationContext) => { [k: string]: any };

type ComponentLike = Component | { options: any };

export function withValidation (component: ComponentLike, mapProps?: ValidationContextMapper): Component;

export const version: string;

export const install: Vue.PluginFunction<Configuration>

export const directive: Vue.DirectiveOptions;


export default class VeeValidate {
    readonly config: Configuration;
    readonly i18nDriver: IDictionary;
    static readonly i18nDriver: IDictionary;
    static readonly config: Configuration;
    static version: string;
    static install: PluginFunction<Configuration>;
    static Validator: Validator;
    static ErrorBag: ErrorBag;
    static Rules: Rules;
    static ValidationProvider: typeof ValidationProvider;
    static ValidationObserver: typeof ValidationObserver;
    static mixin: VueConstructor | ComponentOptions<Vue>;
    static directive: DirectiveOptions;
    configure(cfg: Configuration): void;
    static setI18nDriver(driver: string, instance: IDictionary): void;
    static configure(cfg: Configuration): void;
    static setMode(mode: string, implementation: Function): void;
    static use<T>(plugin: (ctx: PluginContext, options?: T) => any, options?: T): void;
    static withValidation(component: Vue, mapFn: (ctx: ValidationSlotScopeData) => object): Vue
    /**
     * `mapFields` helper, which is similar to Vuex's `mapGetters` and `mapActions`
     * as it maps a field object to a computed property.
     */
    static mapFields(fields?: string[] | { [key: string]: string }): object | Function;
}
