(() => {
    const URL = 'https://www.omdbapi.com';
    const apiKey = `da16754b`; // If you want to use your own API key, replace this with your key.
    let searchPage = 1;

    const homeBtn = document.getElementById('home-btn');
    const searchBtn = document.getElementById('search-btn');
    const main = document.querySelector('main');

    homeBtn.addEventListener('click', goToHome)
    searchBtn.addEventListener('click', goToSearch)

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
                <button type="submit" id="search-icon" class="material-symbols-outlined">search</span>
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

    // Function to fetch movies by search term
    async function getMovieBySearch(search) {
        const searchQuery = `/?s=${search}&page=${searchPage}&apikey=`;


        try {
        const response = await fetch(URL+searchQuery+apiKey);

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
        }   catch (error) {
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
        debugger
        movieList.innerHTML = "";
    
        const movies = await getMovieBySearch(search);
        movies.forEach(movie => createMovie(movie));
    }

    function createMovie(movie) {
        const div = document.createElement("div");

        div.classList.add("movie-card");

        let poster = movie.Poster === "N/A" ? "/images/no-poster.jpg" : movie.Poster;

        div.innerHTML = `
                <img class="card-img-top" src=${poster} alt="Card image cap" width="400" />
                    <div class="card-body">
                    <h4 class="card-title">${movie.Title}</h4>
                    <a href="details">
                    </a>
                    </div>
                    <div class="card-footer">
                    <button type="button" data-id=${movie.imdbID} class="btn btn-info">Details</button>
                    </div>
        `

        div.querySelector("button").addEventListener("click", showDetails)


        movieList.appendChild(div)
    }

    function showDetails(event) {
        const id = event.target.dataset.id;    
    }

})();