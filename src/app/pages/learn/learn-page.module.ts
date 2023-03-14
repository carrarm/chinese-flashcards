import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SessionLauncherComponent } from "./session-launcher/session-launcher.component";
import { MatCardModule } from "@angular/material/card";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { SessionComponent } from "./session/session.component";
import { SessionMatchingStepComponent } from "./session/session-matching-step/session-matching-step.component";
import { CardMeaningsPipe } from "src/app/core/pipes/card-meanings.pipe";
import { SessionFillingStepComponent } from "./session/session-filling-step/session-filling-step.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { PinyinFormFieldComponent } from "src/app/components/pinyin-form-field/pinyin-form-field.component";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
  declarations: [
    SessionLauncherComponent,
    SessionComponent,
    SessionMatchingStepComponent,
    SessionFillingStepComponent,
  ],
  imports: [
    CardMeaningsPipe,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    PinyinFormFieldComponent,
    RouterModule,
  ],
})
export class LearnPageModule {}
