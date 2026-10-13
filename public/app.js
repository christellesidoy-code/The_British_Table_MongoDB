/* =========================================================
   THE BRITISH TABLE
========================================================= */

const app = document.querySelector("#app");


let rows = [];


let state = {

    q: "",

    borough: "",

    cuisine: ""

};


/* =========================================================
   SAMPLE BRITISH RESTAURANTS
========================================================= */

const britishRestaurants = [

    {
        restaurant_id: "BT001",
        name: "The Crown & Kettle",
        cuisine: "Traditional British",
        borough: "Westminster",
        rating: 4.8,
        category: "English",
        image: "card1.jpg"
    },

    {
        restaurant_id: "BT002",
        name: "Yorkshire House",
        cuisine: "Sunday Roast",
        borough: "Camden",
        rating: 4.7,
        category: "English",
        image: "card2.jpg"
    },

    {
        restaurant_id: "BT003",
        name: "The Red Lion",
        cuisine: "Pub Classics",
        borough: "Islington",
        rating: 4.6,
        category: "Pub",
        image: "card3.jpg"
    },

    {
        restaurant_id: "BT004",
        name: "The Wellington",
        cuisine: "English Grill",
        borough: "Kensington",
        rating: 4.5,
        category: "Fine Dining",
        image: "card1.jpg"
    },

    {
        restaurant_id: "BT005",
        name: "The Old Mill",
        cuisine: "British Bistro",
        borough: "Southwark",
        rating: 4.4,
        category: "English",
        image: "card2.jpg"
    },

    {
        restaurant_id: "BT006",
        name: "The Harbour Room",
        cuisine: "British Seafood",
        borough: "Westminster",
        rating: 4.8,
        category: "English",
        keywords: "fish fish and chips chips seafood",
        image: "card3.jpg"
    },

    {
        restaurant_id: "BT007",
        name: "The Mayfair Fish House",
        cuisine: "British Seafood",
        borough: "Kensington",
        rating: 4.7,
        category: "Fine Dining",
        keywords: "fish fish and chips chips seafood",
        image: "card1.jpg"
    },

    {
        restaurant_id: "BT008",
        name: "The Old Anchor",
        cuisine: "British Seafood",
        borough: "Camden",
        rating: 4.5,
        category: "Pub",
        keywords: "fish fish and chips chips seafood",
        image: "card2.jpg"
    },

    {
        restaurant_id: "BT009",
        name: "Westminster Roast House",
        cuisine: "Sunday Roast",
        borough: "Westminster",
        rating: 4.7,
        category: "English",
        image: "card3.jpg"
    },

    {
        restaurant_id: "BT010",
        name: "The Garden Arms",
        cuisine: "Traditional British",
        borough: "Westminster",
        rating: 4.6,
        category: "Pub",
        image: "card1.jpg"
    },

    {
        restaurant_id: "BT011",
        name: "The Royal Breakfast",
        cuisine: "English Breakfast",
        borough: "Islington",
        rating: 4.5,
        category: "English",
        image: "card2.jpg"
    },

    {
        restaurant_id: "BT012",
        name: "The Pie & Crown",
        cuisine: "British Pies",
        borough: "Camden",
        rating: 4.4,
        category: "Pub",
        image: "card3.jpg"
    },

    {
        restaurant_id: "BT013",
        name: "The Grand Grill",
        cuisine: "English Grill",
        borough: "Westminster",
        rating: 4.8,
        category: "Fine Dining",
        image: "card1.jpg"
    },

    {
        restaurant_id: "BT014",
        name: "The Tea Room",
        cuisine: "Afternoon Tea",
        borough: "Kensington",
        rating: 4.6,
        category: "Fine Dining",
        image: "card2.jpg"
    },

    {
        restaurant_id: "BT015",
        name: "The Royal Arms",
        cuisine: "Pub Classics",
        borough: "Southwark",
        rating: 4.3,
        category: "Pub",
        image: "card3.jpg"
    }

];


