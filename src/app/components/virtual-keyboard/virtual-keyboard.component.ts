import {
  FlexibleConnectedPositionStrategyOrigin,
  OverlayModule,
} from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { Component, output } from "@angular/core";
import { MatRippleModule } from "@angular/material/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { QWERTY } from "./keyboard-layout.model";
import { LongPressDirective } from "./long-press.directive";
import { getTones, hasTones } from "./tones";

const TONE_KEY_WIDTH_PX = 34; // Key width + gap with other keys
const BASE_TONE_OVERLAY_OFFSET_X = -(TONE_KEY_WIDTH_PX * 1.5);
const BASE_TONE_OVERLAY_OFFSET_Y = -TONE_KEY_WIDTH_PX * 2.5;

@Component({
  selector: "chf-virtual-keyboard",
  imports: [
    CommonModule,
    FontAwesomeModule,
    LongPressDirective,
    MatRippleModule,
    OverlayModule,
  ],
  templateUrl: "./virtual-keyboard.component.html",
  styleUrls: ["./virtual-keyboard.component.scss"],
})
export class VirtualKeyboardComponent {
  /** A character has been typed */
  public readonly typed = output<string>();

  /** Backspace key pressed */
  public readonly backspace = output<void>();

  /** Keyboard's "Submit" button pressed */
  public readonly submitText = output<void>();

  protected toneOverlayOffsetY = BASE_TONE_OVERLAY_OFFSET_Y;
  protected toneOverlayOffsetX = BASE_TONE_OVERLAY_OFFSET_X;

  protected layout = QWERTY;
  protected uppercaseEnabled = false;
  protected toneOverlayOpen = false;
  protected toneOverlayOrigin?: FlexibleConnectedPositionStrategyOrigin;
  protected toneKeys: string[] = [];

  /**
   * Select a character to write. This method is used for both the standard keyboard
   * and the tone overlay.
   *
   * @param character Character to emit
   */
  public writeCharacter(character: string, preserverCase = false): void {
    this.typed.emit(this.uppercaseEnabled ? character : character.toLowerCase());
    if (!preserverCase) {
      this.uppercaseEnabled = false;
    }
    this.toneOverlayOpen = false;
  }

  /**
   * Open the tone overlay to select an accentuated letter.
   *
   * @param letter The letter to accentuate
   * @param positionInColumn Index of the letter in the row
   * @param elementRef Reference to the HTML container of the letter
   */
  public openTones(
    letter: string,
    positionInColumn: number,
    elementRef: HTMLElement
  ): void {
    if (hasTones(letter)) {
      this.toneOverlayOffsetX = this.computeOffsetX(positionInColumn);
      this.toneOverlayOpen = true;
      this.toneOverlayOrigin = elementRef;
      const letterCase = this.uppercaseEnabled ? "UPPER" : "LOWER";
      this.toneKeys = getTones(letter, letterCase);
      if (letter === "U") {
        // Add ü variations with u tones to avoid adding another key
        const rootLetter = this.uppercaseEnabled ? "Ü" : "ü";
        this.toneKeys = [...this.toneKeys, ...getTones("ü", letterCase), rootLetter];
      }
    }
  }

  /**
   * Compute the overlay offset based on the position of the key in the row.
   * The two leftmost and the two rightmost keys shouldn't try and display a centered
   * overlay as it would go offscreen.
   *
   * @param positionInColumn Key index in the row
   * @returns Adjusted offset in px
   */
  private computeOffsetX(positionInColumn: number): number {
    let offset = BASE_TONE_OVERLAY_OFFSET_X;
    if (positionInColumn < 2) {
      offset = 0;
    } else if (positionInColumn > 7) {
      offset = -TONE_KEY_WIDTH_PX * 2;
    }
    return offset;
  }
}
