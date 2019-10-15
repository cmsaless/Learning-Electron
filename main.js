const { app, ipcMain } = require('electron')
const AppWindow = require('./AppWindow');
const DataStore = require('./DataStore')

const todosData = new DataStore({name: 'Todos Main'});

function main() {

    let mainWindow = new AppWindow({file: './renderer/index.html'});
    let addTodoWindow;

    mainWindow.once('show', () => {
        mainWindow.webContents.send('todos', todosData.todos);
    });

    ipcMain.on('add-todo-window', () => {
        console.log('bringing up add window');
        if (!addTodoWindow) {
            addTodoWindow = new AppWindow({
                file: './renderer/add.html',
                width: 400,
                height: 400,
                parent: mainWindow
            });

            addTodoWindow.on('closed', () => {
                addTodoWindow = null;
            })
        }
    });

    ipcMain.on('add-todo', () => {
        const updatedTodos = todosData.addTodo(todo).todos;
        mainWindow.send('todos', updatedTodos);
    });

    ipcMain.on('delete-todo', (event, todo) => {
        const updatedTodos = todosData.deleteTodo(todo).todos;
        mainWindow.send('todos', updatedTodos);
    });
}

app.on('ready', main);

app.on('activate', () => {
    if (win === null) {
        main()
    }
});

app.on('window-all-closed', () => {
    app.quit();
});

