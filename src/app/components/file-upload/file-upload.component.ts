import { Component, input, output } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { get } from "lodash-es";

import { ButtonComponent } from "@components/button/button.component";

@Component({
  selector: "chf-file-upload",
  imports: [ButtonComponent, FaIconComponent],
  templateUrl: "./file-upload.component.html",
  styleUrl: "./file-upload.component.scss",
})
export class FileUploadComponent {
  public readonly accept = input("*");
  public readonly file = output<File | undefined>();

  protected fileName = "";

  protected fileSelected(event: Event): void {
    const files = get(event, "target.files") as unknown as FileList;
    const selectedFile = files.length ? (files.item(0) as File) : undefined;
    this.fileName = selectedFile?.name ?? "";
    this.file.emit(selectedFile);
  }
}
