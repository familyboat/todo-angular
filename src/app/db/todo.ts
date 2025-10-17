/**
 * 将 todo 信息持久化的存储在浏览器的 indexed db中
 */

import { TodoStatus, type Todo } from '../stores/todo';
import { openDB } from 'idb';

const storeName = 'todo';

const db = await openDB('todoApp', 1, {
  upgrade(db) {
    const store = db.createObjectStore(storeName, {
      keyPath: 'id',
      autoIncrement: true,
    });
    store.createIndex('uuid', 'uuid');
    store.createIndex('id', 'id');
  },
});

/**
 * 从数据库中获取 todo 列表
 */
export async function getAllTodosFromDb() {
  return await db.getAllFromIndex(storeName, 'id');
}

/**
 * 将新的 todo 添加到数据库中
 */
export async function addTodoToDb(todo: Todo) {
  await db.add(storeName, todo);
}

/**
 * 编辑 todo 的 task 信息，更新 modifiedAt 信息
 */
export async function editTaskInTodoInDb(todo: Todo) {
  const innerTodo = await getTodoInDb(todo.uuid);
  if (innerTodo && innerTodo.task !== todo.task) {
    innerTodo.task = todo.task;
    innerTodo.modifiedAt = todo.modifiedAt;
    await db.put(storeName, innerTodo);
  }
}

/**
 * 将 todo 的状态标记为：已完成
 */
export async function markTodoAsDoneInDb(uuid: string) {
  await markTodoInDb(uuid, TodoStatus.done);
}

/**
 * 将 todo 的状态标记为：已删除
 */
export async function markTodoAsDeletedInDb(uuid: string) {
  await markTodoInDb(uuid, TodoStatus.deleted);
}

/**
 * 将 todo 的状态标记为：已创建
 */
export async function markTodoAsCreatedInDb(uuid: string) {
  await markTodoInDb(uuid, TodoStatus.created);
}

async function markTodoInDb(uuid: string, status: TodoStatus) {
  const todo = await getTodoInDb(uuid);
  if (todo) {
    todo.status = status;
    await db.put(storeName, todo);
  }
}

export async function clearTodoInDb() {
  await db.clear(storeName);
}

export async function getTodoInDb(uuid: string) {
  return (await db.getFromIndex(storeName, 'uuid', uuid)) as Todo;
}
