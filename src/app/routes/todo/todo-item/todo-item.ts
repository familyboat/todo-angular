import { Component, input, OnInit, signal } from '@angular/core';
import {
  editTaskInTodo,
  isCreated,
  isDeleted,
  isDone,
  markTodoAsCreated,
  markTodoAsDeleted,
  markTodoAsDone,
  serializeUTC,
  Todo,
} from '../../../stores/todo';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-item',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem implements OnInit {
  index = input.required<number>();
  todo = input.required<Todo>();

  isEditing = signal(false);
  task = new FormControl();

  ngOnInit(): void {
    this.task.setValue(this.todo().task);
  }

  flipEditingStatus() {
    this.isEditing.set(!this.isEditing());
    if (this.isEditing() === false && this.task.value !== this.todo().task) {
      editTaskInTodo(this.todo().uuid, this.task.value!);
    }
  }

  done() {
    markTodoAsDone(this.todo().uuid);
  }

  deleted() {
    markTodoAsDeleted(this.todo().uuid);
  }

  undo() {
    markTodoAsCreated(this.todo().uuid);
  }

  isCreated() {
    return isCreated(this.todo());
  }

  isDone() {
    return isDone(this.todo());
  }

  isDeleted() {
    return isDeleted(this.todo());
  }

  serializeUTC(utc: string) {
    return serializeUTC(utc);
  }
}
