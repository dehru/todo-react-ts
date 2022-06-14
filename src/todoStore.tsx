export interface Todo {
    id: string;
    title: string;
    completed: boolean;
} 
export class TodoStore extends EventTarget {
    localStorageKey;
    todos: Todo[] = [];
    constructor(localStorageKey: string) {
        super();
        this.localStorageKey = localStorageKey;
        this._readStorage();
        // handle todos edited in another window
        window.addEventListener("storage", () => {
            this._readStorage();
            this._save();
        }, false);
    }
    get(id: string) { return this.todos.find(todo => todo.id === id); }
    isAllCompleted() { return this.todos.every(todo => todo.completed); }
    hasCompleted() { return this.todos.some(todo => todo.completed); }
    all(filter: string) {
        if (filter === 'active') { this.todos = this.todos.filter(todo => !todo.completed) }
        else if (filter === 'completed') { this.todos = this.todos.filter(todo => todo.completed) }
    }
    _readStorage () {
        this.todos = JSON.parse(window.localStorage.getItem(this.localStorageKey) || '[]');
    }
    _save () {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.todos));
        this.dispatchEvent(new CustomEvent('save'));
    }
    // MUTATE methods
    add (todo: Todo) {
        this.todos.push({ title: todo.title, completed: false, id: "id_" + Date.now() });
        this._save();
    }
    remove (id: string) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this._save();
    }
    toggle (id: string) {
        this.todos = this.todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
        this._save();
    }
    clearCompleted () {
        this.todos = this.todos.filter(todo => !todo.completed);
        this._save();
    }
    update (todo: Todo) {
        this.todos = this.todos.map(t => t.id === todo.id ? todo : t);
        this._save();
    }
    toggleAll () {
        const completed = !this.hasCompleted() || !this.isAllCompleted();
        this.todos = this.todos.map(todo => ({ ...todo, completed }));
        this._save();
    }
    revert () {
        this._save();
    }
}