export type ValidationRuleFunction = (
  value: any,
  params?: any[] | Record<string, any>
) => boolean | string | Promise<boolean | string>;
