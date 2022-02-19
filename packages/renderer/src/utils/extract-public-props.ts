import { ExtractPropTypes } from 'vue';

export type ExtractPublicPropTypes<T> = Omit<
  Partial<ExtractPropTypes<T>>,
  Exclude<themePropKeys, 'themeOverrides'> | Extract<keyof T, `internal${string}`>
>;

export type ExtractInternalPropTypes<T> = Partial<ExtractPropTypes<T>>;
