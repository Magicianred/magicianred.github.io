let todoItems = [];

function addTodo(text, checked) {
  const todo = {
    text,
    checked: false,
    id: [...Array(10)].map(i=>(~~(Math.random()*36)).toString(36)).join(''),
  };

  todoItems.push(todo);

  const list = document.querySelector('.js-todo-list');
  list.insertAdjacentHTML('beforeend', `
  <li class="todo-item" data-key="${todo.id}">
  <input id="${todo.id}" type="checkbox"/>
  <label for="${todo.id}" class="tick js-tick"></label>
  <span>${todo.text}</span>
  <button class="delete-todo js-delete-todo">
  <svg height="512pt" viewBox="0 0 512 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m256 0c-141.164062 0-256 114.835938-256 256s114.835938 256 256 256 256-114.835938 256-256-114.835938-256-256-256zm0 0" fill="#f44336"/><path d="m350.273438 320.105469c8.339843 8.34375 8.339843 21.824219 0 30.167969-4.160157 4.160156-9.621094 6.25-15.085938 6.25-5.460938 0-10.921875-2.089844-15.082031-6.25l-64.105469-64.109376-64.105469 64.109376c-4.160156 4.160156-9.621093 6.25-15.082031 6.25-5.464844 0-10.925781-2.089844-15.085938-6.25-8.339843-8.34375-8.339843-21.824219 0-30.167969l64.109376-64.105469-64.109376-64.105469c-8.339843-8.34375-8.339843-21.824219 0-30.167969 8.34375-8.339843 21.824219-8.339843 30.167969 0l64.105469 64.109376 64.105469-64.109376c8.34375-8.339843 21.824219-8.339843 30.167969 0 8.339843 8.34375 8.339843 21.824219 0 30.167969l-64.109376 64.105469zm0 0" fill="#fafafa"/></svg>
  </button>
  </li>
  `);

  localStorage.setItem('testo', JSON.stringify(todoItems));  //salva tutti i value che submitiamo nella key testo, i value sono convertiti in stringhe da JSON.stringify
  if(checked){
	  toggleDone(todo.id);
  }
}


let abitudini = localStorage.getItem('testo'); //Ci permette di vedere la key 'testo' e poterla utilizzare
let habits = JSON.parse(abitudini);  //fa diventare da stringa ad array la variabile abitudini
if (habits !== null){ //Ci evita di avere un possibile errore quando non abbiamo elementi submitati
  habits.forEach(function (abitudine) {   //creiamo la funzione con elemento abitudine, ci permette di dividere ogni elemento dell'array in modo da poi avere solo il text
    addTodo(abitudine.text, abitudine.checked);
  });
}


function toggleDone(key) {
  const index = todoItems.findIndex(item => item.id === key);
  todoItems[index].checked = !todoItems[index].checked;
  localStorage.setItem('testo', JSON.stringify(todoItems)); //Abbiamo apportato una modifica e la sovrascriviamo di nuovo per avere la modifica
  const item = document.querySelector(`[data-key='${key}']`);
  if (todoItems[index].checked) {
    item.classList.add('done');
  } else {
    item.classList.remove('done');
  }
}

function deleteTodo(key) {
  todoItems = todoItems.filter(item => item.id !== key); //filter crea un nuovo array contentente tutti gli elementi che passano il test implementato dalla funzione.
  localStorage.setItem('testo', JSON.stringify(todoItems)); // Toglie e rimette la stringa con l'elemento eliminato
  const item = document.querySelector(`[data-key='${key}']`);
  item.remove();


  const list = document.querySelector('.js-todo-list');
  if (todoItems.length === 0) list.innerHTML = '';
}

const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('.js-todo-input');

  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});



const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.classList.contains('js-delete-todo')) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteTodo(itemKey);
  }

});
