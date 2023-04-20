import { Ref } from 'vue';
import { Path } from './paths';

export type GenericObject = Record<string, any>;

export type MaybeRef<T> = Ref<T> | T;

export type MaybeArray<T> = T | T[];

export type MaybeRefOrLazy<T> = MaybeRef<T> | (() => T);

export type MapValues<T, TValues extends GenericObject> = {
  [K in keyof T]: T[K] extends MaybeRef<infer TKey>
    ? TKey extends Path<TValues>
      ? Ref<TValues[TKey]>
      : Ref<unknown>
    : Ref<unknown>;
};
export type MapPaths<TRecord, TType> = { [K in Path<TRecord>]: TType };
