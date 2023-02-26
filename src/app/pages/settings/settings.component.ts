import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from 'src/app/core/db/database.service';
import { Settings } from 'src/app/core/model/settings.model';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { SettingsService } from 'src/app/core/services/settings.service';
import { environment } from 'src/environments/environment';

interface SettingsForm {
  darkTheme: FormControl<boolean | null>;
  learnPinyin: FormControl<boolean | null>;
  pageSize: FormControl<number | null>;
  wordsPerSession: FormControl<number | null>;
  leitnerBoxes: FormControl<number | null>;
}

@Component({
  selector: 'chf-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  public settings?: Settings;
  public form = new FormGroup<SettingsForm>({
    darkTheme: new FormControl<boolean | null>(false),
    learnPinyin: new FormControl<boolean | null>(true),
    pageSize: new FormControl<number | null>(10),
    wordsPerSession: new FormControl<number | null>(10),
    leitnerBoxes: new FormControl<number | null>(5),
  });
  public pageOptions = [5, 10, 15, 20, 50, 100];
  public wordsOptions = [5, 10, 15];
  public isProductionEnv = environment.production;

  constructor(
    private navigationService: NavigationService,
    private settingsService: SettingsService,
    private databaseService: DatabaseService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.navigationService.setTitle('Settings');
    this.settingsService.getSettings().then((settings) => {
      this.settings = settings;
      this.form.patchValue({
        darkTheme: this.settings.theme === 'dark',
        learnPinyin: this.settings.learnPinyin,
        leitnerBoxes: this.settings.leitnerBoxes,
        pageSize: this.settings.pageSize,
        wordsPerSession: this.settings.wordsPerSession,
      });
    });
    this.form.valueChanges.subscribe(() => {
      if (this.settings) {
        this.settings.theme = this.form.value.darkTheme ? 'dark' : 'light';
        this.settings.learnPinyin = this.form.value.learnPinyin ?? true;
        this.settings.wordsPerSession = this.form.value.wordsPerSession ?? 10;
        this.settings.pageSize = this.form.value.pageSize ?? 10;
        this.settings.leitnerBoxes = this.form.value.leitnerBoxes ?? 5;
        this.settingsService.updateSettings(this.settings);
      }
    });
  }

  deleteDatabase(): void {
    this.databaseService
      .clearDatabase()
      .then(() => this.snackbar.open('Database deleted successfully', 'Close'));
  }
}
