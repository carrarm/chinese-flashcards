import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Card, CardDifficultyLevel } from "@core/model/card.model";
import { NavigationService } from "@core/services/navigation.service";
import {
  removeOnce,
  removeTimes,
  shuffleArray,
  uniqueValues,
} from "@core/utils/general.utils";
import { SessionCard } from "../session-card.model";

@Component({
  selector: "chf-session-filling-step",
  templateUrl: "./session-filling-step.component.html",
  styleUrls: ["./session-filling-step.component.scss"],
})
export class SessionFillingStepComponent implements OnInit {
  @Input() cards: Card[] = [];
  @Output() completed = new EventEmitter<SessionCard[]>();

  public sessionCards = new Map<number, SessionCard>();
  public session: number[] = [];
  public currentCard?: SessionCard;
  public characterInput?: string;
  public pinyinInput?: string;
  public cardRevealed = false;
  public isMistake = false;

  constructor(navigationService: NavigationService) {
    navigationService.navbarType.next("description");
    navigationService.navbarText.next(
      "Translate the card by filling in both the characters and the pinyin transcription"
    );
  }

  public ngOnInit(): void {
    this.cards.forEach((card) => {
      const sessionCard = new SessionCard(card);
      this.sessionCards.set(sessionCard.id, sessionCard);
    });

    this.buildSessionCards();
    this.nextCard();
  }

  public changeDifficulty(difficulty: CardDifficultyLevel): void {
    this.currentCard?.changeDifficulty(difficulty);
  }

  public checkResponse(): void {
    let chineseMatch = true;
    let pinyinMatch = true;
    if (this.currentCard) {
      if (this.currentCard.characters) {
        chineseMatch = this.currentCard.characters.trim() === this.characterInput?.trim();
      }
      if (this.currentCard.pinyin) {
        pinyinMatch = this.currentCard.pinyin.trim() === this.pinyinInput?.trim();
      }
      this.isMistake = !chineseMatch || !pinyinMatch;
      this.cardRevealed = true;

      if (this.isMistake) {
        this.wrongAnswer();
      } else {
        this.currentCard.currentRepetitions++;
      }
    }
  }

  public reveal(): void {
    this.cardRevealed = true;
    this.isMistake = true;
    this.wrongAnswer();
  }

  public nextCard(): void {
    this.updateSessionCards();
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
        Array(sessionCard.numberOfRepetitions).fill(sessionCard.id)
      );
    });

    this.session = [];
    while (allCards.length) {
      const uniqueCards = uniqueValues(allCards);
      this.session.push(...shuffleArray(uniqueCards));
      removeOnce(allCards, uniqueCards);
    }
  }

  private updateSessionCards(): void {
    if (this.currentCard) {
      const expectedRemaining =
        this.currentCard.numberOfRepetitions - this.currentCard.currentRepetitions;

      if (expectedRemaining) {
        const sessionCount = this.session.filter(
          (card) => card === this.currentCard?.id
        ).length;
        if (sessionCount > expectedRemaining) {
          this.session = removeTimes(
            this.session,
            this.currentCard.id,
            sessionCount - expectedRemaining
          );
        } else {
          this.session = shuffleArray(
            this.session.concat(
              Array(expectedRemaining - sessionCount).fill(this.currentCard.id)
            )
          );
        }
      } else {
        this.session = this.session.filter((card) => card !== this.currentCard?.id);
      }
    }
  }
}
