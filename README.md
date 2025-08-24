# Movie Search App
by Emil Omayski

**Movies Search and Collect Application for Sirma Academy JS Advance Exam**

![Title Screenshot](/screenshots/image.png)
*Placeholder image for the home screen* 

## 1. The Project

The Project is **JavaScript** application that interacts with public **REST API** - [The Open Movie Database (OMDb API)](https://www.omdbapi.com/) and allows users to search by title for movies and other media and to collect, to view details for the media and to collect favorites titles in localStorage.

## 2. Technical details

- Technologies - only HTML, CSS  and JS (no frame works like React). Don`t know about libraries like lit-html and page so no experiments on my site.
- DOM manipulations
- Events
- HTTP requests - fetch() with async/await.
- Try/catch for errors

## 3. Design

I went through a few mockup designs in Figma for inspiration, but overall I was disappointed. The designs were either terribly boring (mostly black and gray) or relied on very high-quality images, which OMDb does not provide. That's why I chose a more unconventional option. Maybe even too unconventional :sweat_smile:.

I tried to apply some sort of Glassmorphism design. Relatively modern look with transparent and blurred elements and, I think, a nice gradient that is slightly animated. My other decision was to use as many icons as possible in the interface to mimic a mobile design, which turned out to be an interesting result.

![Search Results View](/screenshots/2025-08-24%2007-42-03.png)
*Search Results View* :heart_eyes:

## 4. The REST API Specifics

#### *4.1. Limited responses and pagination*

OMDb is very content-rich API. From every request can be expected hundreds results but only if the "*page*" parameter is used. Otherwise every search request returns only 10 results. Every request with page parameter also returns 10 results. OMDb does not support custom *start* and *skip* parameters.

My query parameters are `/?s=${search}&page=${searchPage}&apikey=` for search requests and `/?i=${movieID}&apikey=` for details. I am using `event.target.dataset.id` for *movieID* (imdbID)

#### *4.2. Server errors with status code 200* :eyes:

If "Movie not found", OMDb returns that the request was successful and a simple JSON object, one of whose keys is "Error". This forced me to perform two checks: one for a classic error and one for a *"successfully"* returned *Error*. My code is as follows:

```JavaScript
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
        throw new Error(data.Error);
    }

    return data
    } catch (error) {
        alert(error.message);
        }
```

There are also problems with the posters. Some requests *successfully* return posters with a value of N/A, which I solved by finding a placeholder image for the missing posters so that the user does not think the problem with the missing posters is with the application.

![N/A poster result](/screenshots/no-poster-response.png)
*N/A poster result*

There is a problem with Amazon's server for some posters that I am not figured out yet.


#### *4.3. Different format posters*

Different format posters and some very long movie titles make it very difficult, аt least for me, to align the parts of the films cards with each other in the same way. This given me the opportunity to try **subgrid** in **CSS** and to set same grid parameters to DOM Elements without direct common parent.

```CSS
#movies{
    width: 80%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(3, auto);
    gap: 20px;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.movie-card{
    position: relative;
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
    background: rgb(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgb(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.35);
    border-radius: 20px;
    width: 100%;
}
```

## 5. App Functionality

#### 5.1. App Loading

Depending if there are favorites in localStorage or not, the app loads in **Home** view if localStorage is empty or in **Favorites** view if there are already added favorites.

#### 5.2. Searching for movies

To add new favorites the user first have to go to search section and to find his favorite movies.

The search section is accessing throw magnifier icon in top navigational menu.

There is search form in search section which the user shall use. The user must input in the input field his search team. If input form is empty on submit the app doesn't do nothing.

If search term is submitted but movie is not found the user receives browser alert with server message *"Movie not found!"*

After every search the search form are reset (emptied).

If movie or movies are found they are rendered in the search view. No more then 10 movies are send from the server on one page.

If the user wants to see next pages with results there are navigation buttons bellow rendered movies.

If the user is on first page there are button only for next page because there is no previous page and such button will be misleading. Also if the user is on the last page there is no button for next page.

#### 5.3. Adding movies to favorites

Every movie card has star icon showing if this movie is in the favorites (the start is orange) or not (the star is empty).

The user can add or remove every movie by clicking on its star icon. If clicked the icon changes its view.

#### 5.4 Favorites view

The favorites view are either rendered on load or can be accessed from book icon on the navigational menu.

When accessed favorites view loads all movies in localStorage.

All movies in favorites view are with orange star icons because they are added to favorites.

If the user clicks on movies star icon this movie is remover from Favorites in localStorage and on click is removed from favorites view.

#### 5.5. Movie details

Both in search view and in favorites view the movies have details button for accessing details view for every movie.

From clicked details button (button dataset) the app takes imdbID of the movie and sends search by id to the OMDb API.

After receiving the data the app is rending details view for the movie with Genre, Director, Cast, Plot and IMDB rating.

In details view the movie also have star icon for managing its favorites status. The icon is in upper right corner of the poster.

This is in general for the app. I am attaching short video demonstration of its functionality.

![Short Video](/screenshots/video.gif)


## 6. Conclusions

The program certainly has its flaws. The CSS isn't polished enough and there is some repetitive code, but it works, and working on it was extremely satisfying and helpful.

I learned so much and applied old knowledge. Maybe the only drawback of the task is that only GET requests are made, but it was still very interesting.

I have to admit I wasn't very sure what to write in this README. I hope it don't look ridiculous. This is the first README I've ever written, and it was a very interesting experience. I was also intimidated to work with GitHub until now, but I'm starting to get used to it and to appreciate it.