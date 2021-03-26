import React from 'react'
import { Tab } from 'semantic-ui-react'
import League from './League/League'
import Team from './Team/Team'
import './SelectionArea.css'

function SelectionArea(props) {
    
    let panes = [];

    props.leagues.forEach(league => {   
        let teams = [];
        league.teams.forEach(team => teams.push(
            <Team key={team.name} team={team} onChangeTeam={props.onChangeTeam}></Team>
        )); 
        panes.push({menuItem: {
            key: league.name,
            content: <League league={league} 
                            status='checked' 
                            onChangeLeague={props.onChangeLeague}></League>
            }, 
            render: () => <Tab.Pane className='tab-content'>{teams}</Tab.Pane>
        });
    });

    return (
        <Tab className='wrapper'panes={panes}/>
    )
    
}

export default SelectionArea;