/* =========================================================
   HELPERS
========================================================= */

function esc(value) {

    return String(value ?? "")
        .replace(/[&<>"']/g, char => ({

            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"

        }[char]));

}


function idOf(r) {

    return String(
        r?.restaurant_id ||
        r?._id ||
        ""
    );

}


function ratingOf(r) {

    if (r?.rating == null) {

        return "—";

    }

    return Number(r.rating).toFixed(1);

}


function stars(r) {

    if (r?.rating == null) {

        return "—";

    }

    return `★ ${ratingOf(r)}`;

}


function imageOf(r, index = 0) {

    return `/assets/${
        r?.image ||
        `card${(index % 3) + 1}.jpg`
    }`;

}


/* =========================================================
   ACTIVE NAV
========================================================= */

function setActive(page) {

    document
        .querySelectorAll(".main-nav button")
        .forEach(button => {

            button.classList.toggle(

                "active",

                button.dataset.page === page

            );

        });

}


/* =========================================================
   API
========================================================= */

async function getRows() {

    try {

        const response =
            await fetch(
                "/api/restaurants"
            );


        if (!response.ok) {

            throw new Error(
                "API error"
            );

        }


        rows =
            await response.json();


    } catch (error) {

        console.error("Could not load restaurants from the API:", error);
        rows = [];

    }


    return rows;

}


/* =========================================================
   SECTION HEADER
========================================================= */

function sectionHeader(
    eyebrow,
    title,
    description
) {

    return `

        <div class="section-head">

            <div class="eyebrow">
                ${eyebrow}
            </div>

            <h1>
                ${title}
            </h1>

            <p>
                ${description}
            </p>

        </div>

    `;

}


/* =========================================================
   RESTAURANT CARD
========================================================= */

function restaurantCard(
    restaurant,
    index = 0
) {

    return `

        <article
            class="restaurant-card"
            onclick="viewRestaurant('${esc(idOf(restaurant))}')"
        >

            <div class="restaurant-image">

                <img
                    src="${imageOf(restaurant, index)}"
                    alt="${esc(restaurant.name)}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="restaurant-card-body">

                <div class="card-small">
                    ${esc(
                        restaurant.cuisine ||
                        "British"
                    )}
                </div>


                <h3>
                    ${esc(
                        restaurant.name
                    )}
                </h3>


                <p class="restaurant-location">

                    ${esc(
                        restaurant.borough ||
                        "—"
                    )}

                </p>


                <div class="restaurant-bottom">

                    <span class="rating">
                        ${stars(restaurant)}
                    </span>


                    <button
                        class="view-button"
                        onclick="
                            event.stopPropagation();
                            viewRestaurant('${esc(idOf(restaurant))}')
                        "
                    >
                        View Details →
                    </button>

                </div>

            </div>

        </article>

    `;

}


/* =========================================================
   HOME
========================================================= */

