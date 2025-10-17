import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  createdTodosStore,
  deletedTodosStore,
  doneTodosStore,
  loadFromDb,
} from '../../../stores/todo';
import { TodoItem } from '../todo-item/todo-item';

@Component({
  selector: 'app-todo-list',
  imports: [AsyncPipe, TodoItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList implements OnInit {
  protected readonly createdTodosStore = createdTodosStore;
  protected readonly doneTodosStore = doneTodosStore;
  protected readonly deletedTodosStore = deletedTodosStore;

  ngOnInit(): void {
    loadFromDb();
  }
}
