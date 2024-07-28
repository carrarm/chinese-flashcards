import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { Card } from "@core/model/card.model";
import { SettingsService } from "@core/services/settings.service";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: "chf-card-progress-bar",
  templateUrl: "./card-progress-bar.component.html",
  styleUrls: ["./card-progress-bar.component.scss"],
})
export class CardProgressBarComponent implements OnInit {
  @Input() card!: Card;

  constructor(private settings: SettingsService) {}

  public steps: number[] = [];

  get currentStepPercent(): number {
    return ((this.card.leitnerBox + 1) * 100) / this.steps.length;
  }

  ngOnInit(): void {
    this.settings.getSettings().then((settings) => {
      this.steps = Array.from({ length: settings.leitnerBoxes }, (_, key) => key);
    });
  }
}
