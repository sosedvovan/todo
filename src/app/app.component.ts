import {Component} from '@angular/core';
import {Category} from "./model/Category";
import {DataHandlerService} from "./service/data-handler.service";
import {Task} from "./model/Task";
import {Priority} from "./model/Priority";
import {zip} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
/**
 * Parent smart - родитель - в нашем случае это этот класс - AppComponent
 * Child dump - дочерний - в нашем случае TasksComponent
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

  //в классе родительского компонента заводим 3-и переменные
  //которые хотим "видеть" в дочерних html
  //по факту это массивы со всеми нашими имеющимися Entity
  //передаем их в дочки чз html, а в дочке принимаем с помощью @Impute()
  tasks: Task[]; // все задачи
  categories: Category[]; // все категории
  priorities: Priority[]; // все приоритеты

  //в конструкторе инджектим наш инджектабельный сервис, чтобы получать данные
  // фасад для работы с данными
  constructor(
    private dataHandler: DataHandlerService) {
  }

  //инициализируем и подписываем(subscribe) наши 3-е переменные[] этого класса
  // на объекты Observable<Task[]> и Observable<Category[]> и Observable<Priorities[]>
  // с помощью методов нашего сервиса getAllTasks() и getAllCategories()
  // которые эти объекты и возвращают
  //то переменные tasks и categories будут содержать в себе актуальные данные
  //при создании объекта этого класса
  //(данные в этих переменных будут изменяться при переподписке - subscribe() из других методах )
  ngOnInit(): void {
    this.dataHandler.getAllTasks().subscribe(tasks => this.tasks = tasks);
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
    this.dataHandler.getAllPriorities().subscribe(priorities => this.priorities = priorities);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // В списке категорий клацнули по одной из категорий ->                                                   //
  // -> массив с тасками tasks надо отфильтровать по этой категории и переподписать на результат фильтрации //
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //завели эту переменную - она проинициализируется в следующем методе
  selectedCategory: Category | any;


  // изменение категории
  //метод запускается из html этого класса : (selectCategory)="onSelectCategory($event)
  //в параметры из @Output приходит категория(по которой клацнули) и далее..
  public onSelectCategory(category: Category) {

    //инициализируем спец. поле этого класса этой пришедшей категорией
    this.selectedCategory = category;

    //получаем из дао массив с тасками, относящимися только к этой категории
    //и переподписываем поле этого класса на этот массив с отфильтрованными тасками
    //то на странице будут отображаться таски, только с этой категорией
    // this.dataHandler.searchTasks(
    //   this.selectedCategory
    //   // ,
    //   // null,
    //   // null,
    //   // null
    // ).subscribe(tasks => {
    //   this.tasks = tasks;
    // });

    //закомментированное заменили на:
    // this.updateTasks(); //закоментили тк статистику добавили
    this.updateTasksAndStat();
  }

  ////////////////////////////////////////////////////////////////
  // обновление таски-задачи из открывающегося диалогового окна //
  ////////////////////////////////////////////////////////////////

  //метод запускается из html этого класса : (updateTask)="onUpdateTask($event)
  //в параметры из @Output приходит новая таска(которую изменили в диалоговом окне,
  //и которую надо сохранить в дб) и далее..
  public onUpdateTask(task: Task) {

    // //используем метод updateTask() передав ему новую таску
    // //чтобы ее сохранить и из возврата метода получить Observable<Task>
    // this.dataHandler.updateTask(task)//вернет Observable<Task>
    //   //на полученной Observable<Task> вызовем subscribe()
    //   //и этом subscribe() переделаем издателя из Observable<Task> на издателя Observable<Task[]>
    //   .subscribe(() => {
    //     //и тут же обновляем список задач (получаем новый обновленный массив)
    //     this.dataHandler.searchTasks(
    //       this.selectedCategory//по любому иже инициирована клацнутой до таски категорией
    //       // ,
    //       // null,
    //       // null,
    //       // null
    //       //и далее метод subscribe() переподпишет поле этого класса tasks на Observable<Task[]>
    //     ).subscribe(tasks => {
    //       this.tasks = tasks;
    //     });
    //   });
    // //то метод subscribe(), вызванный на объекте Observable<...> может как и
    // //вернуть другой объект Observable<,,,>, так и
    // //подписать на Observable<,,,> поле класса.

    //весь код этого метода можно делегировать в метод updateTasks(),
    //заменив весь код в subscribe() этой строчкой:
    // this.updateTasks();

    this.dataHandler.updateTask(task).subscribe(cat => {
      // this.updateTasks(); //закоментили тк статистику добавили
      this.updateTasksAndStat();
    });

  }

  ////////////////////////////////////////////////////////////////////////////////////
  // удаление таски-задачи - в параметры приходит таска, которую надо удалить из дб //
  ////////////////////////////////////////////////////////////////////////////////////
  public onDeleteTask(task: Task) {

    //удаляем таску с пом метода Сервиса (возвращается Observable<Task> которую удалили)
    // this.dataHandler.deleteTask(task.id)
    //   //на Observable<Task> вызываем subscribe в котором вернется
    //   //объект Observable<Task[]> (массив со всеми имеющимися тасками)
    //   .subscribe(() => {
    //   this.dataHandler.searchTasks(
    //     this.selectedCategory
    //     // ,
    //     // null,
    //     // null,
    //     // null
    //     //подписываем поле этого класса на возврат
    //     //из предидущего метода (Observable<Task[]> - на массив всех тасок)
    //   ).subscribe(tasks => {
    //     this.tasks = tasks;
    //   });
    // });

    //весь этот код выше можно делегировать в приват метод updateTasks():
    //в параметрах subscribe(...) говорим, что подписка уже настроена в методе updateTasks()
    //- те подписываемся в методе updateTasks()
        this.dataHandler.deleteTask(task.id).subscribe(cat => {
                // this.updateTasks() //закоментитли тк статистику добавили
          this.updateTasksAndStat()
            });

  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  // удаление категории (при нажатии на карандаш(который рядом с категорией, откроется диалоговое окно //
  // в котором есть кнопка "Удалить"))                                                                 //
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  public onDeleteCategory(category: Category) {
    //В dataHandler вызываем deleteCategory (удаляем из дб и в возврате получаем Observable<Category>)
    //на Observable<Category> подписываемся-subscribe:
    //выставляем selectedCategory в null и в метод onSelectCategory подаем этот null
    //чтобы отобразить список всех тасок(это виртуальная категория ВСЕ)
    this.dataHandler.deleteCategory(category.id).subscribe(cat => {
      this.selectedCategory = null; // открываем категорию "Все"
      //показываем обновленный список используя новый появившийся метод onSearchCategory()
      // this.onSelectCategory(this.selectedCategory);//или this.onSelectCategory(null);
      this.onSearchCategory(this.searchCategoryText);
    });
  }


  ////////////////////////////////////////////////////////////////////////////////////
  // редактирование категории (при нажатии на карандаш, который рядом с категорией) //
  ////////////////////////////////////////////////////////////////////////////////////
  public onUpdateCategory(category: Category) {
    //В dataHandler вызываем deleteCategory (удаляем из дб и в возврате получаем Observable<Category>)
    //на Observable<Category> подписываемся-subscribe:
    //в метод onSelectCategory подаем категорию, которую обновляли
    //и в этом методе onSelectCategory произойдет окончательная переподписка
    //то отображаем список тасок только от этой обновленной категории
    this.dataHandler.updateCategory(category).subscribe(() => {
      //показываем обновленный список используя новый появившийся метод onSearchCategory()
      // this.onSelectCategory(this.selectedCategory);
      this.onSearchCategory(this.searchCategoryText);
    });
  }


////////////////////////////////////////////////////////////////
 //           фильтрация над таблицей тасок
////////////////////////////////////////////////////////////////
  // переменные для поиска - для фильтрации которая над таблицей тасок
  // приходят из @Output() дамп компонента tasks.component.ts
  public searchTaskText = ''; // дефолт текущее значение для поиска задач
                              //чтобы показывались все задачи
  // фильтрация
  public priorityFilter: Priority;
  public statusFilter: boolean;


  //методы для  поиска задач  для фильтрации которая над таблицей тасок
  //по вхождению букв
  public onSearchTasks(searchString: string) {
    this.searchTaskText = searchString;
    this.updateTasks();
  }

  // фильтрация задач по статусу (все, решенные, нерешенные)
  public onFilterTasksByStatus(status: boolean) {
    this.statusFilter = status;
    this.updateTasks();
  }

  // фильтрация задач по приоритету
  public onFilterTasksByPriority(priority: Priority) {
    this.priorityFilter = priority;
    this.updateTasks();
  }

  //универсальный метод - находит таски по заданным(или известным) полям,
  //и подписывает на них (на массив тасок) поле this.tasks
  public updateTasks() {
    //searchTasks вернет Observable<Task[]>
    this.dataHandler.searchTasks(
      this.selectedCategory,
      this.searchTaskText,
      this.statusFilter,
      this.priorityFilter
      //на Observable<Task[]> подписываем поле tasks этого класса
      //это поле tasks получает дочерний компонент чз @Input()
    ).subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }
/////////////////////////////////////////////////////////////////
// добавление новой задачи (таски)                             //
/////////////////////////////////////////////////////////////////

  public onAddTask(task: Task) {

    //в параметрах subscribe подписываемся на возврат от метода updateTasks()
    this.dataHandler.addTask(task).subscribe(result => {

      // this.updateTasks(); //закомент тк добавили статистику
      this.updateTasksAndStat()

    });

  }

  // добавление категории
  public onAddCategory(title: string) {
    this.dataHandler.addCategory(title).subscribe(() => this.updateCategories());
  }
  private updateCategories() {
    this.dataHandler.getAllCategories().subscribe(categories => this.categories = categories);
  }

  /////////////////////////////////////////////////
  //  для поиска категории в поле ввода вхождения//
  /////////////////////////////////////////////////

  // текущее значение для поиска категорий
  public searchCategoryText = '';

  // поиск категории (в аргументы приходит то что ввели в поле ввода вхождения)
  public onSearchCategory(title: string) {

    this.searchCategoryText = title;

    //на возврате из метода  searchCategories: (Observable<Category[]>)
    //подписываем поле этого класа: categories[] на этот Observable<Category[]>
    this.dataHandler.searchCategories(title).subscribe(categories => {
      this.categories = categories;
    });
  }


  ///////////////////////////////////////////////////
  // статистика                                    //
  ///////////////////////////////////////////////////

  // статистика - каждый раз, когда происходит КРУД действия
  // над тасками эти 4-ре переменных пересчитываются
  // с помощью вызова метода updateTasksAndStat() в КРУД
  //методах выше (вместо updateTasks()) кроме поиска и обновления
  public totalTasksCountInCategory: number;
  public completedCountInCategory: number;
  public uncompletedCountInCategory: number;
  public uncompletedTotalTasksCount: number;

// показывает задачи с применением всех текущий условий (категория, поиск, фильтры и пр.)
  public updateTasksAndStat() {

    this.updateTasks(); // обновить список задач

    // обновить переменные для статистики
    this.updateStat();

  }

  // обновить статистику - добываем данные для статистики из дб
  // zip(из реакт) - получаем сразу 4-ре обзервербла и сразу на них
  // подписываем (но можно было бы и каждый вызов чз subscribe сделать)
  public updateStat() {
    zip(
      this.dataHandler.getTotalCountInCategory(this.selectedCategory),
      this.dataHandler.getCompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedCountInCategory(this.selectedCategory),
      this.dataHandler.getUncompletedTotalCount())

      .subscribe(array => {
        this.totalTasksCountInCategory = array[0];
        this.completedCountInCategory = array[1];
        this.uncompletedCountInCategory = array[2];
        this.uncompletedTotalTasksCount = array[3]; // нужно для категории Все
      });
  }


}//конец класса


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
 *      -В классе в конструкторе заинджектим private dialog: MatDialog(для вызова у него метода open())
 *      -В html в колонку таблицы "Название" мы добавляем событие по клику мышкой:
 *       (click)="openEditTaskDialog(task) - при клике на названии таски вызовется метод
 *       openEditTaskDialog() и в параметрах передастся текущая таска
 *
 *     В родительском tasks.component.ts : этот вызываемый из html метод : openEditTaskDialog(task) :
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
 *       СМ в edit-task-dialog.component.ts - автоматом запускается это диалоговое окно -
 *       а в его ngOnInit() все что надо инициализируется
 *       и то, что будет отображаться в открывшемся диалоговом окне
 *       СМ в edit-task-dialog.component.html
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
 */

