import { Routes } from '@angular/router';
import { routerConfig } from './configs';
import { Home } from './routes/home/home';
import { Todo } from './routes/todo/todo';

export const routes: Routes = [
  {
    path: routerConfig.HomePath,
    component: Home,
  },
  {
    path: routerConfig.ToDoPath,
    component: Todo,
  },
];
