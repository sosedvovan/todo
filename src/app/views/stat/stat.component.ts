import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.css']
})

// "presentational component": отображает полученные данные и отправляет какие-либо
// действия обработчику
// назначение - показать статистику
export class StatComponent {
  // ----------------------- входящие параметры от смарт: app.component.ts----

  @Input()
  totalTasksInCategory: number; // общее кол-во задач в категории

  @Input()
  completeTasksInCategory: number; // кол-во решенных задач в категории

  @Input()
  uncompleteTasksInCategory: number; // кол-во нерешенных задач в категории

  @Input()
  showStat: boolean; // показать или скрыть статистику


  // -------------------------------------------------------------------------

}