/**
 *    Диалоговое окно с выпадающим списком выбора приоритетов
 *    сделал по аналогии с выпадающим списком категорий.
 */

/**
 *    В диалоговое окно добавим кнопку - удалить задачу -
 *    и новое диалоговое окно - Подтверждение удаления
 *    1. В папке dialog создадим новый компонент : ConfirmDialog
 *       пкм->new->AngularSchematic->component.
 *       Этот компонент будет представлять - универсальное диалоговое окно для
 *       подтверждения удаления.
 *
 *       В app.module.ts НЕЗАБУДЕМ добавить этот компонент ConfirmDialog
 *       чтобы это окно все-таки появлялось:
 *           entryComponents: [
 *         EditTaskDialogComponent,
 *         ConfirmDialogComponent]
 *
 *    2. СМ confirm-dialog.component.html
 *       СМ confirm-dialog.component.ts
 *       таким образом мы создали саму компоненту диалогового
 *       окна - универсального подтверждения которое пригодится для
 *       удаления таски
 *     3. В диалоговом окне для редактирования таски: edit-task-dialog.component.html
 *       добавим кнопку УДАЛИТЬ для вызова диалогового окна универсального подтверждения:
 *              <button
 *                 mat-button
 *                 class="red"
 *                 (click)="delete()">
 *                 Удалить задачу
 *              </button>
 *       те эта кнопка вызывает метод  delete() в  edit-task-dialog.component.ts :
 *       СМ метод delete() в  edit-task-dialog.component.ts
 *       в котором в случае если пользователь нажал ОК ->
 *       -> закроется текущее диалоговое окно(окно для изменения таски)
 *       и передастся стринга 'delete' в родительский-вызывающий компонент tasks.component.ts ->
 *       -> в родительский метод openEditTaskDialog()
 *     4. В родительском tasks.component.ts:
 *        в методе openEditTaskDialog() добавится условие :
 *             if (result === 'delete') {
 *                 this.deleteTask.emit(task);
 *                 return;
 *             }
 *        причем emit(task) вызывает:
 *           @Output()
 *           deleteTask = new EventEmitter<Task>();
 *        и происходит передача события в главный app.component.html:
 *             <app-tasks [tasks]="tasks"
 *                      (updateTask)="onUpdateTask($event)"
 *                      (deleteTask)="onDeleteTask($event)"  //сюда смотри
 *              ></app-tasks>
 *        ...и в главном компоненте app.component.ts (в этом классе)
 *        вызывается метод onDeleteTask($event) в параметры которого
 *        передается текущая task.
 *        И уже в этом методе onDeleteTask(task){...} происходит
 *        удаление этой задачи из дб и подписка на обновленный список
 *        всех задач(тасок).
 *        СМ onDeleteTask(task) в app.component.ts(этот классе)
 */

