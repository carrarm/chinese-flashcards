import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CardCollection, CardCollectionModel } from "@core/model/card-collection.model";
import { CollectionService } from "@core/services/collection.service";
import { toOptional } from "@core/utils/form.utils";
import { faCheck, faClose, faTrash } from "@fortawesome/free-solid-svg-icons";

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
export class CollectionEditorComponent {
  public form = new FormGroup<CollectionForm>({
    label: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
  });

  public isDeleteConfirm = false;
  public collectionId?: number;
  public icons = {
    cancel: faClose,
    save: faCheck,
    delete: faTrash,
  };
  public texts = {
    title: "New collection",
    save: "Create",
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { collection?: CardCollection },
    private collectionService: CollectionService,
    private router: Router,
    public dialogRef: MatDialogRef<CollectionEditorComponent>
  ) {
    if (data.collection) {
      this.collectionId = data.collection.id;
      this.texts = { title: "Edit collection", save: "Update" };
      this.form.patchValue(data.collection);
    }
  }

  async saveCollection(): Promise<void> {
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

  async deleteCollection(): Promise<void> {
    if (this.collectionId) {
      await this.collectionService.deleteCollection(this.collectionId);
    }
    this.dialogRef.close();
    this.router.navigateByUrl("/collections");
  }
}
