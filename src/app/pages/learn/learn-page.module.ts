import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionLauncherComponent } from './session-launcher/session-launcher.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [SessionLauncherComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
})
export class LearnPageModule {}
