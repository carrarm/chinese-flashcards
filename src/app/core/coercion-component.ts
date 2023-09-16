import { BooleanInput, coerceBooleanProperty } from "@angular/cdk/coercion";
import { Indexable } from "./types";

/**
 * This class adds coercion support for boolean `@Input`s.
 */
export class CoercionComponent {
  public coerced: Indexable<boolean> = {};

  /**
   * Coerces all the specified fields to booleans.
   *
   * @param fields Names of the fields to coerce
   */
  protected coerceAll(fields: string[]): void {
    fields.forEach((fieldName) => this.coerceField(fieldName));
  }

  /**
   * Coerces a field to a boolean. If the value is not provided, the
   * method will try to coerce the field from its name.
   *
   * @param field Name of the field to coerce
   * @param value (optional) Value to coerce
   */
  protected coerceField(field: string, value?: BooleanInput): void {
    const fieldValue =
      value === null || value === undefined ? Reflect.get(this, field) : value;
    this.coerced[field] = coerceBooleanProperty(fieldValue);
  }
}
