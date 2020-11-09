# Never Forget

<div align="center" style="display: flex; flex-direction:column; margin: 10px; ">
<img src='./resources/images/Main-Logo.svg' align="center" alt="Never Forget logo" width="300">
<img style="margin:20px; transform: translateX(20px)" alt="" src='https://img.shields.io/endpoint?url=https://runkit.io/sjstark/5fa816d4c2d8c9001d12167c/branches/master'>
</div>

**Never Forget** is an organization focused to-do list tracker web app that allows users to manage their day-to-day lives. Never Forget is a clone that uses [Remember the Milk](https://www.rememberthemilk.com/) as inpiration.

## Demo

Here is a working live demo: [https://app-never-forget.herokuapp.com](https://app-never-forget.herokuapp.com)

## Site

### Landing Page


<img src='./resources/images/landing-page.png' >


### User Authentication

#### Login

<img src='./resources/images/login-page.png' >

#### Signup

<img src='./resources/images/signup-page.png' >

### Application

#### Task List

Upon load, users will see all tasks displayed as a list. Users can add new tasks with the input at the top of the list. Users can also mark tasks as complete with the checkbox.

<img src="./resources/images/app-page-incomplete.png">

#### Task Details

After clicking a specific task, a panel of task details appears. Users can change the properties of their task or delete a task from this panel.

<img src="./resources/images/app-page-listdetails.png">

#### Lists

Users can access the lists that tasks have been organized into from a panel on the left. New lists can be added, list names edited, and lists deleted with all associated tasks from this panel. In list view, a user can see a breakdown of tasks incomplete vs. tasks completed along with the estimated time to complete all incomplete tasks.

<img src="./resources/images/app-page-listview.png">

#### Search

Users can use the search bar in the top of the page to search all of their tasks with keywords or phrases

<img src="./resources/images/app-page-search.png">


## Usage

### Development

Want to contribute?

To fix a bug or add a feature, follow these steps:

- Fork the repository
- Create a new branch with `git checkout -b feature-branch-name`
- Make appropriate changes to the files and push back to github
- Create a Pull Request
   - Use a clear and descriptive title for the issue to identify the suggestion.
   - Include any relevant issue numbers in the PR body, not the title.
   - Provide a comprehensive description of all changes made.

#### Setting Up and Starting a Local Server

1. Download code and `npm install` to install all node dependencies
2. Create a psql db user with createdb privileges. The default is `never_forget_app` with a password of `password`.
   - Duplicate the `.env.example` for the `dotenv` package.
   - Update the following variables:
      - `PORT` the port that the server will listen to, 8080 by default
      - `DB_USERNAME` the user of the created psql db user
      - `DB_PASSWORD` the password for the psql db user
      - `SESSION_SECRET` a session secret key for encrypting session id's in the database
      - All other variables should remain the same
3. Setup PostgreSQL database
   - Run `npx dotenv sequelize db:create`
   - Run `npx dotenv sequelize db:migrate`
   - Run `npx dotenv sequelize db:seed:all`
4. Start express server by running `npm start` in the root project directory
5. The server will start on `http://localhost:8080`

### Bug / Feature Request

We love squashing bugs! If you find one, let our exterminators know by opening an issue [here](https://github.com/sjstark/Never-Forget/issues). Be sure to be clear in the description of the bug (i.e. what was input into the field that caused the bug). Screenshots or recordings greatly help!

If you'd like to request a new feature open up an issue [here](https://github.com/sjstark/Never-Forget/issues). This project was created as part of [App Academy's](https://www.appacademy.io/) coursework, but we love dreaming up of ways to improve our work.

### TODOs
- We'd love to go through and tidy up our code. We know theres several locations we can refactor and leave comments for easier use in the future.

## Built With


<a href="#Built-With"><img alt="npm" src="https://img.shields.io/badge/-NPM-CB3837?style=flat-square&logo=npm&logoColor=white" /></a>
<a href="#Built-With"><img alt="Nodejs" src="https://img.shields.io/badge/-Nodejs-43853d?style=flat-square&logo=Node.js&logoColor=white" /></a>
<a href="#Built-With"><img alt="html5" src="https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" /></a>
<a href="#Built-With"><img alt="CSS" src="https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=CSS3&logoColor=white" /></a>
<br>
<a href="https://www.postgresql.org/"><img alt="PostgreSQL" src="https://img.shields.io/badge/-PostgreSQL-336791?style=flat-square&logo=PostgreSQL&logoColor=white" /></a>
<a href="https://sequelize.org/"><img alt="Sequelize" src="https://img.shields.io/badge/-Sequelize-336791?style=flat-square" /></a>
<a href="https://expressjs.com/"><img alt="Express" src="https://img.shields.io/badge/-Express-000000?style=flat-square" /></a>
<a href="https://pugjs.org/"><img alt="Pug" src="https://img.shields.io/badge/-Pug-A86454?style=flat-square" /></a>


## Team

| [Brandon Perry](https://github.com/Brandon-Perry) | [Dez Adkins](https://github.com/dezadkins) | [Miguel Munoz](https://github.com/memg92) | [Sam Stark](https://github.com/sjstark) |
|-|-|-|-|


<!-- <div style="display: grid; grid-template-columns: auto auto; " align="center">
  <a href="https://github.com/Brandon-Perry">
    <div style="display: flex; align-items:center; width:200px; border: 1px solid rgba(0,0,0,.2);padding: 10px; margin: 5px;">
      <img src="https://avatars2.githubusercontent.com/u/49536689?s=460&u=c23db3acd3be3a8662c4b63388d8454c7ff62831&v=4" width="50" style="border-radius: 50%">
      <span style="margin-left: 20px">Brandon Perry</span>
    </div>
  </a>
  <a href="https://github.com/dezadkins">
    <div style="display: flex; align-items:center; width:200px; border: 1px solid rgba(0,0,0,.2);padding: 10px; margin: 5px;">
      <img src="https://avatars1.githubusercontent.com/u/63823141?s=460&u=c59c21f4d8f8db41b2f4fea9d7975aeb86c640ee&v=4" width="50" style="border-radius: 50%">
      <span style="margin-left: 20px">Dez Adkins</span>
    </div>
  </a>
  <a href="https://github.com/memg92">
    <div style="display: flex; align-items:center; width:200px; border: 1px solid rgba(0,0,0,.2);padding: 10px; margin: 5px;">
      <img src="https://avatars0.githubusercontent.com/u/68749533?s=460&u=af9fe29e52e4db280ff178749a4ef44c28268b89&v=4" width="50" style="border-radius: 50%">
      <span style="margin-left: 20px">Miguel Munoz</span>
    </div>
  </a>
  <a href="https://github.com/sjstark">
    <div style="display: flex; align-items:center; width:200px; border: 1px solid rgba(0,0,0,.2);padding: 10px; margin: 5px;">
      <img src="https://avatars0.githubusercontent.com/u/6759557?s=460&u=0edb95899c11b855e5165bc122bee7cbc441ffd9&v=4" width="50" style="border-radius: 50%">
      <span style="margin-left: 20px">Sam Stark</span>
    </div>
  </a>
</div> -->
