let elMovieCardTemplate = document.querySelector("#movie_card").content;
let elMoviesWrapper = document.querySelector(".movies_wrapper");
let elForm = document.querySelector(".form");
let elRating = document.querySelector(".movie__rating");
let elMovieYear = document.querySelector(".movie__year");
let elSelectCategories = document.querySelector(".movie__categories");
let elSelectSort = document.querySelector(".movie__select");
let elResult = document.querySelector(".result");
let elModalTitle = document.querySelector(".m_title");
let elModalBody = document.querySelector(".m_body");
let elBookmarkedList = document.querySelector(".bookmarked");


// 
let newMovies = movies.slice(0, 20)

let bookmarkedMovies = [];


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
        movieCard.querySelector(".btn_bookmark").dataset.bookmarkId = item.id;
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
    
    let filteredMovies = normolizedArray.filter(function (item) {      
        let select = selectedCategory == "all" ? true : item.categories.includes(selectedCategory)
        
        let validation = item.rating >= inputRating && item.movieYear >= inputYear && select
        return validation
    });
    
    if (selectedCategory == "none") {
        renderMovies(normolizedArray);       
    } else {
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
            
            if (selectedSort == "a-z") {
                if (a.title > b.title) {
                    return 1
                } else if (a.title < b.title) {
                    return -1
                }else {
                    return 0
                }
            } 
            
            if (selectedSort == "z-a") {
                if (a.title > b.title) {
                    return -1
                } else if (a.title < b.title) {
                    return 1
                }else {
                    return 0
                }
            } 
            
            
        })
        renderMovies(filteredMovies);       
    }
});


elMoviesWrapper.addEventListener("click", function(ok) {
    let currentId = ok.target.dataset.movieId
    if (currentId) {
        let foundMovie = normolizedArray.find(function(item) {
            return item.id == currentId
        })
        elModalTitle.textContent = foundMovie.title;
        elModalBody.textContent = foundMovie.summary;
    }
})

elMoviesWrapper.addEventListener("click", function(ok) {
    let currentId = ok.target.dataset.bookmarkId
    if (currentId) {
        let foundMovie = normolizedArray.find(function(item) {
            return item.id == currentId
        })
        
        
        if (bookmarkedMovies.length == 0) {
            bookmarkedMovies.unshift(foundMovie); 
        }else {
            let check
            for (const item of bookmarkedMovies) {
                if (item.id == currentId) {
                    check = true
                }
            }
            
            if (!check) {
                bookmarkedMovies.unshift(foundMovie); 
            }
        }
        console.log(bookmarkedMovies);
        console.log("______________________");
        renderBookmarks(bookmarkedMovies, elBookmarkedList)
    }
})


function renderBookmarks(array, wrapper) {
    wrapper.innerHTML = null

    let fragment = document.createDocumentFragment()
    
    for (const item of array) {
        let newLi = document.createElement("li");
        newLi.innerHTML = `
        <li class="list-group-item p-3">
        <h4 class="d-inline-block text-truncate h5" style="max-width: 100%;" >${item.title}</h4>
        <button class="btn btn-danger btn-sm d-block" type="button">Remove</button>
        </li>   
        `
        fragment.append(newLi);
    }

    wrapper.append(fragment)
}