/**
 *   В диалоговое окно edit-task-dialog.component.html
 *   добавили кнопки Завершить задачу и Активировать задачу
 *   1. В edit-task-dialog.component.html добавили эти кнопки:
 *          <button
 *           mat-button class="green"
 *           *ngIf="!task.completed"
 *          (click)="complete()">
 *          Завершить задачу
 *         </button>
 *
 *         <button
 *          mat-button class="green"
 *          (click)="activate()"
 *          *ngIf="task.completed">
 *          Активировать
 *        </button>
 *    2. В класс этого же компонента edit-task-dialog.component.ts
 *       добавили 2-а метода которые будут реагировать на нажатие этих кнопок
 *       и итправлять стрингу с результатом в метод родительского компонента,
 *       открывшего это диалоговое окно:
 *             public complete() {
 *             this.dialogRef.close('complete');
 *
 *             }
 *             public activate() {
 *             this.dialogRef.close('activate');
 *             }
 *     3. В родительской компоненте tasks.component.ts,
 *     в методе, открывшем это диалоговое окно - openEditTaskDialog -
 *     мы и обрабатываем результат:
 *        if (result === 'complete') {
 *         task.completed = true; // ставим статус задачи как выполненная
 *         this.updateTask.emit(task);
 *         }
 *       if (result === 'activate') {
 *         task.completed = false; // возвращаем статус задачи как невыполненная
 *         this.updateTask.emit(task);
 *         return;
 *         }
 *     где изменяем поле: task.completed = true и с помощью метода  emit()
 *     запускаем @Output() и передаем событие в главный компонент:
 *          (updateTask)="onUpdateTask($event)"
 *          (deleteTask)="onDeleteTask($event)",
 *     отвечающий за коммуникацию с дб, и в этом в главной компоненте app.component.html:
 *     запустится метод "onUpdateTask(task)" или (deleteTask)="onDeleteTask(task)"
 *     которые приведут к изменениям в дб и переподписке на обновленный массив тасок
 *     (а в браузере завершенная задача будет перечеркнута если у таски task.completed = false)
 *     СМ эти методы в этом классе.
 */

