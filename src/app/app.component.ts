import {Component} from '@angular/core';
import {Category} from "./model/Category";
import {DataHandlerService} from "./service/data-handler.service";
import {Task} from "./model/Task";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Parent - родитель - в нашем случае это этот класс - AppComponent
 * Child - дочерний - в нашем случае TasksComponent
 *
 * Этот класс - AppComponent (parent) :
 * 1.Подписывается на все необходимые данные (subscribe) из DAO
 * 2. “Раздает” данные всем дочерним элементам
 * (в своем html: имеет :<app-categories [categories]="categories"></app-categories>
 *                 и     <app-tasks [tasks]="tasks"></app-tasks>
 * где в [...] - создается переменная, которую увидит дочерний html,
 *   а в "..." - переменной в [...] присваивается значение поля из этого родительского класса)
 * 3. Собирает итоговую страницу из компонентов как “конструктор”
 *
 * А дочерний(ие) класс - TasksComponent (child)
 * 1. Ждет входящие данные через @Input
 * (как только данные изменятся, @Input это увидит и обновит переменную)
 * 2. Отображает данные в своем view
 */

//это класс родительского  компонента
export class AppComponent {
  title = 'todo';

//в классе родительского компонента заводим 2-е переменные
//которые хотим "видеть" в дочерних html
  tasks: Task[];
  categories: Category[];


//в конструкторе инджектим наш инджектабельный сервис
// фасад для работы с данными
  constructor(
    private dataHandler: DataHandlerService) {
  }

//инициализируем и подписываем(subscribe) наши 2-е переменные этого класса
// на объекты Observable<Task[]> и Observable<Category[]>
// с помощью методов нашего сервиса getAllTasks() и getAllCategories()
// которые эти объекты и возвращают
  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

}
