(() => {
    const URL = 'https://www.omdbapi.com';
    const apiKey = `da16754b`; // If you want to use your own API key, replace this with your key.
    let searchPage = 1;

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

    getMovieBySearch('ejijio;jej');
    function onSearch(event) {
        
    }

})();