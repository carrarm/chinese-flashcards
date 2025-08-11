import { Component, inject, input, OnInit, output } from "@angular/core";
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
  standalone: false,
})
export class SessionFillingStepComponent implements OnInit {
  public readonly cards = input<Card[]>([]);
  public readonly completed = output<SessionCard[]>();

  private readonly navigationService = inject(NavigationService);

  protected sessionCards = new Map<number, SessionCard>();
  protected session: number[] = [];
  protected currentCard?: SessionCard;
  protected characterInput?: string;
  protected pinyinInput?: string;
  protected cardRevealed = false;
  protected isMistake = false;

  public ngOnInit(): void {
    this.navigationService.navbarType.set("description");
    this.navigationService.navbarText.set(
      "Translate the card by filling in both the characters and the pinyin transcription"
    );

    this.cards().forEach((card) => {
      const sessionCard = new SessionCard(card);
      this.sessionCards.set(sessionCard.id, sessionCard);
    });

    this.buildSessionCards();
    this.nextCard();
  }

  protected changeDifficulty(difficulty: CardDifficultyLevel): void {
    this.currentCard?.changeDifficulty(difficulty);
  }

  protected checkResponse(): void {
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

  protected reveal(): void {
    this.cardRevealed = true;
    this.isMistake = true;
    this.wrongAnswer();
  }

  protected nextCard(): void {
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
