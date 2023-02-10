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

  //в классе родительского компонента заводим 2-е переменные
  //которые хотим "видеть" в дочерних html
  tasks: Task[];
  categories: Category[];

  //завели эту переменную - она придет из @Output() из дочки
  selectedCategory: Category;

  //в конструкторе инджектим наш инджектабельный сервис, чтобы получать данные
  // фасад для работы с данными
  constructor(
    private dataHandler: DataHandlerService) {
  }

  //инициализируем и подписываем(subscribe) наши 2-е переменные этого класса
  // на объекты Observable<Task[]> и Observable<Category[]>
  // с помощью методов нашего сервиса getAllTasks() и getAllCategories()
  // которые эти объекты и возвращают
  //то переменные tasks и categories будут содержать в себе актуальные данные
  //при создании объекта этого класса
  //(данные в этих переменных будут изменяться при переподписке - subscribe() из других методах )
  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }


  // изменение категории
  //метод запускается из html этого класса : (selectCategory)="onSelectCategory($event)
  //в параметры из @Output приходит категория(по которой клацнули) и далее..
  public onSelectCategory(category: Category) {

    //инициализируем спец. поле этого класса этой пришедшей категорией
    this.selectedCategory = category;

    //получаем из дао массив с тасками, относящимися только к этой категории
    //и переподписываем поле этого класса на этот массив с отфильтрованными тасками
    //то на странице будут отображаться таски, только с этой категорией
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
  //в параметры из @Output приходит новая таска(которую изменили в диалоговом окне,
  //и которую надо сохранить в дб) и далее..
  public onUpdateTask(task: Task) {
    //используем метод updateTask() передав ему новую таску
    //чтобы ее сохранить и из возврата метода получить Observable<Task>
    this.dataHandler.updateTask(task)//вернет Observable<Task>
      //на полученной Observable<Task> вызовем subscribe()
      //и этом subscribe() переделаем издателя из Observable<Task> на издателя Observable<Task[]>
      .subscribe(() => {
        //и тут же обновляем список задач (получаем новый обновленный массив)
        this.dataHandler.searchTasks(
          this.selectedCategory//по любому иже инициирована клацнутой до таски категорией
          // ,
          // null,
          // null,
          // null
          //и далее метод subscribe() переподпишет поле этого класса tasks на Observable<Task[]>
        ).subscribe(tasks => {
          this.tasks = tasks;
        });
      });
    //то метод subscribe(), вызванный на объекте Observable<...> может как и
    //вернуть другой объект Observable<,,,>, так и
    //подписать на Observable<,,,> поле класса.
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
 *    и заводим 2-е переменные которые хотим "видеть" в дочерних html: tasks и categories
 * 2. Подписываем эти 2-е переменные на все необходимые данные (subscribe) В ngOnInit()
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
 *    (Ангуляр сам автоматом выполнит присвоение с помощью @Input()).
 *    Те связываем родителя и дочку чз родительский html.
 *    ----------------------------------------------------
 *    @Input() можно ставить и над сеттером, для вызовов других методов:
 *
 *        tasks: Task[]; //объявили переменную
 *
 *        //сделали сеттер для этой переменной
 *        @Input('tasks')  //в ('...') имя переменной для которой этот сеттер
 *        public set setTasks(tasks: Task[]) { //то же имя tasks: в параметрах сеттера
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
 *  Допустим мы в html дочки хотим нажать мышкой в браузере по одной из категорий
 *  и в результате такого нажатия мы хотим получить какой то результат:
 *  1. В html дочки, в нужном теге <li> прописываем директиву -
 *     событие по клику мышки : (click)="showTaskByCategory(category)"
 *     Теперь при нажатии мышкой на контент тега <li> в классе дочки вызовется
 *     метод showTaskByCategory(category) и в аргументах передастся текущая в
 *     итерации категория.
 *  2. Вот этот метод который вызовется и в котором мы вызовем @Output() обработчик:
 *           showTaskByCategory(category: Category){
 *           if (this.selectedCategory === category) {
 *            return;
 *           }
 *           // сохраняем выбранную категорию
 *           this.selectedCategory = category;
 *           // вызываем внешний обработчик(объект помеченный @Output()) и передаем туда выбранную категорию
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
 *          //метод принимает категорию и переподпишет родительское поле tasks
 *          //на новый отфильтрованный по категории массив тасков ->
 *          //-> в результате в браузере мы увидем таблицу с тасками только выбранной категории
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
 *
 *  One-way data binding (read-only):
 *    1) Interpolation{{  }}- считать свойство(поле класса) и отобразить в HTML: <p>{{task.title}}</p>
 *    2) Property Binding [ ] - считать свойство(поле класса) в атрибут: [ngClass]="{'active': category !== selectedCategory}"
 *    3) Event Binding ( ) - обработка действия пользователя (метод): (clic)->method()
 *
 *  Two-way binding:
 *    4) [()] - (считывает и записывает если изменение - банан в коробке):
 *    [(ngModel)]="tmpTitle" - сначала считает св-во(tmpTitle) в атрибут ngModel
 *    потом если атрибут ngModel изменится пользователем,
 *    тогда запишет атрибут ngModel в то же свойство tmpTitle
 *    ----------------------------------------------------
 *    те совмещает 2) и 3), сокращает запись - Двустороннее связывание
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
 *  Диалоговые окна:
 *      - это готовое решения для работы с диалоговыми
 *      окнами из Angular Material. Гибкие настройки, передача данных,
 *      изменение внешнего вида
 *  1. В папке dialog создали новый компонент: EditTaskDialog (new->AngularShematics->component)
 *  2. В файле app.module.ts:
 *        ● Импорт MatDialogModule
 *        ● Добавить в entryComponents компоненту EditTaskDialogComponent
 *          (сказали Ангуляру, что это динамический компонент- создается по необходимости)
 *          (все нужные зависимости смотри в app.module.ts)
 *  3. Мы с этим диалоговым окном EditTaskDialog будем работать из tasks.component.html
 *     В родительском tasks.component.html :
 *      -В классе в конструкторе заинджектим private dialog: MatDialog
 *      -В html в колонку таблицы "Название" мы добавляем событие по клику мышкой:
 *       (click)="openEditTaskDialog(task) - при клике на названии таски вызовется метод
 *       openEditTaskDialog() и в параметрах передастся текущая таска
 *
 *     В родительском tasks.component.ts : метод : openEditTaskDialog(task) :
 *            public openEditTaskDialog(task: Task): void {
 *
 *               // открытие диалогового окна в которое будет помещен наш компонент EditTaskDialog
 *               //метод open() открывает наш компонент EditTaskDialog в диалоговом окне
 *               //и передает в объекте{MatDialogConfig} в массиве[task, 'Редактирование задачи']
 *               //в него(в EditTaskDialog) параметры - data
 *               //(кроме data в MatDialogConfig есть много других параметров - ширина...)
 *               //с const dialogRef далее будем работать в компоненте диалогового окна : edit-task-dialog.component.ts
 *               const dialogRef = this.dialog.open(EditTaskDialogComponent, {data: [task, 'Редактирование задачи'], autoFocus: false});
 *
 *               //далее подписываемся на событие закрытия диалогового окна: afterClosed().subscribe()
 *               //и в анонимном методе выполняем все что нам нужно
 *               //в result будет то, что мы вернем из диалогового окна как результат
 *               //действий пользователя в диалоговом окне
 *               dialogRef.afterClosed().subscribe(result => {
 *                     // здесь будет обработка результатов после закрытия диалогового окна
 *                });
 *               }
 *  4. В компоненте нашего диалогового окна edit-task-dialog.component.ts :
 *       см в edit-task-dialog.component.ts - автоматом запускается это диалоговое окно -
 *       а в его ngOnInit() все что надо инициализируется
 *       и то, что будет отображаться в открывшемся диалоговом окне
 *       см в edit-task-dialog.component.html
 *
 *       --пользователь в диалоговом окне редактирует данные
 *       --и нажимает СОХРАНИТЬ ->
 *       -> в edit-task-dialog.component.html сработает (click)="onConfirm()"
 *       -в котором закроется диалоговое окно: this.dialogRef.close(this.task);
 *       -и в родительский метод openEditTaskDialog()-(который открыл это диалоговое окно) отправится
 *       -в ответ новая измененная task.
 *       Там эта task обработается в dialogRef.afterClosed()...(сохранится в дб и обновления перепокажутся в браузере)
 */

