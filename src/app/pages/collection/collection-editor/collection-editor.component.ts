import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CardCollection, CardCollectionModel } from "@core/model/card-collection.model";
import { CollectionService } from "@core/services/collection.service";
import { toOptional } from "@core/utils/form.utils";

interface CollectionForm {
  label: FormControl<string | null>;
  description: FormControl<string | null>;
}

@Component({
  selector: "chf-collection-editor",
  templateUrl: "./collection-editor.component.html",
  styleUrls: ["./collection-editor.component.scss"],
  standalone: false,
})
export class CollectionEditorComponent implements OnInit {
  private readonly data: { collection?: CardCollection } = inject(MAT_DIALOG_DATA);
  private readonly collectionService = inject(CollectionService);
  private readonly router = inject(Router);
  private readonly dialogRef = inject(MatDialogRef<CollectionEditorComponent>);

  protected readonly form = new FormGroup<CollectionForm>({
    label: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
  });

  protected isDeleteConfirm = false;
  protected collectionId?: number;
  protected texts = {
    title: "New collection",
    save: "Create",
  };

  public ngOnInit(): void {
    if (this.data.collection) {
      this.collectionId = this.data.collection.id;
      this.texts = { title: "Edit collection", save: "Update" };
      this.form.patchValue(this.data.collection);
    }
  }

  protected async saveCollection(): Promise<void> {
    const { label, description } = this.form.value;
    if (label) {
      const collection: CardCollectionModel = {
        label,
        description: toOptional(description),
      };
      if (this.collectionId) {
        collection.id = this.collectionId;
        await this.collectionService.updateCollection(collection);
      } else {
        await this.collectionService.createCollection(collection);
      }
      this.dialogRef.close();
    } else {
      this.form.markAllAsTouched();
    }
  }

  protected async deleteCollection(): Promise<void> {
    if (this.collectionId) {
      await this.collectionService.deleteCollection(this.collectionId);
    }
    this.dialogRef.close();
    this.router.navigateByUrl("/collections");
  }
}
