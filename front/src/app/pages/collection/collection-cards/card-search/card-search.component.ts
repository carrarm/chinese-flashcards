import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'chf-card-search',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, FontAwesomeModule, MatDividerModule],
  templateUrl: './card-search.component.html',
  styleUrl: './card-search.component.scss',
})
export class CardSearchComponent {
  public readonly searchChange = output<string | null>();

  protected readonly filter = signal('');
  protected readonly filter$ = new Subject<string | null>();

  constructor() {
    this.filter$
        .pipe(debounceTime(300))
        .subscribe((value) => this.searchChange.emit(value));
  }

  protected onInput(value: string | null): void {
    this.filter.set(value ?? '');
    this.filter$.next(value);
  }

  protected onClear(): void {
    this.filter.set('');
    this.filter$.next(null);
  }
}
