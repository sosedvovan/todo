import {Component, OnInit} from '@angular/core';
import { Task } from 'src/app/model/Task';
import {Category} from "../../model/Category";
import {DataHandlerService} from "../../service/data-handler.service";


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit{

  //хотим этот массив или переменную передавать во вьюху
  categories: Category[];

  //инджектим наш сервис и у него получаем нужный массив
  constructor(private dataHandler: DataHandlerService) {
    this.categories = this.dataHandler.getCategories();
  }

  //ДЛЯ ПРИМЕРА: вызывается автоматически после инициализации компонента
  ngOnInit(): void {
    console.log(this.categories)
  }

  showTaskByCategory(category: Category): Task[] {
    return this.dataHandler.getTasksByCategory(category);

  }
}
