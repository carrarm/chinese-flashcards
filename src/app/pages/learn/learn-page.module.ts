import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterModule } from "@angular/router";
import { CardMeaningsPipe } from "@core/pipes/card-meanings.pipe";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgCircleProgressModule } from "ng-circle-progress";
import { ButtonComponent } from "src/app/components/button/button.component";
import { CardComponent } from "src/app/components/card/card.component";
import { PinyinFormFieldComponent } from "src/app/components/pinyin-form-field/pinyin-form-field.component";
import { CardDifficultyComponent } from "../shared/components/card-difficulty/card-difficulty.component";
import { CardProgressIndicatorComponent } from "../shared/components/card-progress-indicator/card-progress-indicator.component";
import { SessionLauncherComponent } from "./session-launcher/session-launcher.component";
import { SessionFillingStepComponent } from "./session/session-filling-step/session-filling-step.component";
import { SessionMatchingStepComponent } from "./session/session-matching-step/session-matching-step.component";
import { SessionComponent } from "./session/session.component";

@NgModule({
  declarations: [
    SessionLauncherComponent,
    SessionComponent,
    SessionMatchingStepComponent,
    SessionFillingStepComponent,
  ],
  imports: [
    ButtonComponent,
    CardComponent,
    CardDifficultyComponent,
    CardMeaningsPipe,
    CardProgressIndicatorComponent,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    NgCircleProgressModule,
    PinyinFormFieldComponent,
    RouterModule,
  ],
})
export class LearnPageModule {}
