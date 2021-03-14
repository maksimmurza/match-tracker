import React from 'react'
import { Tab } from 'semantic-ui-react'
import League from './League/League'
import Team from './League/Team/Team'
import './SelectionArea.css'


class SelectionArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {leagues:[], onChangeLeague: null, onChangeTeam: null};
    }

    static getDerivedStateFromProps(props, state) {
        return {leagues: props.leagues, onChangeLeague: props.onChangeLeague, onChangeTeam: props.onChangeTeam};
    }

    getPanes() {
        let panes = [];
        this.state.leagues.forEach(league => {

            let teams = [];
            league.teams.forEach(team => teams.push(
                <Team team={team} onChangeTeam={this.props.onChangeTeam}></Team>
            ));
            console.log(this.state.onChangeLeague);
            panes.push({
                    menuItem: {content: 
                    <League league={league} status='checked' onChangeLeague={this.state.onChangeLeague}></League>
                }, 
                    render: () => <Tab.Pane>{teams}</Tab.Pane>
            });
        });
        return panes;
    }

    render() {

        return (
            <div className='wrapper'>
                <Tab panes={this.getPanes()}/>
            </div>
        )
    }
}

export default SelectionArea;

