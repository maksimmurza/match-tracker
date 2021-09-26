# Match tracker

Responsive wep application for tracking football (soccer) games.  
### 🪁 [Try](https://match-aggregator.herokuapp.com/)

#### Created with:
+ React
+ MobX
+ Semantic UI
+ Styled components
+ Jest, RTL
+ [string-similarity](https://github.com/aceakash/string-similarity)

#### API used:
- [api.football-data.org](https://www.football-data.org/documentation/api)
- [api-football-v1.p.rapidapi.com](https://rapidapi.com/api-sports/api/api-football/details)

#### Dev:
You need to have accounts in services listed above ([API used](#api)) and in google cloud platform.
Put you tokens and credentials from those sites in `.env` file at root of project:
```
REACT_APP_footballDataToken=...
REACT_APP_rapidApiToken=...
REACT_APP_API_KEY=...
REACT_APP_OAuthClientId=...
```
 👨‍💻 `npm i` \
🚀 `npm start`