/**
 *     Добавляем в диалоговое окно выбор даты
 *     1. В app.module.ts +
 *         MatDatepickerModule,
 *         MatNativeDateModule
 *     2. В edit-task-dialog.component.html добавили <mat-form-field>
 *       с календарем. СМ edit-task-dialog.component.html
 *     3. В edit-task-dialog.component.html добавили поле
 *        для хранения временной даты : public tmpDate: Date | any;
 *        далее в ngOnInit() tmpDate получает начальное значение(это
 *        текущая дата в таске) : this.tmpDate = this.task.date;
 *        далее в onConfirm() обновленная таска(которая отправится на сохранение
 *        в родительский класс : tasks.component.ts) получит обновленное поле
 *        с датой : this.task.date = this.tmpDate;
 */

/**
 *     Для даты создаем Pipe(форматтер) для нужного нам отображении даты
 *     1. В app.module.ts :
 *          import {registerLocaleData} from '@angular/common';
 *          import localeRu from '@angular/common/locales/ru';
 *          registerLocaleData(localeRu);
 *
 *          @NgModule({
 *          declarations: [
 *           TaskDatePipe
 *          ],
 *      2. Создаем pipe : TaskDatePipe
 *         создаем папку pipe -> new->Angular Structure->pipe
 *         СМ : task-date-pipe.pipe.ts
 *      3. В task-date-pipe.pipe.ts используем pipe в колонке с датой
 *         интерполяция теперь будет выглядеть так : {{task.date | taskDate}}
 *
 */


