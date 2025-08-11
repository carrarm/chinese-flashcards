import { Component, Input, OnInit } from "@angular/core";
import { IconName } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "chf-result-card",
  templateUrl: "./result-card.component.html",
  styleUrls: ["./result-card.component.scss"],
  standalone: false,
})
export class ResultCardComponent implements OnInit {
  @Input({ required: true }) content!: TypedContent;
  @Input() expected?: TypedContent;
  @Input({ required: true }) result!: "failed" | "passed" | "solution";

  public diff?: { characters: DiffCharacter[]; pinyin: DiffCharacter[] };
  public resultIcon: IconName = "check-circle";

  ngOnInit(): void {
    if (this.result === "failed") {
      this.resultIcon = "xmark-circle";
      if (this.expected) {
        this.diff = {
          characters: this.computeDiff(this.expected.characters, this.content.characters),
          pinyin: this.computeDiff(this.expected.pinyin, this.content.pinyin),
        };
      }
    }
  }

  /**
   * Computes the diff char by char between the expected and typed characters
   * with `typed` as the reference for the diff result.
   *
   * @param expected Expected characters
   * @param typed Characters to compare
   * @returns The `success` or `error` status for each `typed`'s character
   */
  private computeDiff(expected?: string, typed?: string): DiffCharacter[] {
    const diff: DiffCharacter[] = [];
    if (expected && typed) {
      typed.split("").forEach((char, index) => {
        if (index < expected.length) {
          diff.push({
            char,
            type: char === expected.charAt(index) ? "success" : "error",
          });
        } else {
          diff.push({ char, type: "error" });
        }
      });
    }
    return diff;
  }
}

interface DiffCharacter {
  char: string;
  type: "success" | "error";
}

interface TypedContent {
  characters?: string;
  pinyin?: string;
}
