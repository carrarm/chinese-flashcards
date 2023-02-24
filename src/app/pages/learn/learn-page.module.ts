import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionLauncherComponent } from './session-launcher/session-launcher.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [SessionLauncherComponent, SessionComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    RouterModule,
  ],
})
export class LearnPageModule {}