/**
 *   В диалоговое окно добавляем выпадающий список выбора категорий
 *     1. В app.module.ts добавили:
 *         MatOptionModule,
 *         MatSelectModule
 *     2. В глобальные стили добавили .mat-mdc-form-field и .mat-mdc-dialog-content
 *     они подправят настройки размеров диалогового окна(в html эти теги формируются
 *     автоматически при рендере страницы)
 *     3. В data-handler.service.ts -> сделали метод получения всех категорий
 *         getAllCategories(): Observable<Category[]> {
 *         return this.categoryDaoArray.getAll();
 *     }
 *     4. А в CategoryDAOArray.ts :
 *        getAll(): Observable<Category[]> {
 *         return of(TestData.categories);
 *     }
 *     5.  -В edit-task-dialog.component.ts(это класс выпадающего диалогового окна) инджектим:
 *            private dataHandler: DataHandlerService
 *         -создаем переменную-массив по которому будем итерироваться в html для выпадающего списка:
 *            private categories: Category[];
 *         -в ngOnInit() получаем для этой переменной значение:
 *            this.dataHandler.getAllCategories().subscribe(items => this.categories = items);
 *         -создаем временную переменную для [(ngModel)]
 *         (через нее получим категорию, кот выбрал пользователь в выпадающем списке):
 *            private tmpCategory: Category;
 *         -и в ngOnInit() даем ей первоначальное значение
 *            this.tmpCategory = this.task.category;
 *         -в методе сохранения - onConfirm() измененную пользователем категорию назначаем полю в task
 *            this.task.category = this.tmpCategory;
 *
 *         -далее сработает механизм сохранения в родительском(-вызывающем диалоговое окно) tasks.component.ts
 *            в методе openEditTaskDialog : действие при закрытии диалогового окна
 *            dialogRef.afterClosed().subscribe(...
 *
 *     6. Далее редактируем edit-task-dialog.component.html (создаем выпадающий список для категорий)
 *            <!--    выпадающий список категорий-->
 *         <mat-form-field>
 *         <mat-label>Укажите категорию</mat-label>
 *
 *         <mat-select [(ngModel)]="tmpCategory">
 *             <mat-option [value]="null">Без категории</mat-option>
 *             <mat-option *ngFor="let cat of categories" [value]="cat">
 *                 {{cat.title}}
 *             </mat-option>
 *         </mat-select>
 *         </mat-form-field>
 *
 *
 *
 */

