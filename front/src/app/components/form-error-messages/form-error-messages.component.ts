import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { ValidationErrors } from "@angular/forms";
import { Nullable } from "@core/types";

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
  public readonly errors = input.required<Nullable<ValidationErrors>>();
  public readonly customMessages = input<Record<string, string>>({});
  public readonly errorOrder = input<string[]>(["required"]);

  protected readonly getMainError = computed(() => {
    // Copy to a variable so that TS will be happy with the errors[error] later
    const errors = this.errors() ? { ...this.errors() } : undefined;
    let errorMessage = "";

    if (errors) {
      const mergedErrorMessages: Record<string, string> = {
        ...DEFAULT,
        ...this.customMessages(),
      };
      const mainError = this.errorOrder().find((error) => !!errors[error]);
      if (mainError) {
        errorMessage = mergedErrorMessages[mainError];
      }
    }

    return errorMessage;
  });
}
