import { MaybeRef, Ref } from 'vue';
import { Path, PathValue } from './paths';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GenericObject = Record<string, any>;

export type MaybeArray<T> = T | T[];

export type MaybePromise<T> = T | Promise<T>;

export type FlattenAndSetPathsType<TRecord, TType> = { [K in Path<TRecord>]: TType };

export type MapValuesPathsToRefs<
  TValues extends GenericObject,
  TPaths extends readonly [...MaybeRef<Path<TValues>>[]],
> = {
  readonly [K in keyof TPaths]: TPaths[K] extends MaybeRef<infer TKey>
    ? TKey extends Path<TValues>
      ? Ref<PathValue<TValues, TKey>>
      : Ref<unknown>
    : Ref<unknown>;
};
