import { Component } from '@angular/core';
import { createTodoFrom, todosStore } from '../../../stores/todo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-form.html',
  styleUrl: './todo-form.css',
})
export class TodoForm {
  protected readonly todosStore = todosStore;
  protected newTaskControl = new FormControl('');

  createTodo() {
    const newTask = this.newTaskControl.value;
    if (newTask) {
      createTodoFrom(newTask);
      this.newTaskControl.reset();
    }
  }
}
