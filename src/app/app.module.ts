import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CategoriesComponent } from './views/categories/categories.component';
import { TasksComponent } from './views/tasks/tasks/tasks.component';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
