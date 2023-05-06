import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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
})
export class CollectionEditorComponent {
  public form = new FormGroup<CollectionForm>({
    label: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
  });

  public collectionId?: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { collection?: CardCollection },
    private collectionService: CollectionService,
    public dialogRef: MatDialogRef<CollectionEditorComponent>
  ) {
    if (data.collection) {
      this.collectionId = data.collection.id;
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
    }
    this.dialogRef.close();
  }

  async deleteCollection(): Promise<void> {
    if (this.collectionId) {
      await this.collectionService.deleteCollection(this.collectionId);
    }
    this.dialogRef.close();
  }
}
