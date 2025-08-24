(() => {
    const URL = 'https://www.omdbapi.com';
    const apiKey = `da16754b`; // If you want to use your own API key, replace this with your key.
    let searchPage = 1;
    let favoritesPage = 1;

    const homeBtn = document.getElementById('home-btn');
    const searchBtn = document.getElementById('search-btn');
    const favoritesBtn = document.getElementById('favorites-btn');
    const main = document.querySelector('main');

    homeBtn.addEventListener('click', goToHome)
    searchBtn.addEventListener('click', goToSearch)
    favoritesBtn.addEventListener('click', goToFavorites)


    goToHome();


    function goToHome() {
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'))
        homeBtn.classList.add('active')
        main.innerHTML = `
        <div id="home">
        <div id="home-title">
        <h1>Welcome to Movie Search App</h1>
        <p>Use the search icon above to find your favorite movies!</p>
        </div>
        <img src="/images/home.jpg" alt="Movies" id="home-img">
        </div>`    }

    function goToSearch() {
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'))
        searchBtn.classList.add('active')
        main.innerHTML = `
        <div id="search">
            <form id="search-form">
                <input type="text" name="search" id="search-input" placeholder="Search movie title...">
                <button type="submit" id="search-icon" class="material-symbols-outlined">search</button>
            </form>
        </div>
        <div id="movies">
            <div id="missing">
                <img src="/images/missing.jpg" alt="Missing" id="missing-img">
                <h2>Search for movies to see results here</h2>
            </div>
        </div>
        `;

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', onSearch)

    }

    function goToFavorites() {
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'))
        favoritesBtn.classList.add('active')
        main.innerHTML = `
        <div id="favorites">
            <h1>Your Favorite Movies</h1>
            <p>Click the star icon on a movie card to remove it from your favorites.</
        </div>
        <div id="movies">
            <div id="missing">
                <img src="/images/missing.jpg" alt="Missing" id="missing-img">
                <h2>No favorites added yet</h2>
            </div>
        </div>
        `;
        const favorites = getFavorites();
        if (favorites && favorites.length > 0) {
            document.getElementById('missing').style.display = 'none';
            movieList = document.getElementById('movies');
            movieList.innerHTML = "";
            favorites.forEach(movie => createMovie(movie));
        }

        const favIcons = Array.from(document.querySelectorAll('.card-footer svg'));
        favIcons.forEach( el => el.addEventListener("click", removeOnClick))
    }

    function removeOnClick(event) {
        const parent = event.target.parentElement.parentElement.parentElement.parentElement;
        debugger
        parent.remove();
    }


    // Function to fetch movies by search term
    async function getMovieBySearch(search) {
        const searchQuery = `/?s=${search}&page=${searchPage}&apikey=`;


        try {
            const response = await fetch(URL + searchQuery + apiKey);

            // Response status error handling
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error);
            }

            const data = await response.json();

            // Data error handling
            if (data.Response === "False") {
                debugger
                throw new Error(data.Error);
            }

            return data.Search
        } catch (error) {
            alert(error.message);

        }


    }

    // Function to fetch movies by IMDB ID
    async function getMovieByID(movieID) {
        const searchQuery = `/?i=${movieID}&apikey=`;


        try {
            const response = await fetch(URL + searchQuery + apiKey);

            // Response status error handling
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error);
            }

            const data = await response.json();

            // Data error handling
            if (data.Response === "False") {
                debugger
                throw new Error(data.Error);
            }

            return data
        } catch (error) {
            alert(error.message);

        }

    }


    // Event handler for search form submission
    function onSearch(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const search = formData.get('search').trim();

        if (!search) {
            return;
        }

        showAllMovies(search);
    }



    let movieList = null;
    async function showAllMovies(search) {
        movieList = document.getElementById('movies');

        const movies = await getMovieBySearch(search);
        if (!movies) {
            return
        }

        movieList.innerHTML = "";
        movies.forEach(movie => createMovie(movie));
    }

    function createMovie(movie) {
        const div = document.createElement("div");

        div.classList.add("movie-card");

        let poster = movie.Poster === "N/A" ? "/images/no-poster.jpg" : movie.Poster;

        div.innerHTML = `
            <div class="card-img-top">
                <img src=${poster} alt="Card image"/>
            </div>
            <div class="card-body">
                <h4 class="card-title">${movie.Title}</h4>
                <p class="card-text">${movie.Year}</p>
            </div>
            <div class="card-footer">
                <button type="button" data-id=${movie.imdbID} class="btn btn-info">Details</button>
            </div>
        `


        div.querySelector("button").addEventListener("click", showDetails)

        const cardFooter = div.querySelector(".card-footer");
        const favorites = getFavorites();
        const favIcon = document.createElement("span");
        favIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2.5L14.5246 8.52504L21 9.4754L16.5 14.1246L17.5492 20.5L12 17.5L6.45078 20.5L7.5 14.1246L3 9.4754L9.4754 8.52504L12 2.5Z" />
</svg>`;
        if (!!favorites.find(f => f.imdbID === movie.imdbID)) {
            favIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="orange" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2.5L14.5246 8.52504L21 9.4754L16.5 14.1246L17.5492 20.5L12 17.5L6.45078 20.5L7.5 14.1246L3 9.4754L9.4754 8.52504L12 2.5Z" />
</svg>`
            favIcon.addEventListener("click", removeFromFavorites);
        } else {
            favIcon.style.FILL = 0;
            favIcon.addEventListener("click", addToFavorites);
        }

        function removeFromFavorites() {
            const updatedFavorites = getFavorites().filter(f => f.imdbID !== movie.imdbID);
            setFavorites(updatedFavorites);
            favIcon.style.FILL = 0;
            favIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2.5L14.5246 8.52504L21 9.4754L16.5 14.1246L17.5492 20.5L12 17.5L6.45078 20.5L7.5 14.1246L3 9.4754L9.4754 8.52504L12 2.5Z" />
</svg>`;
            favIcon.removeEventListener("click", removeFromFavorites);
            favIcon.addEventListener("click", addToFavorites);
        }

        function addToFavorites() {
            const movieToAdd = {
                Title: movie.Title,
                Year: movie.Year,
                imdbID: movie.imdbID,
                Type: movie.Type,
                Poster: movie.Poster
            };
            const updatedFavorites = getFavorites();
            updatedFavorites.push(movieToAdd);
            setFavorites(updatedFavorites);
            favIcon.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="orange" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 2.5L14.5246 8.52504L21 9.4754L16.5 14.1246L17.5492 20.5L12 17.5L6.45078 20.5L7.5 14.1246L3 9.4754L9.4754 8.52504L12 2.5Z" />
</svg>`
            favIcon.removeEventListener("click", addToFavorites);
            favIcon.addEventListener("click", removeFromFavorites);
        }

        cardFooter.appendChild(favIcon);
        movieList.appendChild(div)
    }

    // Function to show movie details   
    async function showDetails(event) {
        document.querySelectorAll('.active').forEach(btn => btn.classList.remove('active'))
        const id = event.target.dataset.id;

        const movie = await getMovieByID(id);
        if (!movie) {
            return;
        }

        main.innerHTML = `
        <div id="movie-details">
            <h1>${movie.Title} (${movie.Year})</h1>
        </div>
        <div id="movies">
            <div id="details-card">
                <div id="details-img">
                    <img src=${movie.Poster === "N/A" ? "/images/no-poster.jpg" : movie.Poster} alt="Movie Poster"/>
                </div>
                <div id="details-info">
                    <p><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Cast:</strong> ${movie.Actors}</p>
                    <p><strong>Plot:</strong> ${movie.Plot}</p>
                    <p><strong>IMDB Rating:</strong> ${movie.imdbRating}</p>
                </div>
                <div class="fav-icon">
                
                </div>
            </div>
        </div>
        `;

    }

    // localStorage functions for Favorites
    function setFavorites(data) {
        return localStorage.setItem("Favorites", JSON.stringify(data));

    }

    function getFavorites() {
        return JSON.parse(localStorage.getItem("Favorites"));
    }

})();