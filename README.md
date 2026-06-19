# CloudPlay

## Cloud-Based Sports Prediction Competition Platform

CloudPlay is a cloud-hosted sports prediction application developed for the CS 351 Cloud Computing final project.

The platform allows users to view upcoming NBA games, submit winner predictions, earn points for correct predictions, and compare their results on a leaderboard.

This project does not include gambling, financial wagering, or monetary prizes.

## Team Members

- Andrew Gu — Cloud Infrastructure Developer and System Architecture Lead
- Omar Ibnouf — Project Manager, Backend Developer, Documentation Lead, and System Tester

## Main Features

- Publicly accessible sports prediction website
- Displays upcoming sample NBA games
- Allows multiple users to submit predictions
- Stores games, users, and predictions in Amazon DynamoDB
- Uses AWS Lambda to process results and award points
- Displays a points-based leaderboard
- Runs continuously on Amazon EC2 using PM2
- Uses Amazon CloudWatch for monitoring and CPU alarms
- Stores screenshots and documentation in Amazon S3
- Uses IAM roles instead of storing AWS credentials on the EC2 server

## Technologies Used

- HTML
- CSS
- JavaScript
- Node.js
- Express
- EJS
- AWS SDK for JavaScript
- Amazon EC2
- Amazon DynamoDB
- AWS Lambda
- Amazon CloudWatch
- Amazon S3
- AWS IAM
- PM2
- GitHub

## AWS Architecture

Users connect to the public Node.js and Express application hosted on an Amazon EC2 instance.

The application uses the AWS SDK to communicate with three DynamoDB tables:

- `CloudPlayGames`
- `CloudPlayPredictions`
- `CloudPlayUsers`

AWS Lambda processes completed game results, checks predictions, and updates user scores.

CloudWatch monitors EC2 CPU utilization and includes the `CloudPlay-High-CPU` alarm.

Amazon S3 stores project screenshots, documentation, and implementation evidence.

The EC2 instance uses the `CloudPlayEC2Role` IAM role, so permanent AWS access keys are not stored on the server.

## Project Structure

```text
src/
├── public/
│   └── style.css
├── services/
│   └── database.js
├── views/
│   ├── games.ejs
│   ├── index.ejs
│   ├── leaderboard.ejs
│   └── result.ejs
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
