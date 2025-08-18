import { Component, computed, input } from "@angular/core";
import { NgCircleProgressModule } from "ng-circle-progress";

@Component({
  selector: "chf-card-progress-indicator",
  imports: [NgCircleProgressModule],
  templateUrl: "./card-progress-indicator.component.html",
  styleUrls: ["./card-progress-indicator.component.scss"],
})
export class CardProgressIndicatorComponent {
  public readonly label = input<string>();
  public readonly percent = input(0);
  public readonly cardCount = input("0", { transform: (value: number) => `${value}` });

  protected readonly subtitle = computed(() =>
    Number(this.cardCount()) > 1 ? "cards" : "card"
  );
}
