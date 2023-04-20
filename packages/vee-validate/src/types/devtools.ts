import { FieldMeta, FormErrors, FormMeta } from './forms';

export interface DevtoolsPluginFieldState {
  name: string;
  value: any;
  initialValue: any;
  errors: string[];
  meta: FieldMeta<any>;
}

export interface DevtoolsPluginFormState {
  meta: FormMeta<Record<string, any>>;
  errors: FormErrors<Record<string, any>>;
  values: Record<string, any>;
  isSubmitting: boolean;
  submitCount: number;
}
