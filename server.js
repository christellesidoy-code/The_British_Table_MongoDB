require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
const DB_NAME = process.env.DB_NAME || "restaurants";
const COLLECTION = process.env.COLLECTION || "restaurants";

let collection = null;

async function connectMongo() {
    if (!MONGO_URI) {
        console.log("MongoDB URI not found. Using local demo data.");
        return;
    }

    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();

        collection = client
            .db(DB_NAME)
            .collection(COLLECTION);

        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
}

connectMongo();

const fallback = require("./public/seed.json");

function calculateRating(restaurant) {
    const grades = Array.isArray(restaurant.grades)
        ? restaurant.grades
        : [];

    if (!grades.length) {
        return null;
    }

    const scores = grades
        .map(g => Number(g.score))
        .filter(n => !Number.isNaN(n));

    if (!scores.length) {
        return null;
    }

    const averageScore =
        scores.reduce((a, b) => a + b, 0) / scores.length;

    return Math.max(
        0,
        Math.min(5, 5 - averageScore / 10)
    );
}

function cleanRestaurant(restaurant) {
    return {
        ...restaurant,
        _id: restaurant._id
            ? String(restaurant._id)
            : restaurant._id,
        rating: calculateRating(restaurant)
    };
}

async function getAllRestaurants() {
    if (collection) {
        const documents = await collection
            .find({})
            .toArray();

        return documents.map(cleanRestaurant);
    }

    return fallback.map(cleanRestaurant);
}