/**
 *    В таблицу тасок добавляем иконки редактирования,
 *    удаления и чекбокс - (выполненна задача или не выполненна)
 *    1. В app.module.ts добавили зависимость:
 *    2. В tasks.component.css добавили стилей для новых компонентов :
 *       .delete-icon, .edit-icon, .mat-header-cell
 *    3. В tasks.component.ts в массив displayedColumns
 *       не забыли добавить новые колонки для таблицы тасок : 'operations', 'select'
 *    4. далее СМ в tasks.component.html на : <ng-container matColumnDef="operations">
 *      и на <ng-container matColumnDef="select">
 */

/**
 *     В таблице тасок делаем колонку с категориями кликабельной
 *     (при клике по категории показываются таски только этой категории
 *     и в списке категорий слева который, выбранная категория выделяется)
 *     1. В tasks.component.html в колонку <ng-container matColumnDef="category">
 *       добавим клик- событие :
 *       (click)="!task.completed && task.category && onSelectCategory(task.category)"
 *       СМ в tasks.component.html на это
 *
 *       Метод onSelectCategory() передаст событие : selectCategory.emit(category)
 *       (добавили  поле @Output() selectCategory = new EventEmitter<Category>();)
 *       в главную компоненту app.component.html через (selectCategory)="onSelectCategory($event)"
 *       что запустит метод onSelectCategory($event) в app.component.ts что запустит в дб фильтрацию
 *       тасок по категории и отображение тасок только с выбранной категорией.
 *       Так же в этом методе задается значение полю : this.selectedCategory = category;
 *       И нам надо эту переменную передать в categories.component.ts чтобы в
 *       левом списке категорий эта выбранная категория стала активным стилем
 *       Передаем чз app.component.html в котором : [selectedCategory]="selectedCategory"
 *       а в categories.component.ts поле selectedCategory: Category  | undefined;
 *       надо теперь пометить как : @Input() (те еще и из вне получает значение)
 *       То в объекте categories.component.ts обновится поле selectedCategory
 *       а в categories.component.html применится активный стиль к выбранной категории.
 */

