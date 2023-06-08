import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ButtonComponent } from "src/app/components/button/button.component";
import { SlideToggleComponent } from "src/app/components/slide-toggle/slide-toggle.component";
import { SettingsComponent } from "./settings.component";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    ButtonComponent,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    SlideToggleComponent,
  ],
})
export class SettingsModule {}