async function home() {

    setActive("home");


    let data =
        britishRestaurants.slice(0, 3);


    app.innerHTML = `

        <section class="page home-page">

            <div class="hero">

                <div class="hero-copy">

                    <div class="eyebrow">
                        DISCOVER ENGLISH DINING
                    </div>


                    <h1>

                        Find your next

                        <br>

                        <span>
                            British table.
                        </span>

                    </h1>


                    <p>

                        Explore restaurants,
                        cuisines, boroughs,
                        and quality insights
                        in one place.

                    </p>


                    <div class="hero-buttons">

                        <button
                            class="primary-button"
                            onclick="show('restaurants')"
                        >
                            Explore Restaurants
                        </button>


                        <button
                            class="secondary-button"
                            onclick="show('cuisine')"
                        >
                            Search by Cuisine
                        </button>

                    </div>

                </div>


                <div class="hero-photo">

                    <img
                        src="/assets/hero.jpg"
                        alt="British dining"
                    >

                </div>

            </div>


            <div class="curated-heading">

                <div>

                    <div class="eyebrow">
                        CURATED DIRECTORY
                    </div>

                    <h2>
                        Popular English favourites
                    </h2>

                </div>


                <button
                    class="text-button"
                    onclick="show('restaurants')"
                >
                    View all restaurants →
                </button>

            </div>


            <div class="restaurant-grid">

                ${data
                    .map(restaurantCard)
                    .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   RESTAURANTS
========================================================= */

async function restaurants() {

    setActive("restaurants");


    const data =
        await getRows();


    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "RESTAURANTS",

                "Explore the directory",

                "Browse English restaurants by name, cuisine, borough, or quality."

            )}


            <div class="directory-controls">

                <div class="directory-search">

                    <span>
                        ⌕
                    </span>


                    <input
                        id="directoryInput"
                        placeholder="Search restaurants..."
                        oninput="liveDirectorySearch(this.value)"
                    >

                </div>


                <select
                    onchange="directoryCuisine(this.value)"
                >

                    <option value="">
                        All English
                    </option>

                    <option value="English">
                        English
                    </option>

                    <option value="Pub">
                        Pub
                    </option>

                    <option value="Fine Dining">
                        Fine Dining
                    </option>

                </select>

            </div>


            <div id="directoryResults">

                ${directoryTable(data)}

            </div>

        </section>

    `;

}


/* =========================================================
   DIRECTORY TABLE
========================================================= */

