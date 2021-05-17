# Match tracker

Responsive wep application for tracking football (soccer) games.  
## 🪁 [TRY!](https://match-aggregator.herokuapp.com/)

#### Created with:
+ ReactJS
+ Semantic UI
+ Jest (+ RTL, Enzyme)

#### Tools and libs:
+ [string-similarity](https://github.com/aceakash/string-similarity)

#### API:
- [api.football-data.org](https://www.football-data.org/documentation/api)
- [api-football-v1.p.rapidapi.com](https://rapidapi.com/api-sports/api/api-football/details)

#### Dev:
0. [Node.js](https://nodejs.org/en/) is required.
1. You need to have accounts in services listed above ([API used](#api)).
2. Put tokens from those sites in `.env` file at root of project:
```
REACT_APP_footballDataToken="..."
REACT_APP_rapidApiToken="..."
```
*then...*

 👨‍💻 `npm i` \
🚀 `npm start`
