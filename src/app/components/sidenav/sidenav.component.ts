import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

const importedModules = [
  CommonModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  RouterModule,
];

@Component({
  selector: 'chf-sidenav',
  standalone: true,
  imports: importedModules,
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  @Output() darkMode = new EventEmitter<boolean>();

  public isDarkMode = true;

  toggleMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.darkMode.emit(this.isDarkMode);
  }
}
