let signBtn = document.getElementById("signButton");

signBtn.addEventListener('click', (event) => {
    event.preventDefault();
});



const newOnNetflixContainer = document.getElementById("newOnNetflix");
const netflixOriginalsContainer = document.getElementById("netflixOriginals");
const netflixTopRatedContainer = document.getElementById("netflixTopRated");

const trendingMovieUrl = 'https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045';
const netflixOriginalsUrl = 'https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213';
const netflixTopRatedUrl = 'https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1';

//Movies card section

let movieTrailer = document.getElementById("movieTrailer");
let movieTitle = document.getElementById("movieTitle");
let movieDetails = document.getElementById("movieDetails");
let movieDescription = document.getElementById("movieDescription");

let createAndAppendMovie = (movie, container) => {
    let divEl = document.createElement("div");
    let imgEl = document.createElement("img");

    divEl.classList.add("each-img-con");

    imgEl.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    imgEl.setAttribute("data-toggle", "modal");
    imgEl.setAttribute("data-target", "#staticBackdrop");
    imgEl.setAttribute("data-details", JSON.stringify(movie));
    imgEl.classList.add("each-movie-img");
    imgEl.id = movie.id;
    imgEl.addEventListener('click', (e) => handleMovie(e));

    divEl.appendChild(imgEl);
    container.appendChild(divEl);
};

let config = {
    method: "GET"
};


const getMovieTrailer = async (id) => {

    return await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`, config)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('something went wrong');
            }
        });
}

const handleMovie = (e) => {
    const movieTrailerObj = e.target.id;
    getMovieTrailer(movieTrailerObj)
        .then(function(data) {
            const results = data.results;
            const youtubeTrailer = results.filter(eachItem => {
                if (eachItem.type === 'Trailer' && eachItem.site === 'YouTube') {
                    return true;
                } else {
                    return false;
                }
            });
            movieTrailer.src = `https://www.youtube.com/embed/${youtubeTrailer[0].key}`;
            let movieResults = e.target.getAttribute('data-details');
            movieResults = JSON.parse(movieResults);
            movieTitle.textContent = movieResults.title;
            movieDescription.textContent = movieResults.overview;
            const datePublished = movieResults.release_date;
            movieDetails.textContent = datePublished.slice(0, 4);
        });
}



function fetchingNetflixMovies(url, container) {

    try {
        fetch(url, config)
            .then(function(response) {
                return response.json();
            })
            .then(function(jsonData) {
                let movies_results = jsonData.results;
                for (let eachMovie of movies_results) {
                    createAndAppendMovie(eachMovie, container);
                }
            });
    } catch (err) {
        createAndAppendMovie(err, container);
    }

}

fetchingNetflixMovies(trendingMovieUrl, newOnNetflixContainer);
fetchingNetflixMovies(netflixOriginalsUrl, netflixOriginalsContainer);
fetchingNetflixMovies(netflixTopRatedUrl, netflixTopRatedContainer);