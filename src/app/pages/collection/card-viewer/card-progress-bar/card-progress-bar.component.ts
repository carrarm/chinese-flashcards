import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { Card } from "@core/model/card.model";
import { SettingsService } from "@core/services/settings.service";

@Component({
  imports: [CommonModule],
  selector: "chf-card-progress-bar",
  templateUrl: "./card-progress-bar.component.html",
  styleUrls: ["./card-progress-bar.component.scss"],
})
export class CardProgressBarComponent implements OnInit {
  public readonly card = input.required<Card>();

  private readonly settings = inject(SettingsService);

  protected readonly currentStepPercent = computed(
    () => ((this.card().leitnerBox + 1) * 100) / this.steps().length
  );
  protected readonly steps = signal<number[]>([]);

  public ngOnInit(): void {
    this.settings.getSettings().then((settings) => {
      this.steps.set(Array.from({ length: settings.leitnerBoxes }, (_, key) => key));
    });
  }
}
