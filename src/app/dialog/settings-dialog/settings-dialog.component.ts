import {Component, OnInit} from '@angular/core';
import {Priority} from "../../model/Priority";
import {MatDialogRef} from "@angular/material/dialog";
import {DataHandlerService} from "../../service/data-handler.service";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.css']
})

//СМАРТ для priorities.component.ts(те принимает от него @Output())
// диалоговое окно настроек приложения
// т.к. настройки не привязаны к другим компонентам (окнам),
// то он самостоятельно может загружать нужные данные с помощью
// dataHandler (а не получать их с помощью @Input)
export class SettingsDialogComponent implements OnInit {

  public priorities: Priority[];

  constructor(
    private dialogRef: MatDialogRef<SettingsDialogComponent>, // для возможности работы с текущим диалог. окном
    private dataHandler: DataHandlerService // ссылка на сервис для работы с данными
  ) {
  }

  ngOnInit() {
    // получаем все значения, чтобы отобразить настроку цветов
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  // нажали Закрыть
  public onClose() {

    this.dialogRef.close(false);

  }


  // т.к. мы меняем значения в массивах, то изменения сразу отражаются на списке задач (не требуется доп. обновления)

  // добавили приоритет
  public onAddPriority(priority: Priority): void {
    this.dataHandler.addPriority(priority).subscribe();
  }

  // удалили приоритет
  public onDeletePriority(priority: Priority): void {
    this.dataHandler.deletePriority(priority.id).subscribe();
  }

  // обновили приоритет
  public onUpdatePriority(priority: Priority): void {
    this.dataHandler.updatePriority(priority).subscribe();
  }
}
