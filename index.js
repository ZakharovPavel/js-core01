const searchField = document.querySelector('.search-input');

async function getRepos() {
    let reps = [];

    let url = 'https://api.github.com/search/repositories?q=Q&per_page=5';
    let response = await fetch(url);
    let result = await response.json();
    

    console.log(result);
    reps = result.items;
    console.log(reps);
    
    
}

const debounce = (fn, debounceTime) => {

    let idSt;

    return function() {
        const fnCall = () => {fn.apply(this, arguments)};

        clearTimeout(idSt);

        idSt = setTimeout(fnCall, debounceTime);
    };
};

function onChange(e) {
    let inputValue = e.target.value.trim();
    if (inputValue[0]) {
        console.log(inputValue);
    }
}

onChange = debounce(onChange, 500);

searchField.addEventListener('keyup', onChange);

getRepos();