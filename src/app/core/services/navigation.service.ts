import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly pageTitle = new BehaviorSubject<string | null>(null);

  constructor(private titleService: Title) {}

  setTitle(title: string): void {
    this.titleService.setTitle('Chinese Flashcards | ' + title);
    this.pageTitle.next(title);
  }

  getTitle(): Observable<string | null> {
    return this.pageTitle.asObservable();
  }
}
