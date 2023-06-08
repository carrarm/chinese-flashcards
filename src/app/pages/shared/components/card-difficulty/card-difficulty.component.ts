import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CardDifficultyLevel } from "@core/model/card.model";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faFaceLaugh,
  faFaceSadTear,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "chf-card-difficulty",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: "./card-difficulty.component.html",
  styleUrls: ["./card-difficulty.component.scss"],
})
export class CardDifficultyComponent {
  @Input() difficulty?: CardDifficultyLevel;

  @Output() difficultyChange = new EventEmitter<CardDifficultyLevel>();

  public icons = {
    hard: faFaceSadTear,
    medium: faFaceSmile,
    easy: faFaceLaugh,
  };
}