/**
 *     В список категорий добавили виртуальную категорию: Все  :
 *     СМ categories.component.html
 */


/**
 *     В список с категориями добавляем иконку для редактирования категории
 *     (появляется при наведении мыши)
 *     1. добавим стилей в categories.component.css для показа самих
 *     категорий и иконки :
 *         .all-category-title - действует на всю ячейку, - задает ширину
 *                               и то , что все в строчку
 *         .category-title - действует только на tittle
 *         .edit-category-icon-area - на иконку
 *         .edit-category-icon -на иконку, задает цвет ей
 *     2. В categories.component.html - добавляем код для иконки и функционал,
 *        чтобы она отображалась в браузере, только тогда, когда наводим мыкку.
 *        СМ categories.component.html
 */


/**
 *     Реализовать редактирование и удаление категории при нажатии
 *     на иконку редактирования(откроется диалоговое окно EditCategoryDialog ).
 *     При удалении - у всех задач,
 *     которые использовали данную категорию, должно проставиться
 *     null (каскадное удаление).
 *     1. В папке dialog создадим новый компонент EditCategoryDialog
 *        для диалогового окна:
 *        dialog->new->AngularSchematic->component
 *     2. Не забудем добавить вручную EditCategoryDialogComponent в app.module.ts
 *        в раздел  entryComponents: [...]
 *     3. В categories.component.html добавляем вызов метода,
 *        который откроет диалоговое окно редактирования категории:
 *        (click)="$event.stopPropagation(); openEditDialog(category)"
 *     4. В categories.component.ts добавляем метод openEditDialog(category),
 *        который откроет диалоговое окно и далее(после закрытия диалогового окна)-
 *        обработает результат - с помощью  @Output() полей класса
 *        отправит событие в главный компонент для сохранения изменений в дб:
 *             @Output()
 *             deleteCategory = new EventEmitter<Category>();
 *             @Output()
 *             updateCategory = new EventEmitter<Category>();
 *     5. В app.component.html принимаем эти события, вызывающие
 *        соответствующие методы в app.component.ts
 *         (deleteCategory)="onDeleteCategory($event)"
 *         (updateCategory)="onUpdateCategory($event)"
 *     6. В app.component.ts пишем эти 2-а метода:
 *             onDeleteCategory($event) и
 *             onUpdateCategory($event)
 *        эти методы сохраняют изменения в дб и переподписывают
 *        отображаемый массив тасок - tasks на нужный массив(все таски или
 *        отфильтрованные по категории отобразятся)
 *     7. СМ компоненту - диалоговое окно edit-category-dialog для
 *        понимания ее структуры.
 */

