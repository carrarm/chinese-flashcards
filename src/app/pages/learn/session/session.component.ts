import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/core/model/card.model';
import { LearningSessionService } from 'src/app/core/services/learning-session.service';

@Component({
  selector: 'chf-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  public sessionCards: Card[] = [];

  constructor(learningSessionService: LearningSessionService, router: Router) {
    this.sessionCards = learningSessionService.currentSession.getValue();
    if (!this.sessionCards.length) {
      router.navigateByUrl('/sessions');
    }
  }
}
