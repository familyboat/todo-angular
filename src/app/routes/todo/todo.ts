import { Component } from '@angular/core';
import { TodoForm } from './todo-form/todo-form';
import { TodoList } from './todo-list/todo-list';

@Component({
  selector: 'app-todo',
  imports: [TodoList, TodoForm],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {}