/**
 *            Smart and Dumb components
 *      Smart компонент - управляет другими компонентами, предоставляет
 *      данные Dumb компонент - получает данные и отображает их,
 *      обрабатывает действия пользователей и отправляет их на обработку в
 *      Smart компонент.
 *      ● Взаимодействие с компонентами преимущественно через декораторы
 *      @Input и @Output
 *      ● @Input не должны изменяться внутри dumb компонента
 *      (это делает smart)
 *      ● Разделить компоненты-представления (Presentational, Dumb, Pure)
 *      и компоненты- менеджеры (Smart, Container)
 */


/**
 *       Фильтрация задач - поля для поиска задач(тасок) над таблицей тасок
 *       1. В tasks.component.html добавили код для отображения
 *          полей ввода данных для поиска-фильтрации и кнопка - очистить поля.
 *          СМ В tasks.component.html
 *       2. В tasks.component.ts добавили переменные и методы, обслуживающие
 *          код в представлении html этого компонента, используемые для фильтрации
 *       3. Также, для взаимодействия с дб, добавили соответствующие
 *          изменения в smart компонент app.module.ts:
 *             а именно:
 *             в app.component.html принимаем из @Output() дампа:
 *                          (filterByTitle)="onSearchTasks($event)"
 *                          (filterByStatus)="onFilterTasksByStatus($event)"
 *                          (filterByPriority)="onFilterTasksByPriority($event)"
 *                          [priorities]="priorities" - для @Inputput() в tasks.component
 *                                                      для выпадающего списка в фильтрации
 *             СМ app.component.html
 *        4.   в app.component.ts: добавили переменные и методы реагирующие
 *             на @Output() из dump компоненты tasks.component.ts
 *             СМ tasks.component.ts и TaskDAOArray.ts
 */


/**
 *     Оживляем кнопку "Добавить" таску (кнопка над таблицей с тасками - справа)
 *     1. В tasks.component.html создаем кнопку и привязываем к ней событие, запускающее
 *        метод класса: (click)="openAddTaskDialog()"
 *     2. В tasks.component.ts реализуем метод openAddTaskDialog(), который открывает
 *        диалоговое окно: edit-task-dialog
 *     3. После создания таски в диалоговом окне и нажатия "Сохранить" - событие
 *        отправляется в смарт компонент - запуская там метод: onAddTask(task: Task) -
 *        в которм происходит сохранение таски в дб и переподписка на обновленный массив
 *        со всеми тасками.
 */

