// Originally implemented in react-hook-form
// https://github.com/react-hook-form/react-hook-form/tree/master/src/types/path

/* eslint-disable @typescript-eslint/no-explicit-any */

type BrowserNativeObject = Date | FileList | File;

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

/**
 * Checks whether the type is any
 * See {@link https://stackoverflow.com/a/49928360/3406963}
 * @typeParam T - type which may be any
 * ```
 * IsAny<any> = true
 * IsAny<string> = false
 * ```
 */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Checks whether T1 can be exactly (mutually) assigned to T2
 * @typeParam T1 - type to check
 * @typeParam T2 - type to check against
 * ```
 * IsEqual<string, string> = true
 * IsEqual<'foo', 'foo'> = true
 * IsEqual<string, number> = false
 * IsEqual<string, number> = false
 * IsEqual<string, 'foo'> = false
 * IsEqual<'foo', string> = false
 * IsEqual<'foo' | 'bar', 'foo'> = boolean // 'foo' is assignable, but 'bar' is not (true | false) -> boolean
 * ```
 */
export type IsEqual<T1, T2> = T1 extends T2
  ? (<G>() => G extends T1 ? 1 : 2) extends <G>() => G extends T2 ? 1 : 2
    ? true
    : false
  : false;

/**
 * Type to query whether an array type T is a tuple type.
 * @typeParam T - type which may be an array or tuple
 * @example
 * ```
 * IsTuple<[number]> = true
 * IsTuple<number[]> = false
 * ```
 */
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;

/**
 * Type which can be used to index an array or tuple type.
 */
type ArrayKey = number;

/**
 * Helper function to break apart T1 and check if any are equal to T2
 *
 * See {@link IsEqual}
 */
type AnyIsEqual<T1, T2> = T1 extends T2 ? (IsEqual<T1, T2> extends true ? true : never) : never;

/**
 * Type which given a tuple type returns its own keys, i.e. only its indices.
 * @typeParam T - tuple type
 * @example
 * ```
 * TupleKeys<[number, string]> = '0' | '1'
 * ```
 */
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;

/**
 * Helper type to construct tuple key paths and recurse into its elements.
 *
 * See {@link Path}
 */
type PathInternalTuple<TValue extends ReadonlyArray<any>, TraversedTypes> = {
  [Key in TupleKeys<TValue> & string]: `[${Key}]` | `[${Key}]${PathInternal<TValue[Key], TraversedTypes, false>}`;
}[TupleKeys<TValue> & string];

/**
 * Helper type to construct array key paths and recurse into its elements.
 *
 * See {@link Path}
 */
type PathInternalArray<TValue extends ReadonlyArray<any>, TraversedTypes> =
  | `[${ArrayKey}]`
  | `[${ArrayKey}]${PathInternal<TValue[ArrayKey], TraversedTypes, false>}`;

/**
 * Helper type to construct object key paths and recurse into its nested values.
 *
 * See {@link Path}
 */
type PathInternalObject<TValue, TraversedTypes, First extends boolean> = {
  [Key in keyof TValue & string]: First extends true
    ? `${Key}` | `${Key}${PathInternal<TValue[Key], TraversedTypes, false>}`
    : `.${Key}` | `.${Key}${PathInternal<TValue[Key], TraversedTypes, false>}`;
}[keyof TValue & string];

/**
 * Helper type to construct nested any object key paths.
 *
 * See {@link Path}
 */
type PathInternalAny = `.${string}` | `[${string}]` | `[${string}].${string}`;

/**
 * Helper type for recursively constructing paths through a type.
 *
 * This obscures internal type params TraversedTypes and First from ed contract.
 *
 * See {@link Path}
 */
type PathInternal<TValue, TraversedTypes, First extends boolean> = TValue extends Primitive | BrowserNativeObject
  ? IsAny<TValue> extends true
    ? PathInternalAny
    : never
  : TValue extends ReadonlyArray<any>
    ? // Check so that we don't recurse into the same type by ensuring that the
      // types are mutually assignable mutually required to avoid false
      // positives of subtypes
      true extends AnyIsEqual<TraversedTypes, TValue>
      ? never
      : IsTuple<TValue> extends true
        ? PathInternalTuple<TValue, TraversedTypes | TValue>
        : PathInternalArray<TValue, TraversedTypes | TValue>
    : TValue extends Record<string, any>
      ? PathInternalObject<TValue, TraversedTypes | TValue, First>
      : '';

/**
 * Helper type for recursively constructing paths through a type.
 * This actually constructs the strings and recurses into nested
 * object types.
 *
 * See {@link ArrayPath}
 */
type ArrayPathImpl<K extends string | number, V, TraversedTypes> = V extends Primitive | BrowserNativeObject
  ? IsAny<V> extends true
    ? string
    : never
  : V extends ReadonlyArray<infer U>
    ? U extends Primitive | BrowserNativeObject
      ? IsAny<V> extends true
        ? string
        : never
      : // Check so that we don't recurse into the same type
        // by ensuring that the types are mutually assignable
        // mutually required to avoid false positives of subtypes
        true extends AnyIsEqual<TraversedTypes, V>
        ? never
        : `${K}` | `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`
    : true extends AnyIsEqual<TraversedTypes, V>
      ? never
      : `${K}.${ArrayPathInternal<V, TraversedTypes | V>}`;

/**
 * Helper type for recursively constructing paths through a type.
 * This obscures the internal type param TraversedTypes from ed contract.
 *
 * See {@link ArrayPath}
 */
type ArrayPathInternal<T, TraversedTypes = T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
          [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K], TraversedTypes>;
        }[TupleKeys<T>]
      : ArrayPathImpl<ArrayKey, V, TraversedTypes>
    : {
        [K in keyof T]-?: ArrayPathImpl<K & string, T[K], TraversedTypes>;
      }[keyof T];

/**
 * Type which eagerly collects all paths through a type which point to an array
 * type.
 * @typeParam T - type which should be introspected.
 * @example
 * ```
 * Path<{foo: {bar: string[], baz: number[]}}> = 'foo.bar' | 'foo.baz'
 * ```
 */
// We want to explode the union type and process each individually
// so assignable types don't leak onto the stack from the base.
type ArrayPath<T> = T extends any ? ArrayPathInternal<T> : never;

/**
 * Type to evaluate the type which the given path points to.
 * @typeParam T - deeply nested type which is indexed by the path
 * @typeParam P - path into the deeply nested type
 * @example
 * ```
 * PathValue<{foo: {bar: string}}, 'foo.bar'> = string
 * PathValue<[number, string], '1'> = string
 * ```
 */
export type PathValue<T, P extends Path<T> | ArrayPath<T>> = T extends any
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends Path<T[K]>
        ? PathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? PathValue<V, R & Path<V>>
          : never
        : never
    : P extends keyof T
      ? T[P]
      : P extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? V
          : never
        : never
  : never;

/**
 * Type which eagerly collects all paths through a type
 * @typeParam T - type which should be introspected
 * @example
 * ```
 * Path<{foo: {bar: string}}> = 'foo' | 'foo.bar'
 * ```
 */
// We want to explode the union type and process each individually
// so assignable types don't leak onto the stack from the base.
export type Path<T> = T extends any ? PathInternal<T, T, true> & string : never;
