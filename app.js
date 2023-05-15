const searchBox = document.getElementById('searchBox');
const results = document.getElementById('results');
const details = document.getElementById('details');
const favourites = document.getElementById('favourites');
const themeButton = document.getElementById('theme-button');
let favouriteMovies = JSON.parse(localStorage.getItem('favouriteMovies')) || [];

function searchMovies(query) {
    fetch(`https://www.omdbapi.com/?s=${query}&apikey=13072950`)
        .then(response => response.json())
        .then(data => showMovies(data.Search));
}

function showMovies(movies) {
    results.innerHTML = '';
    movies.forEach(movie => {
        let div = document.createElement('div');
        div.innerHTML = `
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h2>${movie.Title}</h2>
            <button onclick="addToFavourites('${movie.imdbID}')">Add to Favourites</button>
            <button onclick="showDetails('${movie.imdbID}')">View Details</button>
        `;
        results.appendChild(div);
    });
}

function addToFavourites(id) {
    if (!favouriteMovies.includes(id)) {
        favouriteMovies.push(id);
        localStorage.setItem('favouriteMovies', JSON.stringify(favouriteMovies));
        showFavourites();
    }
}

function showFavourites() {
    favourites.innerHTML = '';
    favouriteMovies.forEach(movieId => {
        fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=13072950`)
            .then(response => response.json())
            .then(movie => {
                let div = document.createElement('div');
                div.innerHTML = `
                    <img src="${movie.Poster}" alt="${movie.Title}">
                    <h2>${movie.Title}</h2>
                    <button onclick="removeFromFavourites('${movie.imdbID}')">Remove from Favourites</button>
                    <button onclick="showDetails('${movie.imdbID}')">View Details</button>
                `;
                favourites.appendChild(div);
            });
    });
}

function removeFromFavourites(id) {
    favouriteMovies = favouriteMovies.filter(movieId => movieId !== id);
    localStorage.setItem('favouriteMovies', JSON.stringify(favouriteMovies));
    showFavourites();
}

function showDetails(id) {
    fetch(`https://www.omdbapi.com/?i=${id}&apikey=13072950`)
        .then(response => response.json())
        .then(movie => {
            details.innerHTML = `
                <img src="${movie.Poster}" alt="${movie.Title}">
                <h2>${movie.Title}</h2>
                <p>${movie.Plot}</p>
            `;
        });
}

themeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeButton.textContent = document.body.classList.contains('dark-theme') ? 'Switch to Light Theme' : 'Switch to Dark Theme';
});

searchBox.addEventListener('input', (e) => {
  searchMovies(e.target.value);
});

showFavourites();
