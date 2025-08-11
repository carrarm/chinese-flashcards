
import { Component, model } from "@angular/core";
import { CardDifficultyLevel } from "@core/model/card.model";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "chf-card-difficulty",
  imports: [FontAwesomeModule],
  templateUrl: "./card-difficulty.component.html",
  styleUrls: ["./card-difficulty.component.scss"],
})
export class CardDifficultyComponent {
  public readonly difficulty = model<CardDifficultyLevel>();
}
