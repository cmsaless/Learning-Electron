const {ipcRenderer} = require('electron');

document.getElementById('todoForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = event.target[0];
    ipcRenderer.send('add-todo', input.value);
    input.value = '';
})