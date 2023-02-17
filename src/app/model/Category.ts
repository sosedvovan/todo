export class Category {
    id?: number | any;  //any тк сюда null подаем при создании новой категории
                        // тк мемори дб используем
    title?: string | any;

    constructor(id?: number | any, title?: string) {
        this.id = id;
        this.title = title;
    }
}
