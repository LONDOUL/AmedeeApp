import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
  <div mat-dialog-content class="mat-typography">
    <p>{{ data.message }}</p>
  </div>
  <div mat-dialog-actions>
    <button mat-button color="primary"[mat-dialog-close]="true">Oui</button>
    <button mat-button color="warn" [mat-dialog-close]="false">Non</button>
  </div>`,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