/**
 *     ● Реализовать добавление категории (по аналогии с редактированием категории)
 *       Оживляем кнопку +  :
 *       1. В categories.component.html в кнопку add допишем вызов метода: (click)="openAddDialog()"
 *       2. В tasks.component.ts реализуем этот метод:
 *          открыли окно,
 *          получили из него result,
 *          отослали result на обраьотку в смарт компонент:
 *              @Output()
 *              addCategory = new EventEmitter<string>();
 *        3. В смарт компоненте app.component.ts :
 *             в его html : (addCategory)="onAddCategory($event)"
 *             в его классе реализуем onAddCategory($event) -
 *             сохранение категории в дб
 *
 *     ● Кнопки “удалить”, “активировать”, “завершить” не должны показываться при
 *     добавлении нового элемента (задачи, категории)
 *     1. В categories.component.ts в методе открывающем диалоговое окно EditCategoryDialogComponent :
 *        openEditDialog() отправим в окно еще и Енам OperType:
 *        data: [category.title, 'Редактирование категории', OperType.EDIT].
 *
 *        То же самое в tasks.component.ts в методе: openAddTaskDialog(),
 *        который открывает диалоговое окно EditTaskDialogComponent :
 *        data: [task, 'Добавление задачи', OperType.ADD]});
 *     2. А в компонентах диалоговых окон(EditCategoryDialog и EditTaskDialog) отлавливаем эти Енамы:
 *           В EditCategoryDialog:
 *           добавляем переменную: private operType: OperType; // тип операции
 *           инициализируем ее:
 *           в  ngOnInit() {this.operType = this.data[2];} // тип операции
 *           и имеется метод, который возвращает труе, если это режим редактирования:
 *               private canDelete(): boolean {
 *               return this.operType === OperType.EDIT;
 *               }
 *           В EditTaskDialog: аналогично
 *       3. В html файлах этих диалоговых окон на кнопки которые надо
 *          скрыть если окно используется для создания нового добавим условие
 *          для видимости кнопки :
 *              <button
 *                 *ngIf="canDelete()"  //условие видимости кнопки "удалить"
 *                 (click)="delete()"
 *                 class="red" mat-button>
 *                  Удалить </button>
 */

/**    (65)Реализуем поиск категорий в поле ввода по вхождению
 *     1. В categories.component.html добавим див
 *        с инпутом для поиска категорий
 *     2. В categories.component.ts реализуем вызываемый из html
 *        метод search() из которого обращаемся к смарт компоненте
 *        для поиска в дб и переподписки + добавим необходимые поля класса
 *     3. Если мы нашли категорию и удалили ее, то она должна сразу исчезнуть
 *        и сразу должен обновиться отфильтрованный по вхождению список категорий на странице:
 *        для этого сделали правки в app.component.ts:
 *          в методах onDeleteCategory() и onUpdateCategory()
 *          для переподписки используем наш новый метод onSearchCategory()
 *          вместо метода onSelectCategory() (а если и дальше вызывать
 *          onSelectCategory(), тогда эта удаленная или обновленная категория будет и дальше
 *          находится в отфильтрованном по вхождению списке категорий)
 *          (можно делать только обновление одной записи)
 */

  /**    (66)Реализуем надпись - ничего не найденно, если ввели во вхождении не то
   *     1. В app.component.html под полосой - разделителем добавили див:
   *        <div *ngIf="categories.length === 0" ><p class="not-found">Ничего не найдено</p></div>
   */

/**
 *     (68)Добавляем статистику
 *     (сначала создали компонент в папке stat: stat.component.ts
 *     этот компонент будет содержать в себе 4-е других
 *     компонента-карточки (1-у карточку показываем 4 раза)
 *     далее в этой же папке stat создадим еще компанент-карточку:
 *     stat-card : stat-card.component.ts)
 *     1.  В app.component.html передаем данные в компоненту со статистикой:
 *         stat.component.ts:
 *            <app-stat>
 *            [totalTasksInCategory]="totalTasksCountInCategory"
 *            [completeTasksInCategory]="completedCountInCategory"
 *            [uncompleteTasksInCategory]="uncompletedCountInCategory"
 *            </app-stat>
 *          то передаем :
 *              сколько задач всего в категории
 *              сколько завершенных
 *              сколько незавершенных
 *          Эти переменные расчитываются в смарт app.component.ts
 *       2. А в классе: app.component.ts из дб добудем эти переменные
 *          для статистики

 *       3. В карточке: stat-card.component.html
 *          пропишем див из шаблона с нашими дополнительными
 *          атрибутами и стилями
 *       4. В самом stat.component.html отобразим эту карточку
 *          4-ре раза подряд.
 *          а в его классе stat.component.ts получим данные
 *          из смарт: app.component.ts
 *
 */







