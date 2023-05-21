import { BooleanInput } from "@angular/cdk/coercion";
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { CoercionComponent } from "@core/coercion-component";

@Component({
  selector: "chf-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent extends CoercionComponent implements OnInit {
  @Input() noHeader: BooleanInput = false;
  @Input() reversedCorners: BooleanInput = false;

  ngOnInit(): void {
    this.coerceAll(["noHeader", "reversedCorners"]);
  }
}
