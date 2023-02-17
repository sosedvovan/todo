import {Component, Inject, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {OperType} from "../OperType";

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css']
})

// создание/редактирование категории
export class EditCategoryDialogComponent implements OnInit {

  constructor(
    // для работы с текущим диалог. окном
    private dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    // данные, которые передали в диалоговое окно:
    // (data: [category.title, 'Редактирование категории'])
    @Inject(MAT_DIALOG_DATA)
    private data: [string, string],
    // для открытия нового диалогового окна (из текущего) -
    // например для подтверждения удаления
    private dialog: MatDialog
  ) {
  }

  //переменные будут хранить данные, которые передали в диалоговое окно:
  // (data: [category.title, 'Редактирование категории'])
  public dialogTitle: string; // текст для диалогового окна
  public categoryTitle: string; // текст для названия категории (при редактировании или добавлении)
  public operType: OperType; // тип операции

  ngOnInit() {

    // иницииализируем - получаем переданные в диалоговое окно данные (data: [category.title, 'Редактирование категории'])
    this.categoryTitle = this.data[0];
    this.dialogTitle = this.data[1];
    // @ts-ignore
    this.operType = this.data[2]; // тип операции
  }

  // нажали ОК в edit-category-dialog.component.html
  public onConfirm() {
    //метод close() передает в метод открывший это(в categories.component.ts) окно
    // результат(result)-стрингу с названием текущей категории(и далее идет обновление в дб)
    this.dialogRef.close(this.categoryTitle);
  }

  // нажали отмену (ничего не сохраняем и закрываем окно)
  public onCancel() {
    //метод close() ничего не передает в метод открывший это(в categories.component.ts) окно
    //ничего далее не происходит - диалоговое окно закрывается
    this.dialogRef.close(false);
  }

  // нажали Удалить
  public delete() {

    //открыли другое диалоговое окно для подтверждения удаления,
    //передав туда нужные параметры
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить категорию: "${this.categoryTitle}"? (сами задачи не удаляются)`
      },
      autoFocus: false
    });

    //после подтверждения удаления (нажали ОК - придет result как true) в
    dialogRef.afterClosed().subscribe(result => {
      //если result = true
      if (result) {
        //закроем это диалоговое окно редактирования категории:
        //метод close() передает в метод открывший это(в categories.component.ts) окно
        // результат(result)-стрингу с 'delete'
        this.dialogRef.close('delete'); // нажали удалить
      }
    });
  }

  public canDelete(): boolean {
    return this.operType === OperType.EDIT;
  }
}
