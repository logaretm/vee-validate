declare type MessageGenerator = (field: string, params: any[], data: MapObject) => string;

declare type Locale = {
  messages: Object | { [string]: MessageGenerator },
  attributes: Object | { [string]: string },
  custom: Object | { [string]: MessageGenerator },
  dateFormat: ?string
};

declare type PartialDictionary = { [string]: Locale };

declare interface IDictionary {
  locale: string;
  getMessage (locale: string, key: string, data: any[]): string;
  setMessage(locale: string, key: string, value: string | MessageGenerator): void;
  getAttribute(locale: string, key: string): string;
  setAttribute(locale: string, key: string, value: string): string;
  getFieldMessage(locale: string, field: string, key: string, data: any[]): string;
  merge(dictionary: MapObject): void;
  getDateFormat(locale: string): string | null;
  setDateFormat(locale: string, format: string): void;
}
