import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-about-dialog',
  templateUrl: './about-dialog.component.html',
  styleUrls: ['./about-dialog.component.css']
})
export class AboutDialogComponent {
  public dialogTitle: string;
  public message: string;

  constructor(
    private dialogRef: MatDialogRef<AboutDialogComponent>, // для работы с текущим диалог. окном
    @Inject(MAT_DIALOG_DATA) private data: { dialogTitle: string, message: string } // данные, которые передали в диалоговое окно
  ) {
    // текст для диалогового окна
    this.dialogTitle = data.dialogTitle; // заголовок
    this.message = data.message; // сообщение
  }


  ngOnInit() {
  }


  // нажали ОК
  public onConfirm(): void {
    this.dialogRef.close(true);
  }

}