function directoryTable(data) {

    return `

        <div class="directory-table">

            <div class="directory-header">

                <div>
                    Restaurant
                </div>

                <div>
                    Cuisine
                </div>

                <div>
                    Borough
                </div>

                <div>
                    Rating
                </div>

                <div>
                    Status
                </div>

                <div>
                    Actions
                </div>

            </div>


            ${
                data.length

                ?

                data.map(r => `

                    <div class="directory-row">

                        <div>

                            <button
                                class="restaurant-name-button"
                                onclick="viewRestaurant('${esc(idOf(r))}')"
                            >
                                ${esc(r.name)}
                            </button>

                        </div>


                        <div>
                            ${esc(r.cuisine)}
                        </div>


                        <div>
                            ${esc(r.borough)}
                        </div>


                        <div class="rating">
                            ${stars(r)}
                        </div>


                        <div>

                            <span class="status">
                                Excellent
                            </span>

                        </div>


                        <div class="actions-cell">

                            <button
                                onclick="edit('${esc(idOf(r))}')"
                            >
                                Edit
                            </button>


                            <button
                                class="delete-button"
                                onclick="removeR('${esc(idOf(r))}')"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("")

                :

                `

                    <div class="empty">

                        No restaurants found.

                    </div>

                `

            }

        </div>

    `;

}


/* =========================================================
   DIRECTORY SEARCH
========================================================= */

async function liveDirectorySearch(value) {

    const query =
        value.toLowerCase().trim();

    const source = await getRows();

    let results =
        source.filter(r => {

            const text = `

                ${r.name}

                ${r.cuisine}

                ${r.borough}

            `.toLowerCase();


            return text.includes(query);

        });


    document.querySelector(
        "#directoryResults"
    ).innerHTML =
        directoryTable(results);

}


/* =========================================================
   DIRECTORY CATEGORY
========================================================= */

async function directoryCuisine(value) {

    const source = await getRows();

    if (!value) {

        document.querySelector(
            "#directoryResults"
        ).innerHTML =
            directoryTable(source);

        return;

    }


    const results =
        source.filter(
            restaurant =>
                categoryMatches(
                    restaurant,
                    value
                )
        );


    document.querySelector(
        "#directoryResults"
    ).innerHTML =
        directoryTable(results);

}


/* =========================================================
   CATEGORY MATCH
========================================================= */

function categoryMatches(
    restaurant,
    category
) {

    const text = `

        ${restaurant.name}

        ${restaurant.cuisine}

        ${restaurant.category}

        ${restaurant.keywords || ""}

    `.toLowerCase();


    if (category === "English") {

        return (
            text.includes("british") ||
            text.includes("english") ||
            text.includes("roast") ||
            text.includes("breakfast") ||
            text.includes("pie") ||
            text.includes("tea")
        );

    }


    if (category === "Pub") {

        return (
            text.includes("pub")
        );

    }


    if (category === "Fine Dining") {

        return (
            text.includes("fine") ||
            text.includes("grill") ||
            text.includes("seafood") ||
            text.includes("tea")
        );

    }


    return true;

}


/* =========================================================
   SEARCH
========================================================= */

async function search() {

    setActive("search");


    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "SEARCH",

                "Search the directory",

                "Find restaurants by name, cuisine, borough, or keyword."

            )}


            <div class="search-bar-large">

                <div class="search-input-wrap">

                    <span>
                        ⌕
                    </span>


                    <input
                        id="searchInput"
                        placeholder="Search the directory..."
                        onkeydown="
                            if(event.key === 'Enter')
                            doSearch()
                        "
                    >

                </div>


                <button
                    class="primary-button"
                    onclick="doSearch()"
                >
                    Search
                </button>

            </div>


            <div id="searchResults">

                <div class="search-placeholder">

                    <div class="search-icon">
                        ⌕
                    </div>


                    <h2>
                        Search the directory
                    </h2>


                    <p>
                        Try a restaurant name,
                        cuisine, borough, or keyword.
                    </p>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   SEARCH RESULT
========================================================= */

function doSearch() {

    const input =
        document.querySelector(
            "#searchInput"
        );


    const query =
        input.value
            .trim()
            .toLowerCase();


    let results;


    if (
        query.includes("fish") ||
        query.includes("chips")
    ) {

        results =
            britishRestaurants.filter(
                restaurant =>
                    restaurant.keywords
                        ?.includes("fish")
            );

    } else {

        results =
            britishRestaurants.filter(
                restaurant => {

                    const text = `

                        ${restaurant.name}

                        ${restaurant.cuisine}

                        ${restaurant.borough}

                        ${restaurant.keywords || ""}

                    `.toLowerCase();


                    return text.includes(query);

                }
            );

    }


    document.querySelector(
        "#searchResults"
    ).innerHTML = `

        <div class="search-result-heading">

            ${results.length}
            results found
            ${
                query
                    ? ` for “${esc(query)}”`
                    : ""
            }

        </div>


        ${
            results.length

            ?

            `

                <div class="result-grid">

                    ${results
                        .map(restaurantCard)
                        .join("")
                    }

                </div>

            `

            :

            `

                <div class="empty">

                    <strong>
                        No restaurants found.
                    </strong>

                    <span>
                        Try another search.
                    </span>

                </div>

            `
        }

    `;

}


/* =========================================================
   CUISINE SEARCH
========================================================= */

async function cuisine() {

    setActive("search");


    const cuisineList = [

        "Traditional British",

        "Fish & Chips",

        "Sunday Roast",

        "English Breakfast",

        "British Pies",

        "Pub Classics",

        "English Grill",

        "Afternoon Tea"

    ];


    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "CUISINE SEARCH",

                "What are you craving?",

                "Choose a cuisine to view matching restaurants."

            )}


            <div class="cuisine-grid">

                ${cuisineList
                    .map((name, index) => `

                        <button
                            class="cuisine-card"
                            onclick="
                                chooseCuisine('${esc(name)}')
                            "
                        >

                            <span
                                class="cuisine-number"
                            >
                                ${String(
                                    index + 1
                                ).padStart(2, "0")}
                            </span>


                            <strong>
                                ${esc(name)}
                            </strong>


                            <span
                                class="cuisine-link"
                            >
                                View restaurants →
                            </span>

                        </button>

                    `)
                    .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   CUISINE RESULTS
========================================================= */

function chooseCuisine(
    cuisineName
) {

    const keywords = {

        "Traditional British":
            ["traditional", "british"],

        "Fish & Chips":
            ["fish", "chips"],

        "Sunday Roast":
            ["roast"],

        "English Breakfast":
            ["breakfast"],

        "British Pies":
            ["pie"],

        "Pub Classics":
            ["pub"],

        "English Grill":
            ["grill"],

        "Afternoon Tea":
            ["tea"]

    };


    const selected =
        keywords[cuisineName];


    const results =
        britishRestaurants.filter(
            restaurant => {

                const text = `

                    ${restaurant.name}

                    ${restaurant.cuisine}

                    ${restaurant.keywords || ""}

                `.toLowerCase();


                return selected.some(
                    word =>
                        text.includes(
                            word.toLowerCase()
                        )
                );

            }
        );


    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "CUISINE SEARCH",

                cuisineName,

                "Choose a restaurant below."

            )}


            <div
                style="
                    margin-bottom:20px;
                    display:flex;
                    gap:10px;
                "
            >

                <button
                    class="secondary-button"
                    onclick="show('cuisine')"
                >
                    ← Back to cuisines
                </button>

            </div>


            <div class="result-grid">

                ${results
                    .map(restaurantCard)
                    .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   BOROUGH FILTER
========================================================= */

async function borough() {

    setActive("restaurants");


    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "FILTER BY BOROUGH",

                "Restaurants in Westminster",

                "Refine the directory by location and cuisine."

            )}


            <div class="borough-layout">


                <aside class="filter-sidebar">

                    <div class="filter-title">
                        FILTERS
                    </div>


                    <div class="filter-section">

                        <h4>
                            Borough
                        </h4>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="borough"
                                value=""
                                checked
                                onchange="applyBoroughFilter()"
                            >

                            All boroughs

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="borough"
                                value="Westminster"
                                onchange="applyBoroughFilter()"
                            >

                            Westminster

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="borough"
                                value="Camden"
                                onchange="applyBoroughFilter()"
                            >

                            Camden

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="borough"
                                value="Islington"
                                onchange="applyBoroughFilter()"
                            >

                            Islington

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="borough"
                                value="Kensington"
                                onchange="applyBoroughFilter()"
                            >

                            Kensington

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="borough"
                                value="Southwark"
                                onchange="applyBoroughFilter()"
                            >

                            Southwark

                        </label>

                    </div>


                    <div class="filter-section">

                        <h4>
                            Cuisine
                        </h4>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="filterCuisine"
                                value=""
                                checked
                                onchange="applyBoroughFilter()"
                            >

                            All cuisines

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="filterCuisine"
                                value="British"
                                onchange="applyBoroughFilter()"
                            >

                            British

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="filterCuisine"
                                value="Seafood"
                                onchange="applyBoroughFilter()"
                            >

                            Seafood

                        </label>


                        <label
                            class="filter-radio"
                        >

                            <input
                                type="radio"
                                name="filterCuisine"
                                value="Pub"
                                onchange="applyBoroughFilter()"
                            >

                            Pub

                        </label>

                    </div>

                </aside>


                <div class="borough-results">

                    <div
                        id="boroughResultCount"
                        style="
                            margin-bottom:17px;
                            color:#77746d;
                            font-size:10px;
                        "
                    >
                        15 restaurants
                    </div>


                    <div
                        id="boroughCards"
                        class="result-grid"
                    >

                        ${britishRestaurants
                            .map(restaurantCard)
                            .join("")
                        }

                    </div>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   BOROUGH FILTER FUNCTION
========================================================= */

function applyBoroughFilter() {

    const borough =
        document.querySelector(
            'input[name="borough"]:checked'
        )?.value || "";


    const cuisine =
        document.querySelector(
            'input[name="filterCuisine"]:checked'
        )?.value || "";


    const results =
        britishRestaurants.filter(
            restaurant => {

                const boroughMatch =
                    !borough ||
                    restaurant.borough === borough;


                let cuisineMatch = true;


                if (
                    cuisine === "British"
                ) {

                    cuisineMatch =
                        restaurant.cuisine
                            .toLowerCase()
                            .includes("british") ||
                        restaurant.category === "English";

                }


                if (
                    cuisine === "Seafood"
                ) {

                    cuisineMatch =
                        restaurant.cuisine
                            .toLowerCase()
                            .includes("seafood");

                }


                if (
                    cuisine === "Pub"
                ) {

                    cuisineMatch =
                        restaurant.category === "Pub";

                }


                return (
                    boroughMatch &&
                    cuisineMatch
                );

            }
        );


    document.querySelector(
        "#boroughResultCount"
    ).textContent =
        `${results.length} restaurants`;


    document.querySelector(
        "#boroughCards"
    ).innerHTML =

        results.length

        ?

        results
            .map(restaurantCard)
            .join("")

        :

        `

            <div class="empty">

                <strong>
                    No restaurants found.
                </strong>

                <span>
                    Try another filter.
                </span>

            </div>

        `;

}


/* =========================================================
   ADD RESTAURANT
========================================================= */

function add() {

    setActive("manage");


    app.innerHTML = `

        <section class="page">

            <div class="section-head">

                <div class="eyebrow">
                    DATABASE ACTION STATES
                </div>

                <h1>
                    Add, edit, and delete
                </h1>

                <p>
                    These states document the basic
                    database manipulation required
                    for the final application.
                </p>

            </div>


            <div class="crud-state">

                <div class="crud-number">
                    01
                </div>


                <div class="crud-content">

                    <div class="eyebrow">
                        ADD RESTAURANT
                    </div>


                    <h2>
                        Create a new database record
                    </h2>


                    <form
                        class="wireframe-form"
                        onsubmit="
                            saveRestaurant(event)
                        "
                    >

                        <label>

                            <span>
                                Restaurant Name
                            </span>

                            <input
                                name="name"
                                placeholder="The Garden Arms"
                                required
                            >

                        </label>


                        <label>

                            <span>
                                Cuisine
                            </span>

                            <input
                                name="cuisine"
                                placeholder="Traditional British"
                                required
                            >

                        </label>


                        <label>

                            <span>
                                Borough
                            </span>

                            <input
                                name="borough"
                                placeholder="Westminster"
                                required
                            >

                        </label>


                        <div class="crud-buttons">

                            <button
                                type="button"
                                class="secondary-button"
                                onclick="show('home')"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Save Restaurant
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   SAVE
========================================================= */

