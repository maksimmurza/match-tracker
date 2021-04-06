import req from './requestOptions'

async function getCurrentLeagues() {
    let source = req.rapidApi;
    const response = await fetch(source.currentSeasonLeaguesURL, source.requestOptions)
    .catch(e => {
        throw new Error(e.message);
    });

    if(response.ok) {
        const data = await response.json();
        return data.api.leagues;
    } else {
        throw new Error();
    }
}

async function getSchedule(leagueKey, filter) {
    let source = req.footballData;
    const response = await fetch(source.leaguesBaseURL + leagueKey + filter, source.requestOptions)
    .catch(e => {
        throw new Error(e.message + " (Possibly because of too much requets per minute");
    });

    if(response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error();
    }
}

async function getTeamsInfo(leagueId) {
    let source = req.rapidApi;
    const response = await fetch(source.leaguesBaseURL + leagueId, source.requestOptions)
    .catch(e => {
        throw new Error(e.message);
    });

    if(response.ok) {
        const data = await response.json();
        return data.api.teams;
    } else {
        throw new Error();
    }
}

function getLocalData() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let leaguesLocal = JSON.parse(localStorage.getItem('leagues'));
            if(!leaguesLocal || leaguesLocal.length === 0) {
                reject()
            } else {
                let today = new Date(); //  '2021-04-03T11:30:00Z'
                leaguesLocal.forEach(league => {
                    if(league.matches.some(match => new Date(match.utcDate) < today))
                        reject();
                })  
                resolve(leaguesLocal);
            }
        });
    })
}

export {getCurrentLeagues, getSchedule, getTeamsInfo, getLocalData};