import { Component, Input, OnInit } from "@angular/core";
import {
  IconDefinition,
  faCheckCircle,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "chf-result-card",
  templateUrl: "./result-card.component.html",
  styleUrls: ["./result-card.component.scss"],
})
export class ResultCardComponent implements OnInit {
  @Input({ required: true }) content!: TypedContent;
  @Input() expected?: TypedContent;
  @Input({ required: true }) result!: "failed" | "passed" | "solution";

  public resultIcon: IconDefinition = faCheckCircle;

  ngOnInit(): void {
    if (this.result === "failed") {
      this.resultIcon = faXmarkCircle;
    }
  }
}

interface TypedContent {
  characters?: string;
  pinyin?: string;
}