async function saveRestaurant(event) {

    event.preventDefault();


    const form =
        event.target;


    const data =
        Object.fromEntries(
            new FormData(form)
        );


    try {

        const response =
            await fetch(
                "/api/restaurants",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        if (!response.ok) {

            throw new Error(
                "Could not save"
            );

        }


        alert(
            "Restaurant added successfully!"
        );


        show("restaurants");


    } catch (error) {

        console.error(error);

        alert(
            "Restaurant could not be saved."
        );

    }

}


/* =========================================================
   MANAGEMENT
========================================================= */

async function manage() {

    setActive("manage");

    const data = await getRows();

    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "DATABASE MANAGEMENT",

                "Manage restaurants",

                "Add, edit, and delete records from the restaurant database."

            )}


            <div class="manage-header">

                <span>
                    Restaurant records
                </span>


                <button
                    class="primary-button"
                    onclick="add()"
                >
                    + Add Restaurant
                </button>

            </div>


            <div class="directory-table">

                <div
                    class="
                        directory-header
                        manage-grid
                    "
                >

                    <div>
                        Restaurant
                    </div>

                    <div>
                        Cuisine
                    </div>

                    <div>
                        Borough
                    </div>

                    <div>
                        Actions
                    </div>

                </div>


                ${data.map(
                    restaurant => `

                    <div
                        class="
                            directory-row
                            manage-grid
                        "
                    >

                        <div>

                            <button
                                class="
                                    restaurant-name-button
                                "
                                onclick="
                                    viewRestaurant(
                                        '${esc(
                                            idOf(
                                                restaurant
                                            )
                                        )}'
                                    )
                                "
                            >

                                ${esc(
                                    restaurant.name
                                )}

                            </button>

                        </div>


                        <div>
                            ${esc(
                                restaurant.cuisine
                            )}
                        </div>


                        <div>
                            ${esc(
                                restaurant.borough
                            )}
                        </div>


                        <div
                            class="actions-cell"
                        >

                            <button
                                onclick="
                                    edit(
                                        '${esc(
                                            idOf(
                                                restaurant
                                            )
                                        )}'
                                    )
                                "
                            >
                                Edit
                            </button>


                            <button
                                class="delete-button"
                                onclick="
                                    removeR(
                                        '${esc(
                                            idOf(
                                                restaurant
                                            )
                                        )}'
                                    )
                                "
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `).join("")}

            </div>

        </section>

    `;

}


/* =========================================================
   EDIT
========================================================= */

async function edit(id) {

    const source = await getRows();

    const restaurant =
        source.find(
            r =>
                idOf(r) === String(id)
        );


    if (!restaurant) {

        alert(
            "Restaurant not found."
        );

        return;

    }


    app.innerHTML = `

        <section class="page">

            <div class="crud-state">

                <div class="crud-number">
                    02
                </div>


                <div class="crud-content">

                    <div class="eyebrow">
                        EDIT RESTAURANT
                    </div>


                    <h2>
                        Update an existing record
                    </h2>


                    <form
                        class="wireframe-form"
                        onsubmit="
                            updateRestaurant(
                                event,
                                '${esc(id)}'
                            )
                        "
                    >

                        <label>

                            <span>
                                Restaurant Name
                            </span>

                            <input
                                name="name"
                                value="${esc(
                                    restaurant.name
                                )}"
                                required
                            >

                        </label>


                        <label>

                            <span>
                                Cuisine
                            </span>

                            <input
                                name="cuisine"
                                value="${esc(
                                    restaurant.cuisine
                                )}"
                                required
                            >

                        </label>


                        <label>

                            <span>
                                Borough
                            </span>

                            <input
                                name="borough"
                                value="${esc(
                                    restaurant.borough
                                )}"
                                required
                            >

                        </label>


                        <div class="crud-buttons">

                            <button
                                type="button"
                                class="secondary-button"
                                onclick="show('manage')"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   UPDATE
