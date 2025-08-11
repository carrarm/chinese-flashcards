import { Component, Input } from "@angular/core";
import { NgCircleProgressModule } from "ng-circle-progress";

@Component({
  selector: "chf-card-progress-indicator",
  imports: [NgCircleProgressModule],
  templateUrl: "./card-progress-indicator.component.html",
  styleUrls: ["./card-progress-indicator.component.scss"],
})
export class CardProgressIndicatorComponent {
  @Input() label?: string;
  @Input() percent = 0;
  @Input() set cardCount(value: number) {
    this.circleTitle = `${value}`;
    this.subtitle = value > 1 ? "cards" : "card";
  }
  public circleTitle = "0";
  public subtitle = "card";
}
