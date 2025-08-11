import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Card } from "@core/model/card.model";
import { NavigationService } from "@core/services/navigation.service";
import { shuffleArray } from "@core/utils/general.utils";

interface MatchingCard {
  card: Card;
  matched: boolean;
}

@Component({
  selector: "chf-session-matching-step",
  templateUrl: "./session-matching-step.component.html",
  styleUrls: ["./session-matching-step.component.scss"],
  standalone: false,
})
export class SessionMatchingStepComponent implements OnInit {
  @Input() cards: Card[] = [];
  @Input() repeat = 1;
  @Output() completed = new EventEmitter<void>();

  public matchingPages: Card[][] = [];
  public leftColumnCards: MatchingCard[] = [];
  public rightColumnCards: MatchingCard[] = [];
  public selectedLeftCard?: MatchingCard;
  public selectedRightCard?: MatchingCard;

  constructor(navigationService: NavigationService) {
    navigationService.setNavbarText(
      "Match cards on the left with their translation on the right",
      "description"
    );
  }

  ngOnInit(): void {
    for (let i = 0; i <= this.repeat; i++) {
      this.matchingPages = this.matchingPages.concat(this.buildStepPages(this.cards));
    }

    this.learnNewPage();
  }

  selectLeftCard(card: MatchingCard): void {
    this.selectedLeftCard = card;
    this.matchSelectedCards();
  }

  selectRightCard(card: MatchingCard): void {
    this.selectedRightCard = card;
    this.matchSelectedCards();
  }

  /**
   * Mark the cards as matched
   */
  private matchSelectedCards(): void {
    if (this.selectedLeftCard && this.selectedRightCard) {
      if (this.selectedLeftCard.card.id === this.selectedRightCard.card.id) {
        this.selectedLeftCard.matched = true;
        this.selectedRightCard.matched = true;
      }
      this.selectedLeftCard = undefined;
      this.selectedRightCard = undefined;

      const allMatched = this.leftColumnCards.every(({ matched }) => matched);
      if (allMatched) {
        this.learnNewPage();
      }
    }
  }

  /**
   * Split the cards into pages of 5 elements.
   *
   * @param cards All the cards to match during this session
   * @returns A randomized set of pages
   */
  private buildStepPages(cards: Card[]): Card[][] {
    const toSplit = shuffleArray(cards);
    const pages: Card[][] = [];
    while (toSplit.length) {
      pages.push(toSplit.splice(0, 5));
    }

    return pages;
  }

  /**
   * Emit the `completed` event if all cards have been repeated or
   * load two new columns of cards to match.
   */
  private learnNewPage(): void {
    if (this.matchingPages.length) {
      const page: Card[] = this.matchingPages.splice(0, 1)[0];
      this.leftColumnCards = shuffleArray(page.map((card) => ({ card, matched: false })));
      this.rightColumnCards = shuffleArray(
        page.map((card) => ({ card, matched: false }))
      );
    } else {
      this.completed.emit();
    }
  }
}
