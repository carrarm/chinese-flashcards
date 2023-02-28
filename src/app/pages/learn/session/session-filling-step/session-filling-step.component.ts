import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Card } from 'src/app/core/model/card.model';
import { SettingsService } from 'src/app/core/services/settings.service';
import {
  removeOnce,
  shuffleArray,
  uniqueValues,
} from 'src/app/core/utils/general.utils';
import { SessionCard } from '../session-card.model';

@Component({
  selector: 'chf-session-filling-step',
  templateUrl: './session-filling-step.component.html',
  styleUrls: ['./session-filling-step.component.scss'],
})
export class SessionFillingStepComponent {
  @Input() cards: Card[] = [];
  @Output() completed = new EventEmitter<SessionCard[]>();

  public sessionCards = new Map<number, SessionCard>();
  public session: number[] = [];
  public currentCard?: SessionCard;
  public characterInput?: string;
  public pinyinInput?: string;
  public learnPinyin = true;
  public cardRevealed = false;
  public isMistake = false;

  constructor(settingsService: SettingsService) {
    settingsService
      .getSettings()
      .then((settings) => (this.learnPinyin = settings.learnPinyin));
  }

  ngOnInit(): void {
    this.cards.forEach((card) => {
      const sessionCard = new SessionCard(card);
      this.sessionCards.set(sessionCard.id, sessionCard);
    });

    this.buildSessionCards();
    this.nextCard();
  }

  checkResponse(): void {
    let chineseMatch = true;
    let pinyinMatch = true;
    if (this.currentCard) {
      if (this.currentCard.characters) {
        chineseMatch =
          this.currentCard.characters.trim() === this.characterInput?.trim();
      }
      if (this.currentCard.pinyin) {
        pinyinMatch =
          this.currentCard.pinyin.trim() === this.pinyinInput?.trim();
      }
      this.isMistake = !chineseMatch || !pinyinMatch;
      this.cardRevealed = true;

      if (this.isMistake) {
        this.wrongAnswer();
      }
    }
  }

  reveal(): void {
    this.cardRevealed = true;
    this.isMistake = true;
    this.wrongAnswer();
  }

  nextCard(): void {
    const nextCard = this.session.shift();
    this.cardRevealed = false;
    this.characterInput = undefined;
    this.pinyinInput = undefined;
    if (nextCard) {
      this.currentCard = this.sessionCards.get(nextCard);
    } else {
      this.completed.emit([...this.sessionCards.values()]);
    }
  }

  private wrongAnswer(): void {
    if (this.currentCard) {
      this.currentCard.mistakes++;
      // Add the card to the list of the session so that it will be presented one more time
      this.session.push(this.currentCard.id);
    }
  }

  private buildSessionCards(): void {
    let allCards: number[] = [];
    this.sessionCards.forEach((sessionCard: SessionCard) => {
      allCards = allCards.concat(
        Array(sessionCard.getNumberOfRepetitions()).fill(sessionCard.id)
      );
    });

    this.session = [];
    while (allCards.length) {
      const uniqueCards = uniqueValues(allCards);
      this.session.push(...shuffleArray(uniqueCards));
      removeOnce(allCards, uniqueCards);
    }
  }
}
