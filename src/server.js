const express = require("express");
const path = require("path");
const { randomUUID } = require("crypto");
require("dotenv").config();

const {
    getGames,
    getPrediction,
    savePrediction,
    saveUser,
    getUsers
} = require("./services/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/games", async (req, res) => {
    try {
        const games = await getGames();

        res.render("games", {
            games
        });
    } catch (error) {
        console.error("Unable to load games:", error);

        res.status(500).render("result", {
            success: false,
            message: "Unable to load games from DynamoDB."
        });
    }
});

app.post("/predictions", async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const { gameId, predictedWinner } = req.body;

        if (!username || !gameId || !predictedWinner) {
            return res.status(400).render("result", {
                success: false,
                message: "Please complete every field."
            });
        }

        const duplicateId = `${username.toLowerCase()}-${gameId}`;
        const existingPrediction = await getPrediction(duplicateId);

        if (existingPrediction) {
            return res.status(409).render("result", {
                success: false,
                message: "You already submitted a prediction for this game."
            });
        }

        const prediction = {
            predictionId: duplicateId,
            submissionReference: randomUUID(),
            username,
            gameId,
            predictedWinner,
            submittedAt: new Date().toISOString(),
            isCorrect: false,
            pointsEarned: 0
        };

        await savePrediction(prediction);

        const users = await getUsers();
        const existingUser = users.find(
            (user) =>
                user.username.toLowerCase() === username.toLowerCase()
        );

        const updatedUser = existingUser || {
            username,
            points: 0,
            correctPredictions: 0,
            totalPredictions: 0
        };

        updatedUser.totalPredictions += 1;

        await saveUser(updatedUser);

        res.render("result", {
            success: true,
            message: `Your prediction for ${predictedWinner} was saved in DynamoDB.`
        });
    } catch (error) {
        console.error("Prediction submission failed:", error);

        res.status(500).render("result", {
            success: false,
            message: "The prediction could not be saved."
        });
    }
});

app.get("/leaderboard", async (req, res) => {
    try {
        const users = await getUsers();

        users.sort((a, b) => {
            if (b.points !== a.points) {
                return b.points - a.points;
            }

            return a.username.localeCompare(b.username);
        });

        res.render("leaderboard", {
            users
        });
    } catch (error) {
        console.error("Unable to load leaderboard:", error);

        res.status(500).render("result", {
            success: false,
            message: "Unable to load the leaderboard."
        });
    }
});

app.use((req, res) => {
    res.status(404).send("Page not found.");
});

app.listen(PORT, () => {
    console.log(`CloudPlay is running at http://localhost:${PORT}`);
});