export const formFieldContext = Symbol('olive-form-field');

export interface FormFieldContext {
  readonly controlId: string;
  readonly descriptionId: string | undefined;
  readonly invalid: boolean;
}
