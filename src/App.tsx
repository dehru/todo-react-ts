import React from 'react';
import './App.css';
import { TodoStore } from './todoStore';

export class App extends React.Component {
  todoStore: TodoStore;
  constructor(props: any) {
    super(props);
    this.todoStore = new TodoStore('todoApp');
    this.addTodo = this.addTodo.bind(this);
  }
  addTodo(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key && e.key === 'Enter') {
      this.todoStore.add({ id: "id_" + Date.now(), title: e.currentTarget.value, completed: false });
    }
  }
  render() {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input className="new-todo" placeholder="What needs to be done?" autoFocus onKeyUp={(ev) => this.addTodo(ev)} />
        </header>
        { /* This section should be hidden by default and shown when there are todos */ }
        <section className="main hidden">
          <input id="toggle-all" className="toggle-all" type="checkbox" />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
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