app.get("/api/restaurants", async (req, res) => {
    try {
        let restaurants;

        const {
            q = "",
            borough = "",
            cuisine = "",
            grade = "",
            maxScore = ""
        } = req.query;

        if (collection) {
            const query = {};

            if (borough) {
                query.borough = borough;
            }

            if (cuisine) {
                query.cuisine = {
                    $regex: cuisine,
                    $options: "i"
                };
            }

            if (q) {
                query.name = {
                    $regex: q,
                    $options: "i"
                };
            }

            restaurants = await collection
                .find(query)
                .limit(1000)
                .toArray();

            if (grade) {
                restaurants = restaurants.filter(
                    restaurant =>
                        Array.isArray(restaurant.grades) &&
                        restaurant.grades.some(
                            g => g.grade === grade
                        )
                );
            }

            if (maxScore !== "") {
                restaurants = restaurants.filter(
                    restaurant =>
                        Array.isArray(restaurant.grades) &&
                        restaurant.grades.some(
                            g =>
                                Number(g.score) <=
                                Number(maxScore)
                        )
                );
            }

            restaurants = restaurants
                .map(cleanRestaurant)
                .sort((a, b) =>
                    String(a.name || "").localeCompare(
                        String(b.name || "")
                    )
                )
                .slice(0, 250);
        } else {
            restaurants = fallback
                .map(cleanRestaurant)
                .filter(restaurant => {
                    const name = String(restaurant.name || "")
                        .toLowerCase();

                    const search = String(q || "")
                        .toLowerCase();

                    const cuisineMatch =
                        !cuisine ||
                        String(restaurant.cuisine || "")
                            .toLowerCase()
                            .includes(
                                String(cuisine).toLowerCase()
                            );

                    const boroughMatch =
                        !borough ||
                        restaurant.borough === borough;

                    const nameMatch =
                        !search ||
                        name.includes(search);

                    const gradeMatch =
                        !grade ||
                        (
                            Array.isArray(restaurant.grades) &&
                            restaurant.grades.some(
                                g => g.grade === grade
                            )
                        );

                    const scoreMatch =
                        !maxScore ||
                        (
                            Array.isArray(restaurant.grades) &&
                            restaurant.grades.some(
                                g =>
                                    Number(g.score) <=
                                    Number(maxScore)
                            )
                        );

                    return (
                        nameMatch &&
                        cuisineMatch &&
                        boroughMatch &&
                        gradeMatch &&
                        scoreMatch
                    );
                });
        }

        res.json(restaurants);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.get("/api/insights", async (req, res) => {
    try {
        const restaurants = await getAllRestaurants();

        const validRatings = restaurants.filter(
            restaurant => restaurant.rating !== null
        );

        const boroughs = new Set(
            restaurants
                .map(r => r.borough)
                .filter(Boolean)
        );

        const cuisineRatings = {};

        restaurants.forEach(restaurant => {
            if (
                restaurant.cuisine &&
                restaurant.rating !== null
            ) {
                if (!cuisineRatings[restaurant.cuisine]) {
                    cuisineRatings[restaurant.cuisine] = [];
                }

                cuisineRatings[restaurant.cuisine].push(
                    restaurant.rating
                );
            }
        });

        const averages = Object.entries(cuisineRatings)
            .map(([cuisine, ratings]) => {
                const average =
                    ratings.reduce((a, b) => a + b, 0) /
                    ratings.length;

                return {
                    cuisine,
                    average
                };
            })
            .sort((a, b) => b.average - a.average)
            .slice(0, 8);

        const highest = validRatings.length
            ? Math.max(
                ...validRatings.map(r => r.rating)
            )
            : 0;

        const average = validRatings.length
            ? validRatings.reduce(
                (total, r) => total + r.rating,
                0
            ) / validRatings.length
            : 0;

        const total = collection
            ? await collection.countDocuments()
            : restaurants.length;

        res.json({
            total,
            boroughs: boroughs.size,
            highest,
            average,
            averages
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/api/restaurants", async (req, res) => {
    try {
        const restaurant = {
            name: req.body.name,
            cuisine: req.body.cuisine,
            borough: req.body.borough,
            grades: []
        };

        if (
            !restaurant.name ||
            !restaurant.cuisine ||
            !restaurant.borough
        ) {
            return res.status(400).json({
                error: "All fields are required."
            });
        }

        if (collection) {
            const result = await collection.insertOne(restaurant);

            return res.status(201).json({
                ...restaurant,
                _id: String(result.insertedId)
            });
        }

        restaurant.restaurant_id = String(Date.now());

        fallback.push(restaurant);

        res.status(201).json(
            cleanRestaurant(restaurant)
        );
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.put("/api/restaurants/:id", async (req, res) => {
    try {
        const update = {
            $set: {
                name: req.body.name,
                cuisine: req.body.cuisine,
                borough: req.body.borough
            }
        };

        if (collection) {
            let filter;

            if (ObjectId.isValid(req.params.id)) {
                filter = {
                    _id: new ObjectId(req.params.id)
                };
            } else {
                filter = {
                    restaurant_id: req.params.id
                };
            }

            const result = await collection.updateOne(
                filter,
                update
            );

            if (!result.matchedCount) {
                return res.status(404).json({
                    error: "Restaurant not found."
                });
            }

            return res.json({
                success: true
            });
        }

        const index = fallback.findIndex(
            restaurant =>
                String(restaurant.restaurant_id) ===
                String(req.params.id)
        );

        if (index === -1) {
            return res.status(404).json({
                error: "Restaurant not found."
            });
        }

        fallback[index].name = req.body.name;
        fallback[index].cuisine = req.body.cuisine;
        fallback[index].borough = req.body.borough;

        res.json(cleanRestaurant(fallback[index]));
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.delete("/api/restaurants/:id", async (req, res) => {
    try {
        if (collection) {
            let filter;

            if (ObjectId.isValid(req.params.id)) {
                filter = {
                    _id: new ObjectId(req.params.id)
                };
            } else {
                filter = {
                    restaurant_id: req.params.id
                };
            }

            const result = await collection.deleteOne(filter);

            if (!result.deletedCount) {
                return res.status(404).json({
                    error: "Restaurant not found."
                });
            }

            return res.json({
                success: true
            });
        }

        const index = fallback.findIndex(
            restaurant =>
                String(restaurant.restaurant_id) ===
                String(req.params.id)
        );

        if (index >= 0) {
            fallback.splice(index, 1);
        }

        res.json({
            success: true
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

const server = app.listen(PORT, () => {
    console.log(
        `The British Table running at http://localhost:${server.address().port}`
    );
});

server.on("error", error => {
    if (error.code === "EADDRINUSE") {
        const newPort = Number(PORT) + 1;

        const retry = app.listen(newPort, () => {
            console.log(`Port ${PORT} is busy.`);

            console.log(
                `The British Table is now running at http://localhost:${newPort}`
            );
        });

        retry.on("error", retryError => {
            console.error(
                "Server could not start:",
                retryError.message
            );

            process.exit(1);
        });
    } else {
        console.error(
            "Server could not start:",
            error.message
        );

        process.exit(1);
    }
});