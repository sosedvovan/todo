import {Priority} from "./Priority";
import {Category} from "./Category";

export class Task {
    id?: number | any;
    title?: string | any;
    completed?: boolean | any;
    priority?: Priority | any;
    category?: Category | any;
    date?: Date | any;

  constructor(id?: number | any, title?: string, completed?: boolean, priority?: Priority | any, category?: Category, date?: Date) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.priority = priority;
        this.category = category;
        this.date = date;
    }
}