========================================================= */

async function updateRestaurant(
    event,
    id
) {

    event.preventDefault();


    const data =
        Object.fromEntries(
            new FormData(
                event.target
            )
        );


    try {

        const response =
            await fetch(
                `/api/restaurants/${id}`,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(data)

                }
            );


        if (!response.ok) {

            throw new Error(
                "Update failed"
            );

        }


        alert(
            "Restaurant updated successfully!"
        );


        show("manage");


    } catch (error) {

        alert(
            "Restaurant could not be updated."
        );

    }

}


/* =========================================================
   DELETE
========================================================= */

async function removeR(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this restaurant?"
        );


    if (!confirmed) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/restaurants/${id}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        alert(
            "Restaurant deleted."
        );


        show("manage");


    } catch (error) {

        alert(
            "Restaurant could not be deleted."
        );

    }

}


/* =========================================================
   VIEW DETAILS
========================================================= */

async function viewRestaurant(id) {

    const source = await getRows();

    let restaurant =
        source.find(
            r =>
                idOf(r) === String(id)
        );


    if (!restaurant) {

        alert(
            "Restaurant details not found."
        );

        return;

    }


    app.insertAdjacentHTML(
        "beforeend",

        `

        <div
            class="details-overlay"
            onclick="
                if(event.target === this)
                closeDetails()
            "
        >

            <div class="details-modal">

                <button
                    class="close-details"
                    onclick="closeDetails()"
                >
                    ×
                </button>


                <div class="details-photo">

                    <img
                        src="${imageOf(restaurant)}"
                        alt="${esc(
                            restaurant.name
                        )}"
                    >

                </div>


                <div class="details-info">

                    <div class="eyebrow">
                        RESTAURANT DETAILS
                    </div>


                    <h2>
                        ${esc(
                            restaurant.name
                        )}
                    </h2>


                    <div class="details-rating">

                        ${stars(restaurant)}

                    </div>


                    <div class="details-list">

                        <div>

                            <span>
                                Cuisine
                            </span>

                            <strong>
                                ${esc(
                                    restaurant.cuisine
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Borough
                            </span>

                            <strong>
                                ${esc(
                                    restaurant.borough
                                )}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Category
                            </span>

                            <strong>
                                ${esc(
                                    restaurant.category
                                )}
                            </strong>

                        </div>

                    </div>


                    <button
                        class="primary-button details-close-button"
                        onclick="closeDetails()"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

        `
    );

}


