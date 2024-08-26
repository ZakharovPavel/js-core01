const searchArea = document.querySelector('.search-area')
const searchField = document.querySelector('.search-input');
const resultList = document.querySelector('.search-input__result-list');
const cardContainer = document.querySelector('.search-area__container');

let repositories;

// Получить репозитории из github
async function getRepos(e) {
  if (e.target.value === '') return;

  let reps = [];

  let url = `https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`;
  let response = await fetch(url);
  let result = await response.json();

  reps = result.items;
  console.log(reps);
  return reps;
}

// Сборка выпадающего списка результатов поиска 
function resultConstructor(res) {
  
  let resultItems = [];
  
  resultList.innerHTML = '';
  if (!res) return;

  for (let i = 0; i < res.length; i++) {
    let item = document.createElement('li');
    item.classList.add('search-input__result-item');
    item.setAttribute('data-result-counter', i + 1);
    item.append(res[i].name);
    resultItems.push(item);
  }

  resultList.append(...resultItems);
  searchField.after(resultList);
}

// Задержка
const debounce = (fn, debounceTime) => {
  let idSt;

  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };

    clearTimeout(idSt);

    idSt = setTimeout(fnCall, debounceTime);
  };
};

// Вывод списка результатов при изменении поля
async function onChange(e) {
  let inputValue = e.target.value.trim();
  
  if (!inputValue[0]) {
    e.target.value = '';
    return;
  }

  repositories = await getRepos(e);
  resultConstructor(repositories);
}

// Задержка перед запросом к серверу
onChange = debounce(onChange, 500);

// Очистка всплывающего списка при очищении поля ввода
function onClear() {
  resultList.innerHTML = '';
}

// Закрытие карточки по нажатию на крест
function onCloseCard(e) {
  if (e.target.className != 'icon-close') return;

  let userCard = e.target.closest('.search-area__user-card');
  userCard.remove();
}

// Создать карточку выбранного репозитория и добавить в контейнер
async function onResultListClick(e) {
  if (e.target.className != 'search-input__result-item') return;

  let originRepos = [].concat(repositories);
  let resultItemData = e.target.dataset.resultCounter;
  let resultItem = originRepos[Number(resultItemData - 1)];

  let newCard = document.createElement('div');
  let cardTextContainer = document.createElement('div');
  let itemName = document.createElement('span');
  let itemOwner = document.createElement('span');
  let itemStars = document.createElement('span');
  let closeButton = document.createElement('div');

  newCard.classList.add('search-area__user-card');
  cardTextContainer.classList.add('search-area__card-wrapper-left');
  itemName.classList.add('search-area__info');
  itemOwner.classList.add('search-area__info');
  itemStars.classList.add('search-area__info');
  closeButton.classList.add('icon-close');

  itemName.insertAdjacentText('afterbegin', 'Name: ' + `${resultItem.name}`);
  itemOwner.insertAdjacentText('afterbegin', 'Owner: ' + `${resultItem.owner.login}`);
  itemStars.insertAdjacentText('afterbegin', 'Stars: ' + `${resultItem.stargazers_count}`);

  cardTextContainer.append(itemName);
  cardTextContainer.append(itemOwner);
  cardTextContainer.append(itemStars);
  newCard.append(cardTextContainer);
  newCard.append(closeButton);
  cardContainer.append(newCard);

  searchField.value = '';
  // resultList.innerHTML = '';
  onClear();
}

searchField.addEventListener('keyup', (e) => {
  if (searchField.value === '') {
    onClear();
    return;
  } 

  onChange(e);
});

searchField.addEventListener('input', (e) => {
  if (searchField.value !== '' 
    || (searchField.value === '' && e.inputType === 'deleteContentBackward')) return;

  onClear();
});

searchArea.addEventListener('click', (e) => {
  onCloseCard(e);
  onResultListClick(e);
});





















