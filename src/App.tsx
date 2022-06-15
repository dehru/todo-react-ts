import React, { useState } from 'react';
import './App.css';
import { TodoStore, Todo } from './todoStore';

function TodoItem(props: { todo: Todo, ondelete: Function, oncompleted: Function, onupdate: Function }) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <li key={props.todo.id} className={isEditing ? 'editing' : ''}>
      <div className="view">
        <input className="toggle" type="checkbox" checked={props.todo.completed} onChange={(e) => { props.todo.completed = e.target.checked;  props.oncompleted(props.todo)}} />
        <label onDoubleClick={(e) => setIsEditing(true)}>{props.todo.title}</label>
        <button className="destroy" onClick={(e) => { props.ondelete(props.todo)}}></button>
      </div>
      <input className="edit" defaultValue={props.todo.title} onKeyUp={e => {
        if (e.key === 'Enter') {
          props.todo.title = e.currentTarget.value;
          props.onupdate(props.todo);
          setIsEditing(false);
        }
      }} />
    </li>
  );
}

export class App extends React.Component {
  todoStore: TodoStore;
  state: { todos: Todo[] } = { todos: [] };
  constructor(props: any) {
    super(props);
    this.todoStore = new TodoStore('todoApp');
    this.state = { todos: this.todoStore.todos };
    this.todoStore.addEventListener('save', () => {
      console.log('caught save ');
      this.setState({ todos: this.todoStore.todos });
    });
    this.addTodo = this.addTodo.bind(this);
  }
  addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key && e.key === 'Enter') {
      this.todoStore.add({ id: "id_" + Date.now(), title: e.currentTarget.value, completed: false });
      e.currentTarget.value = '';
    }
  }
  handleDelete(todo: Todo) {
    this.todoStore.remove(todo.id);
  }
  handleCompleted(todo: Todo) {
    this.todoStore.update(todo);
  }
  handleUpdate(todo: Todo) {
    this.todoStore.update(todo);
  }
  render() { 
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo" placeholder="What needs to be done?" autoFocus onKeyUp={(ev) => this.addTodo(ev)} />
        </header>
        { /* This section should be hidden by default and shown when there are todos */ }
        <section className={'main ' +  this.state.todos.length ? '' : 'hidden'}>
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {this.state.todos.map((todo: Todo) => { return <TodoItem key={todo.id} todo={todo} ondelete={this.handleDelete.bind(this)} oncompleted={this.handleCompleted.bind(this)} onupdate={this.handleUpdate.bind(this)} /> })}
          </ul>
        </section>
        { /*  This footer should be hidden by default and shown when there are todos */ }
        <footer className="footer hidden">
          { /* This should be `0 items left` by default */}
          <span className="todo-count"><strong>0</strong> item left</span>
          { /* Remove this if you don't implement routing */}
          <ul className="filters">
            <li>
              <a className="selected" href="#/">All</a>
            </li>
            <li>
              <a href="#/active">Active</a>
            </li>
            <li>
              <a href="#/completed">Completed</a>
            </li>
          </ul>
          { /* Hidden if no completed items are left */}
          <button className="clear-completed">Clear completed</button>
        </footer>
      </section>
    );
  }
  
}

export default App;
