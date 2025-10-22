import { BehaviorSubject, map } from 'rxjs';
import {
  addTodoToDb,
  editTaskInTodoInDb,
  getAllTodosFromDb,
  markTodoAsCreatedInDb,
  markTodoAsDeletedInDb,
  markTodoAsDoneInDb,
} from '../db/todo';

/**
 * 日期的字符串形式，时区用 UTC。
 */
type DateString = string;

export const TodoStatus = {
  /**
   * 已创建
   */
  created: 0,
  /**
   * 已完成
   */
  done: 1,
  /**
   * 已删除
   */
  deleted: 2,
} as const;

export type TodoStatus = (typeof TodoStatus)[keyof typeof TodoStatus];

/**
 * 对 UTC 值序列化
 */
export function serializeUTC(utc: string) {
  return new Date(utc).toLocaleString();
}

/**
 * 标明 todo 的状态是否为：已完成
 */
export function isDone(todo: Todo) {
  return todo.status === TodoStatus.done;
}

/**
 * 标明 todo 的状态是否为：已删除
 */
export function isDeleted(todo: Todo) {
  return todo.status === TodoStatus.deleted;
}

/**
 * 标明 todo 的状态是否为：已创建
 */
export function isCreated(todo: Todo) {
  return todo.status === TodoStatus.created;
}

/**
 * 对 todo 的状态值序列化
 */
export function serializeTodoStatus(status: TodoStatus) {
  switch (status) {
    case TodoStatus.created: {
      return '已创建';
    }
    case TodoStatus.done: {
      return '已完成';
    }
    case TodoStatus.deleted: {
      return '已删除';
    }
  }
}

/**
 * 描述 todo 的属性结构
 */
export interface Todo {
  /**
   * 待处理的任务
   */
  task: string;
  /**
   * 标明该任务的状态：已创建、已完成、已删除
   *
   * 以下状态变化是合理的：
   * 1. 已创建 -> 已完成
   * 2. 已创建 -> 已删除
   * 3. 已完成 -> 已删除
   */
  status: TodoStatus;
  /**
   * 任务创建的时间
   */
  createdAt: DateString;
  /**
   * 任务修改的时间
   *
   * 已完成或已删除的任务不可修改
   */
  modifiedAt: DateString;
  /**
   * 任务的唯一编号
   */
  uuid: string;
}

export const todosStore = new BehaviorSubject<Array<Todo>>([]);
export const createdTodosStore = todosStore.pipe(
  map((todos) => todos.filter((todo) => isCreated(todo)))
);
export const doneTodosStore = todosStore.pipe(map((todos) => todos.filter((todo) => isDone(todo))));
export const deletedTodosStore = todosStore.pipe(
  map((todos) => todos.filter((todo) => isDeleted(todo)))
);

/**
 * 从指派的 task 创建一个新的 todo
 */
export function createTodoFrom(task: string) {
  const now = new Date();

  const todo: Todo = {
    task,
    status: TodoStatus.created,
    createdAt: now.toUTCString(),
    modifiedAt: now.toUTCString(),
    uuid: crypto.randomUUID(),
  };

  const todos = todosStore.getValue();
  todos.push(todo);
  todosStore.next(todos);

  addTodoToDb(todo);
}

/**
 * 对 todo 的 task 进行编辑
 */
export function editTaskInTodo(uuid: string, task: string) {
  const target = todosStore.getValue().find((todo) => todo.uuid === uuid);
  if (target && target.task !== task) {
    const now = new Date();
    target.task = task;
    target.modifiedAt = now.toUTCString();
    editTaskInTodoInDb(target);
  }
}

/**
 * 将已完成的 todo 的状态修改为 done
 */
export function markTodoAsDone(uuid: string) {
  const todos = todosStore.getValue();
  const target = todos.find((todo) => todo.uuid === uuid);
  if (target) {
    target.status = TodoStatus.done;
    todosStore.next(todos);
    markTodoAsDoneInDb(uuid);
  }
}

/**
 * 将已删除的 todo 的状态修改为 deleted
 */
export function markTodoAsDeleted(uuid: string) {
  const todos = todosStore.getValue();
  const target = todos.find((todo) => todo.uuid === uuid);
  if (target) {
    target.status = TodoStatus.deleted;
    todosStore.next(todos);
    markTodoAsDeletedInDb(uuid);
  }
}

/**
 * 将回退为已创建的 todo 的状态修改为 created
 */
export function markTodoAsCreated(uuid: string) {
  const todos = todosStore.getValue();
  const target = todos.find((todo) => todo.uuid === uuid);
  if (target) {
    target.status = TodoStatus.created;
    todosStore.next(todos);
    markTodoAsCreatedInDb(uuid);
  }
}

/**
 * 从数据库中加载 todo 列表
 */
export async function loadFromDb() {
  const todos = await getAllTodosFromDb();
  todosStore.next(todos);
}
