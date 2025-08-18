import { NgClass } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { ButtonComponent } from "@components/button/button.component";
import { SlideToggleComponent } from "@components/slide-toggle/slide-toggle.component";
import { DatabaseService } from "@core/db/database.service";
import { CardReviewType, Settings } from "@core/model/settings.model";
import { NavigationService } from "@core/services/navigation.service";
import { SettingsService } from "@core/services/settings.service";
import { environment } from "src/environments/environment";

// TODO: clean forms (remove unnecessary typings, use non-nullable fields)
interface SettingsForm {
  darkTheme: FormControl<boolean | null>;
  enableReviewMatching: FormControl<boolean | null>;
  pageSize: FormControl<number | null>;
  wordsPerSession: FormControl<number | null>;
  leitnerBoxes: FormControl<number | null>;
  cardSelectionType: FormControl<CardReviewType | null>;
  resetCardProgress: FormControl<boolean | null>;
}

@Component({
  selector: "chf-settings",
  imports: [
    ButtonComponent,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    NgClass,
    MatSnackBarModule,
    ReactiveFormsModule,
    SlideToggleComponent,
  ],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  private readonly navigationService = inject(NavigationService);
  private readonly settingsService = inject(SettingsService);
  private readonly databaseService = inject(DatabaseService);
  private readonly snackbar = inject(MatSnackBar);

  protected readonly form = new FormGroup<SettingsForm>({
    darkTheme: new FormControl<boolean | null>(false),
    enableReviewMatching: new FormControl<boolean | null>(false),
    pageSize: new FormControl<number | null>(10),
    wordsPerSession: new FormControl<number | null>(10),
    leitnerBoxes: new FormControl<number | null>(5),
    cardSelectionType: new FormControl<CardReviewType | null>("newest"),
    resetCardProgress: new FormControl<boolean | null>(true),
  });
  protected readonly pageOptions = [5, 10, 15, 20, 50, 100];
  protected readonly wordsOptions = [5, 10, 15];
  protected readonly appVersion = environment.version;
  protected readonly appLicense = environment.license;
  protected readonly showDeveloperOptions = !environment.production;

  protected settings?: Settings;

  public ngOnInit(): void {
    this.navigationService.setTitle("Settings");
    this.settingsService.getSettings().then((settings) => {
      this.settings = settings;
      this.form.patchValue({
        darkTheme: this.settings.theme === "dark",
        enableReviewMatching: this.settings.enableReviewMatching,
        leitnerBoxes: this.settings.leitnerBoxes,
        pageSize: this.settings.pageSize,
        wordsPerSession: this.settings.wordsPerSession,
        resetCardProgress: this.settings.resetCardProgress,
        cardSelectionType: this.settings.cardSelectionType,
      });
    });
    this.form.valueChanges.subscribe(() => {
      if (this.settings) {
        this.settings.theme = this.form.value.darkTheme ? "dark" : "light";
        this.settings.enableReviewMatching = !!this.form.value.enableReviewMatching;
        this.settings.wordsPerSession = this.form.value.wordsPerSession ?? 10;
        this.settings.pageSize = this.form.value.pageSize ?? 10;
        this.settings.leitnerBoxes = this.form.value.leitnerBoxes ?? 5;
        this.settings.resetCardProgress = this.form.value.resetCardProgress ?? true;
        this.settings.cardSelectionType = this.form.value.cardSelectionType ?? "newest";
        this.settingsService.updateSettings(this.settings);
      }
    });
  }

  protected deleteDatabase(): void {
    this.databaseService
      .clearDatabase()
      .then(() => this.snackbar.open("Database deleted successfully", "Close"));
  }

  protected exportToJSON(): void {
    this.databaseService.exportAsFile();
  }
}
