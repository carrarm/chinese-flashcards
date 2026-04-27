import { I18nPluralPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'chf-collection-header',
  imports: [FontAwesomeModule, I18nPluralPipe],
  templateUrl: './collection-header.component.html',
  styleUrl: './collection-header.component.scss',
})
export class CollectionHeaderComponent {
  public readonly label = input<string>();
  public readonly cardCount = input.required<number>();

  protected readonly cardCountPlural = {
    "=0": "0 card",
    "=1": "1 card",
    other: "# cards",
  };
}
