import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  titulo: string;
  mensaje: string;
}

@Component({
  selector: 'app-confirmar-dialogo',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmar-dialogo.component.html',
  styleUrl: './confirmar-dialogo.component.css'
})
export class ConfirmarDialogoComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
