import React from 'react'
import { Tab, Checkbox } from 'semantic-ui-react'
import League from './League/League'
import Team from './League/Team/Team'
import './SelectionArea.css'


class SelectionArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {leagues:[]};
    }

    static getDerivedStateFromProps(props, state) {
        return {leagues: props.leagues};
    }

    render() {

        let panes = [];

        this.state.leagues.forEach(league => {

            let teams = [];
            league.teams.forEach(team => teams.push(<Team team={team}></Team>));

            panes.push({
                    menuItem: {content: <League league={league}></League>}, 
                    render: () => <Tab.Pane>{teams}</Tab.Pane>
            });
        });

        

        return (
            <div className='wrapper'>
                <Tab panes={panes}/>
            </div>
        )
    }
}

export default SelectionArea;

