import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  //создаем переменные которые используем(видны) в html
  public dialogTitle: string;
  public message: string;

  constructor(
    //чтобы иметь ссылку на диалоговое окно в котором запускается этот компанент
    private dialogRef: MatDialogRef<ConfirmDialogComponent>, // для работы с текущим диалог. окном
    //здесь принимаем параметры в виде 2-х переменных(
    // принимаем из диалогового окна которое вызвало это диалоговое окно)
    @Inject(MAT_DIALOG_DATA)
    private data: { dialogTitle: string, message: string } // данные, которые передали в диалоговое окно
  ) {
    //а здесь их присваиваем полям класса
    this.dialogTitle = data.dialogTitle; // заголовок
    this.message = data.message; // сообщение
  }

  ngOnInit() {
  }

  // нажали ОК -> закрываем диалоговое окно с параметром true
  public onConfirm(): void {
    this.dialogRef.close(true);
  }

  // нажали отмену -> закрываем диалоговое окно с параметром false
  public onCancel(): void {
    this.dialogRef.close(false);
  }
}
