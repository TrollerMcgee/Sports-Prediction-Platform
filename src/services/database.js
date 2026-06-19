const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand
} = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1"
});

const db = DynamoDBDocumentClient.from(client);

async function getGames() {
    const response = await db.send(
        new ScanCommand({
            TableName: "CloudPlayGames"
        })
    );

    return (response.Items || []).sort((a, b) =>
        a.gameDate.localeCompare(b.gameDate)
    );
}

async function getPrediction(predictionId) {
    const response = await db.send(
        new GetCommand({
            TableName: "CloudPlayPredictions",
            Key: {
                predictionId
            }
        })
    );

    return response.Item;
}

async function savePrediction(prediction) {
    await db.send(
        new PutCommand({
            TableName: "CloudPlayPredictions",
            Item: prediction,
            ConditionExpression: "attribute_not_exists(predictionId)"
        })
    );
}

async function saveUser(user) {
    await db.send(
        new PutCommand({
            TableName: "CloudPlayUsers",
            Item: user
        })
    );
}

async function getUsers() {
    const response = await db.send(
        new ScanCommand({
            TableName: "CloudPlayUsers"
        })
    );

    return response.Items || [];
}

module.exports = {
    getGames,
    getPrediction,
    savePrediction,
    saveUser,
    getUsers
};