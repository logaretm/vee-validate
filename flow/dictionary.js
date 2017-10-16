declare type MessageGenerator = (field: string, params: any[], data: MapObject) => string;

declare type Locale = {
  messages: Object | { [string]: MessageGenerator },
  attributes: Object | { [string]: string },
  custom: Object | { [string]: MessageGenerator },
  dateFormat: ?string
};

declare type PartialDictionary = { [string]: Locale };
