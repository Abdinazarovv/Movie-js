// Select all elements from HTML
let elMovieCardTemplate = document.querySelector("#movie_card").content;
let elMoviesWrapper = document.querySelector(".movies_wrapper");
let elForm = document.querySelector(".form");
let elRating = document.querySelector(".movie__rating");
let elMovieYear = document.querySelector(".movie__year");
let elSelectCategories = document.querySelector(".movie__categories");
let elSelectSort = document.querySelector(".movie__select");
let elResult = document.querySelector(".result");


//How many movies do you need?
let newMovies = movies.slice(0, 151)

// Normolize
let normolizedArray = newMovies.map(function (item) {
    return {
        id: item.imdb_id,
        title: item.Title.toString(),
        movieYear: item.movie_year,
        categories: item.Categories.split("|"),
        rating: item.imdb_rating,
        summary: item.summary,
        img:  `https://i.ytimg.com/vi/${item.ytid}/mqdefault.jpg`,
        videoUrl:  `https://www.youtube.com/watch?v=${item.ytid}`
    }
});

// Categories
function generateCategories(array) {
    let newCategoriesArray = []
    
    for (let item of array) {
        let itemCategoriesArray = item.categories;
        for (let categoryItem of itemCategoriesArray) {
            if (!newCategoriesArray.includes(categoryItem)) {
                newCategoriesArray.push(categoryItem)
            }
        }
    }
    
    return newCategoriesArray
}

let categoryList = generateCategories(normolizedArray);

// Render Movies
function renderCategories(array, wrapper) {
    let newFragment = document.createDocumentFragment()
    for (const item of array) {
        let newOption = document.createElement("option");
        newOption.textContent = item;
        newOption.value = item;
        
        newFragment.appendChild(newOption);
    }
    
    wrapper.appendChild(newFragment);
}

renderCategories(categoryList, elSelectCategories)



function renderMovies(array) {
    elMoviesWrapper.innerHTML = null;
    elResult.textContent = array.length
    
    let elFragment = document.createDocumentFragment();
    
    for (const item of array) {
        let movieCard = elMovieCardTemplate.cloneNode(true);
        
        movieCard.querySelector(".card-img-top").src = item.img;
        movieCard.querySelector(".card__heading").textContent = item.title;
        movieCard.querySelector(".movie__year").textContent = item.movieYear;
        movieCard.querySelector(".movie__rating").textContent = item.categories;
        movieCard.querySelector(".movie__link").href = item.videoUrl;
        movieCard.querySelector(".moreinfo_btn").dataset.movieId = item.id;
        movieCard.querySelector(".movie__link").setAttribute("target", "blank");
        
        elFragment.appendChild(movieCard);     
    }
    
    elMoviesWrapper.appendChild(elFragment);      
}

renderMovies(normolizedArray);


elForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    
    let inputRating = elRating.value.trim();
    let inputYear = elMovieYear.value.trim();
    let selectedCategory = elSelectCategories.value.trim();
    let selectedSort = elSelectSort.value.trim();
    
    console.log(selectedSort);    
    
    let filteredMovies = normolizedArray.filter(function (item) {
        // 1-usul

        // let select
        
        // if (selectedCategory == "all") {
        //     select = true
        // }else {
        //     select = item.categories.includes(selectedCategory)
        // }
        
        // 2-usul

        let select = selectedCategory == "all" ? true : item.categories.includes(selectedCategory)
        
        let validation = item.rating >= inputRating && item.movieYear >= inputYear && select
        return validation
    });
    
    filteredMovies.sort((a, b) => {
        if (selectedSort == "rating-high-low") {
            return b.rating - a.rating
        } 
        
        if (selectedSort == "rating-low-high") {
            return a.rating - b.rating
        } 
        
        if (selectedSort == "year-high-low") {
            return b.movieYear - a.movieYear
        } 
        
        if (selectedSort == "year-low-high") {
            return a.movieYear - b.movieYear
        } 
    })
    
    renderMovies(filteredMovies);
});

let result = normolizedArray.sort(function (b, a) {
    return a.rating - b.rating
})

console.log(result);


elMoviesWrapper.addEventListener("click", function(evt) {
    let clickedMovieId = evt.target.dataset.movieId
    renderModal(normolizedArray, clickedMovieId);
})

function renderModal(array, id) {
    let foundMovie = array.find(function(item) {
        return item.id == id
    });
    
    staticBackdropLabel.textContent = foundMovie.title;
    modalBody.textContent = foundMovie.summary
}