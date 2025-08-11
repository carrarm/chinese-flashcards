import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { Indexable, Nullable } from "@core/types";

const DEFAULT = {
  required: "Field required",
};

@Component({
  selector: "chf-form-error-messages",
  imports: [],
  templateUrl: "./form-error-messages.component.html",
  styleUrl: "./form-error-messages.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormErrorMessagesComponent {
  @Input({ required: true }) errors!: Nullable<ValidationErrors>;
  @Input() customMessages: Indexable<string> = {};
  @Input() errorOrder = ["required"];

  public getMainError(): string {
    // Copy to a variable so that TS will be happy with the errors[error] later
    const errors = this.errors ? { ...this.errors } : undefined;
    let errorMessage = "";

    if (errors) {
      const mergedErrorMessages: Indexable<string> = {
        ...DEFAULT,
        ...this.customMessages,
      };
      const mainError = this.errorOrder.find((error) => !!errors[error]);
      if (mainError) {
        errorMessage = mergedErrorMessages[mainError];
      }
    }

    return errorMessage;
  }
}
