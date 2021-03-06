const movies = document.querySelector(".movies");

const prev = document.querySelector(".btn-prev");
const next = document.querySelector(".btn-next");

const moviePoster = document.querySelectorAll(".movie__poster");
const movieTitle = document.querySelectorAll(".movie__title");
const movieRating = document.querySelectorAll(".movie__rating");

const videoLink = document.querySelector(".highlight__video-link");
const highlightVideo = document.querySelector(".highlight__video");
const highlightRating = document.querySelector(".highlight__rating");
const highlightGenreRating = document.querySelector(".highlight__genre-launch");
const highlightTitle = document.querySelector(".highlight__title");
const highlightGenre = document.querySelector(".highlight__genres");
const highligthLaunch = document.querySelector(".highlight__launch");
const highlightInfo = document.querySelector(".highlight__info");
const highlightDescription = document.querySelector(".highlight__description");

const modal = document.querySelector(".modal");
const modalImg = document.querySelector(".modal__img");
const modalTitle = document.querySelector(".modal__title");
const modalAverage = document.querySelector(".modal__average");
const modalGenres = document.querySelector(".modal__genres");
const modalDescrip = document.querySelector(".modal__description");
const closeModal = document.querySelector(".modal__close");

const genre = document.querySelectorAll(".genre");

const searchInput = document.querySelector(".input");

const themeBtn = document.querySelector(".btn-theme");
const body = document.querySelector("body");
const subtitle = document.querySelector(".subtitle");

const currentTheme = localStorage.getItem("light");

function addMovie(position, movieIndex, movies) {
   if (!movies[movieIndex].poster_path) {
      moviePoster[position].src = "./assets/grey.jpg";
   } else {
      moviePoster[position].src = movies[movieIndex].poster_path;
   }

   movieTitle[position].textContent = movies[movieIndex].title.slice(0, 10) + "...";
   movieRating[position].append(movies[movieIndex].vote_average);

   moviePoster[position].setAttribute("id", movies[movieIndex].id);
}

function homePage() {
   fetch(
      "https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false"
   ).then((resposta) => {
      const promiseBody = resposta.json();

      promiseBody.then((bodyResposta) => {
         const pages = {
            1: 0,
            2: 5,
            3: 10,
            4: 15,
         };
         for (let i = 0; i < 5; i++) {
            addMovie(i, i, bodyResposta.results);
         }

         let pageNumber = 1;

         next.addEventListener("click", function () {
            if (pageNumber == 4) {
               pageNumber = 1;
            } else {
               pageNumber++;
            }
            for (let j = 0; j < 5; j++) {
               addMovie(j, pages[pageNumber] + j, bodyResposta.results);
            }
         });

         prev.addEventListener("click", function () {
            if (pageNumber == 1) {
               pageNumber = 4;
            } else {
               pageNumber--;
            }
            for (let k = 0; k < 5; k++) {
               addMovie(k, pages[pageNumber] + k, bodyResposta.results);
            }
         });
      });
   });
}

homePage();

modal.addEventListener("click", function () {
   modal.classList.add("hidden");
});

fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR").then(
   (resposta) => {
      const promiseBody = resposta.json();

      promiseBody.then((bodyResposta) => {
         highlightTitle.textContent = bodyResposta.title;
         highlightRating.textContent = bodyResposta.vote_average;
         const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
         };
         highligthLaunch.textContent = new Date(bodyResposta.release_date)
            .toLocaleDateString("pt-BR", options)
            .toUpperCase();
         highlightDescription.textContent = bodyResposta.overview;

         let genreName = [];
         for (let j = 0; j < bodyResposta.genres.length; j++) {
            genreName.push(bodyResposta.genres[j].name);
         }

         highlightGenre.textContent = genreName.join(", ").toUpperCase();

         const posterDiv = document.createElement("div");
         posterDiv.classList.add("video__poster");

         const videoPoster = document.createElement("img");
         videoPoster.src = bodyResposta.backdrop_path;

         posterDiv.append(videoPoster);
         highlightVideo.append(posterDiv);
      });
   }
);

fetch(
   "https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR"
).then((resposta) => {
   const promiseBody = resposta.json();

   promiseBody.then((bodyResposta) => {
      videoLink.href = "https://www.youtube.com/watch?v=" + bodyResposta.results[0].key;
   });
});

moviePoster.forEach((poster) => {
   poster.addEventListener("click", function (event) {
      fetch(
         `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${event.target.id}?language=pt-BR`
      ).then((resposta) => {
         const promise = resposta.json();

         promise.then((bodyResposta) => {
            modalImg.src = bodyResposta.backdrop_path;
            modalTitle.textContent = bodyResposta.title;
            modalAverage.textContent = bodyResposta.vote_average;
            modalDescrip.textContent = bodyResposta.overview;
            modal.classList.remove("hidden");

            for (let j = 0; j < bodyResposta.genres.length; j++) {
               genre[j].textContent = bodyResposta.genres[j].name;
            }
         });
      });
   });
});

function removeMovie(position) {
   moviePoster[position].src = "./assets/grey.jpg";
   movieTitle[position].textContent = "";
   movieRating[position].textContent = "";
}

searchInput.addEventListener("keydown", function (event) {
   if (event.code == "Enter") {
      if (searchInput.value == "") {
         homePage();
         searchInput.value = "";
      } else {
         for (let i = 0; i < 5; i++) removeMovie(i);
         fetch(
            `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${searchInput.value}`
         ).then((resposta) => {
            const promise = resposta.json();

            promise.then((bodyResposta) => {
               let limit = bodyResposta.results.length > 5 ? 5 : bodyResposta.results.length;
               for (let i = 0; i < limit; i++) addMovie(i, i, bodyResposta.results);

               const pages = 4;
               let pageNumber = 0;

               next.addEventListener("click", function (event) {
                  event.preventDefault();
                  for (let i = 0; i < 5; i++) removeMovie(i);
                  if (pageNumber == pages - 1) {
                     pageNumber = 0;
                  } else {
                     pageNumber++;
                  }
                  for (let j = 0; j < 5; j++) {
                     addMovie(j, pageNumber * 5 + j, bodyResposta.results);
                  }
               });

               prev.addEventListener("click", function (event) {
                  event.preventDefault();
                  for (let i = 0; i < 5; i++) removeMovie(i);
                  if (pageNumber == 0) {
                     pageNumber = pages - 1;
                  } else {
                     pageNumber--;
                  }
                  for (let k = 0; k < 5; k++) {
                     addMovie(k, pageNumber * 5 + k, bodyResposta.results);
                  }
               });
               searchInput.value = "";
            });
         });
      }
   }
});
