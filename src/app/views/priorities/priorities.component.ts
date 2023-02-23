import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialog} from "@angular/material/dialog";
import {OperType} from "../../dialog/OperType";
import {ConfirmDialogComponent} from "../../dialog/confirm-dialog/confirm-dialog.component";
import {EditCategoryDialogComponent} from "../../dialog/edit-category-dialog/edit-category-dialog.component";
import {EditPriorityDialogComponent} from "../../dialog/edit-priority-dialog/edit-priority-dialog.component";

@Component({
  selector: 'app-priorities',
  templateUrl: './priorities.component.html',
  styleUrls: ['./priorities.component.css']
})
export class PrioritiesComponent implements OnInit {

  static defaultColor = '#fff';

  // ----------------------- входящие параметры ----------------------------


  @Input()
  public priorities: Priority[];


  // ----------------------- исходящие действия----------------------------

  // удалили
  @Output()
  deletePriority = new EventEmitter<Priority>();

  // изменили
  @Output()
  updatePriority = new EventEmitter<Priority>();

  // добавили
  @Output()
  addPriority = new EventEmitter<Priority>();

  // -------------------------------------------------------------------------


  constructor( private dialog: MatDialog // для открытия нового диалогового окна (из текущего))
  ) {
  }


  ngOnInit() {
  }

  //удаляем приоритет
  delete(priority: Priority): void {

    //открываем универсальное диалоговое окно подтверждения удаления
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '500px',
      data: {
        dialogTitle: 'Подтвердите действие',
        message: `Вы действительно хотите удалить категорию: "${priority.title}"? (задачам проставится значение 'Без приоритета')`
      },
      autoFocus: false
    });

    //если подтвердили удаление (нажали ок) обрабатываем:
    //посылаем:  @Output() deletePriority
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePriority.emit(priority);
      }
    });
  }

  //добавляем новый приоритет:
  public onAddPriority(): void {

    //открываем уже имеющиеся диалоговое окно EditCategoryDialogComponent
    //и отправляем в него енум OperType.ADD
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      // '' передаем вместо priority.title тк это новый элемент
      data: ['', 'Добавление приоритета', OperType.ADD],
      width: '500px'
    });

    //после закрытия окна обрабатываем добавление нового приоритета
    //отправляя new Priority в  @Output() addPriority
    //и статическую переменную с дефолтным белым цветом
    dialogRef.afterClosed().subscribe(result => {
      //если пришел новый объект:
      if (result) {
        const newPriority = new Priority(null, result as string, PrioritiesComponent.defaultColor);
        this.addPriority.emit(newPriority);
      }
    });


  }


  //редактируем уже имеющийся приоритет
  public onEditPriority(priority: Priority): void {

    //открываем диалоговое окно EditPriorityDialogComponent
    //которое сейчас создадим (незабываем его прописать в app.module.ts в entryComponents: [...])
    const dialogRef = this.dialog.open(EditPriorityDialogComponent, {data: [priority.title, 'Редактирование приоритета', OperType.EDIT]});

    //обрабатываем результат редактирования приоритета
    dialogRef.afterClosed().subscribe(result => {

      //если в диалоговом окне нажали удалить
      if (result === 'delete') {
        this.deletePriority.emit(priority);
        return;
      }

      //если в диалоговом окне изменили title приоритета
      //и нажали "ок" тогда сюда придет новое значение
      if (result) {
        priority.title = result as string;
        this.updatePriority.emit(priority);
        return;
      }
    });


  }



}
