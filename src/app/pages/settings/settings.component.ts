import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
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
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent implements OnInit {
  public settings?: Settings;
  public form = new FormGroup<SettingsForm>({
    darkTheme: new FormControl<boolean | null>(false),
    enableReviewMatching: new FormControl<boolean | null>(false),
    pageSize: new FormControl<number | null>(10),
    wordsPerSession: new FormControl<number | null>(10),
    leitnerBoxes: new FormControl<number | null>(5),
    cardSelectionType: new FormControl<CardReviewType | null>("newest"),
    resetCardProgress: new FormControl<boolean | null>(true),
  });
  public pageOptions = [5, 10, 15, 20, 50, 100];
  public wordsOptions = [5, 10, 15];
  public appVersion = environment.version;
  public appLicense = environment.license;
  public showDeveloperOptions = !environment.production;

  constructor(
    private navigationService: NavigationService,
    private settingsService: SettingsService,
    private databaseService: DatabaseService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
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

  deleteDatabase(): void {
    this.databaseService
      .clearDatabase()
      .then(() => this.snackbar.open("Database deleted successfully", "Close"));
  }

  exportToJSON(): void {
    this.databaseService.exportAsFile();
  }
}