function closeDetails() {

    document
        .querySelector(
            ".details-overlay"
        )
        ?.remove();

}


/* =========================================================
   INSIGHTS
========================================================= */

function insights() {

    setActive("insights");


    const average =
        (
            britishRestaurants.reduce(
                (sum, r) =>
                    sum + r.rating,
                0
            )
            /
            britishRestaurants.length
        ).toFixed(2);


    app.innerHTML = `

        <section class="page">

            ${sectionHeader(

                "DATABASE INSIGHTS",

                "Restaurant quality at a glance",

                "Explore quality information from the restaurant directory."

            )}


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(4,1fr);
                    gap:12px;
                    margin-bottom:30px;
                "
            >

                <div class="crud-state"
                    style="
                        display:block;
                        padding:20px;
                        margin:0;
                    "
                >

                    <div class="eyebrow">
                        TOTAL RESTAURANTS
                    </div>

                    <h2 style="margin:0;">
                        128
                    </h2>

                </div>


                <div class="crud-state"
                    style="
                        display:block;
                        padding:20px;
                        margin:0;
                    "
                >

                    <div class="eyebrow">
                        ENGLISH CUISINE
                    </div>

                    <h2 style="margin:0;">
                        42
                    </h2>

                </div>


                <div class="crud-state"
                    style="
                        display:block;
                        padding:20px;
                        margin:0;
                    "
                >

                    <div class="eyebrow">
                        AVERAGE RATING
                    </div>

                    <h2 style="margin:0;">
                        ${average}
                    </h2>

                </div>


                <div class="crud-state"
                    style="
                        display:block;
                        padding:20px;
                        margin:0;
                    "
                >

                    <div class="eyebrow">
                        BOROUGHS
                    </div>

                    <h2 style="margin:0;">
                        18
                    </h2>

                </div>

            </div>


            <div class="crud-state">

                <div class="crud-number">
                    01
                </div>


                <div class="crud-content">

                    <div class="eyebrow">
                        AVERAGE RATING BY CUISINE
                    </div>


                    <h2>
                        Restaurant quality
                    </h2>


                    <p>
                        Traditional British
                        <br>
                        ★ 4.8
                    </p>


                    <p>
                        Sunday Roast
                        <br>
                        ★ 4.7
                    </p>


                    <p>
                        Fish & Chips
                        <br>
                        ★ 4.67
                    </p>


                    <p>
                        English Breakfast
                        <br>
                        ★ 4.5
                    </p>


                    <p>
                        Pub Classics
                        <br>
                        ★ 4.45
                    </p>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   ROUTER
========================================================= */

function show(page) {

    if (page === "home") {

        home();

        return;

    }


    if (page === "restaurants") {

        restaurants();

        return;

    }


    if (page === "search") {

        search();

        return;

    }


    if (page === "insights") {

        insights();

        return;

    }


    if (page === "cuisine") {

        cuisine();

        return;

    }


    if (page === "borough") {

        borough();

        return;

    }


    if (page === "manage") {

        manage();

        return;

    }

}


/* =========================================================
   START WEBSITE
========================================================= */

home();