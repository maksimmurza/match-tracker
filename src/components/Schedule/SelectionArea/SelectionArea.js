import React from 'react'
import { Tab, Checkbox } from 'semantic-ui-react'
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
            panes.push({menuItem: league.name, 
            render: () => <Tab.Pane>{league.teams}</Tab.Pane>
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

