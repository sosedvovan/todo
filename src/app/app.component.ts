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

  //завели эту переменную - она придет из @Output() из дочки
  selectedCategory: Category;

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


  // изменение категории
  //метод запускается из html этого класса : (selectCategory)="onSelectCategory($event)
  public onSelectCategory(category: Category) {

    this.selectedCategory = category;

    this.dataHandler.searchTasks(
      this.selectedCategory
      // ,
      // null,
      // null,
      // null
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  // обновление задачи из диалогового окна
//метод запускается из html этого класса : (updateTask)="onUpdateTask($event)
  public onUpdateTask(task: Task) {
    //как только задача обновленна - вернет  Observable<Task>
    this.dataHandler.updateTask(task)
      //на него подписываемся (не передавая подписку "никуда")
      .subscribe(() => {
        //и тут же обновляем список задач (получаем новый обновленный массив)
      this.dataHandler.searchTasks(
        this.selectedCategory
        // ,
        // null,
        // null,
        // null
        //и подписываем this.tasks на подписку "в никуда" (на обновленный массив)
      ).subscribe(tasks => {
        this.tasks = tasks;
      });
    });
  }
}

/**  В файле app.module.ts: Импорт:
 *       ● MatTableModule
 *       ● MatPaginatorModule
 *       ● MatSortModule
 *       ● BrowserAnimationsModule
 *
 * ПРИНЦИП РАБОТЫ @Input('...') (идем от родителя к дочке):
 * 1. Допустим, мы хотим в 2-а дочерние html передать 2-а массива: tasks и categories :
 *    В РОДИТЕЛЬСКИЙ КОМПОНЕНТ ИНДЖЕКТИМ НУЖНЫЕ РЕАЛИЗАЦИИ РЕПОЗИТОРИЯ
 *    и заводим 2-е переменные которые хотим "видеть" в дочерних html: asks и categories
 * 2. Подписывается на все необходимые данные (subscribe) В ngOnInit()
 * 3. В родительском html создаем связи с дочками :
 *           <app-categories
 *          [categories]="categories"  //данные для @Input
 *          (selectCategory)="onSelectCategory($event)">  //данные для @Output
 *          </app-categories>
 *          -----------------
 *           <app-tasks
 *           [tasks]="tasks"   //данные для @Input
 *           (updateTask)="onUpdateTask($event)">   //данные для @Output
 *           </app-tasks>
 *    здесь данные для @Input, например - дают переменной [categories](переменная для класса дочки)
 *    значение ="categories"(переменная этого класса)
 *    и для tasks - соответственно тот же принцип
 * 4. Далее в  классах дочек с помощью директивы @Input() принимаем
 *    массивы categories и tasks из родительского html :
 *         @Input()
 *         categories: Category[] | undefined;
 *    (Ангуляр сам автоматом выполнит присвоение с помощью @Input())
 *    ----------------------------------------------------
 *    @Input() можно ставить и над сеттером, для вызовов других методов:
 *
 *        tasks: Task[]; //объявили переменную
 *
 *        //сделали сеттер для этой переменной
 *        @Input('tasks')  //в ('...') имя переменной для которой этот сеттер
 *        public set setTasks(tasks: Task[]) {
 *        this.tasks = tasks; //инициализируем переменную
 *        this.fillTable();   //вызываем другой метод
 *        }
 *  5. И ИТОГ:  используем этот массив в дочернем html :
 *         *ngFor="let category of categories"
 *         -----------------------------------
 *         *ngFor="let task of tasks"
 */

/**
 *
 *  ПРИНЦИП РАБОТЫ @Output() :
 *  (идем от дочки к родителю):
 *  Допустим мы в html точки хотим нажать мышкой в браузере по одной из категорий
 *  и в результате такого нажатия мы хотим получить какой то результат:
 *  1. В html дочки, в нужном теге <li> прописываем дериктиву -
 *     событие по клику мышки : (click)="showTaskByCategory(category)"
 *     Теперь при нажатии мышкой на контент тега <li> в классе дочки вызовется
 *     метод showTaskByCategory(category) и в аргументах передастся текущая в
 *     итерации категория.
 *  2. Вот этот метод который вызовется и в котором мы вызовем @Output() обработчик:
 *           showTaskByCategory(category: Category){
 *           if (this.selectedCategory === category) {
 *            return;
 *           }
 *           this.selectedCategory = category; // сохраняем выбранную категорию
 *           // вызываем внешний обработчик и передаем туда выбранную категорию
 *           this.selectCategory.emit(this.selectedCategory); //emit() запускает @Output()
 *           }
 *      А вот и сам @Output() обработчик - это поле класса дочки :
 *          @Output()
 *          selectCategory = new EventEmitter<Category>();
 *      Таким образом при вызове метода emit() - автоматически
 *      запустится EventEmitter<Category>, которая в родительском html
 *      обнаружит данные для @Output :
 *          <app-categories
 *          [categories]="categories"  //данные для @Input
 *          (selectCategory)="onSelectCategory($event)">  //данные для @Output
 *          </app-categories>
 *      где : (selectCategory)= - это то, что мы аннотировали @Output() в дочке,
 *      а "onSelectCategory($event)" это метод в классе родителя, который
 *      автоматически вызовется,
 *      причем в его аргументы попадет то, что было в методе emit(this.selectedCategory)
 *
 *      Вот метод, который автоматом вызовется в родителе :
 *         public onSelectCategory(category: Category) {
 *           this.selectedCategory = category;
 *           this.dataHandler.searchTasks(
 *           this.selectedCategory
 *           // ,
 *           // null,
 *           // null,
 *           // null
 *           ).subscribe(tasks => {
 *           this.tasks = tasks;
 *           });
 *           }
 *       В этом методе мы из репозитория получаем массив с данными,
 *       отфильтрованными нужным нам образом, и сразу переподписываем
 *       на эти данные поле родительского класса : tasks
 *       (а @Input в дочке сразу автоматом переподхватит эти данные,
 *       передаст в свой html и страница обновится с новыми данными -
 *       этого мы и хотели - получить такое действие)
 */

/**
 *  Теория
 *  One-way data binding (read-only):
 *    1) Interpolation{{  }}- считать свойство и отобразить в HTML
 *    2) Property Binding [ ] - считать свойство в атрибут
 *    3) Event Binding ( ) - обработка действия пользователя (метод)
 *  Two-way binding:
 *    4) [()] - (считывает и записывает если изменение - банан в коробке)
 *    совмещает 2 и 3, сокращает запись - Двустороннее связывание
 *    Считывает и при изменении в HTML (пользователь ввел данные) -
 *    записывает значение,
 *    используется везде, где пользователь изменяет значения,
 *    в формах, input - компонентах.
 *
 *    Директива [(ngModel)] - Используется в тегах, где можно изменить/выбрать
 *    данные (текстовое поле, списки и пр.). Считывает значение в элемент и
 *    при изменении - записывает в переменную
 */



/**
 *      Диалоговые окна- готовое решения для работы с диалоговыми
 *      окнами из Angular Material. Гибкие настройки, передача данных,
 *      изменение внешнего вида
 *  1. В папке dialog создали новый компонент: EditTaskDialog
 *  2. В файле app.module.ts:
 *        ● Импорт MatDialogModule
 *        ● Добавить в entryComponents компоненту EditTaskDialogComponent
 *          (сказали Ангуляру, что это динамический компонент- создается по необходимости)
 *          (все нужные зависимости смотри в app.module.ts)
 *  3. Мы с этим диалоговым окном EditTaskDialog будем работать из tasks.component.html
 *     В tasks.component.html :
 *      -В классе в конструкторе заинджектим private dialog: MatDialog
 *      -В html в колонку таблицы "Название" мы добавляем событие по клику мышкой:
 *       (click)="openEditTaskDialog(task) - при клике на названии таски вызовется метод
 *       openEditTaskDialog() и в параметрах передастся текущая таска
 *
 *     В tasks.component.ts : метод : openEditTaskDialog(task) :
 *            public openEditTaskDialog(task: Task): void {
 *
 *               // открытие диалогового окна в которое будет помещен наш компонент EditTaskDialog
 *               //метод open() открывает наш компонент EditTaskDialog в диалоговом окне
 *               //и передает в объекте{MatDialogConfig} в массиве[task, 'Редактирование задачи']
 *               //в него(в EditTaskDialog) параметры - data
 *               //(кроме data в MatDialogConfig есть много других параметров - ширина...)
 *               //с const dialogRef будем работать в компоненте диалогового окна : edit-task-dialog.component.ts
 *               const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Редактирование задачи'], autoFocus: false});
 *
 *               //далее подписываемся на событие закрытия диалогового окна: afterClosed().subscribe()
 *               //и в анонимном методе выполняем все что нам нужно
 *               //в result будет то, что мы вернем из диалогового окна
 *               dialogRef.afterClosed().subscribe(result => {
 *                     // здесь будет обработка результатов после закрытия диалогового окна
 *                });
 *               }
 *  4. В компоненте нашего диалогового окна edit-task-dialog.component.ts :
 *       см в edit-task-dialog.component.ts
 *       и то, что будет отображаться в открывшемся диалоговом окне
 *       см в edit-task-dialog.component.html
 *
 *
 *
 */

