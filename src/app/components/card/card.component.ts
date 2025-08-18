import { NgClass } from "@angular/common";
import { booleanAttribute, Component, input } from "@angular/core";

@Component({
  selector: "chf-card",
  imports: [NgClass],
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent {
  public readonly noHeader = input(false, { transform: booleanAttribute });
  public readonly reversedCorners = input(false, { transform: booleanAttribute });
}
