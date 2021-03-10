import React from 'react'
import './League.css'

class League extends React.Component {

    constructor(props) {
        super(props);
        
    }

    

    render() {
       
        return (
            <div>
                <input type="checkbox"></input>
                <span> {this.props.league.name}</span>
            </div>
        )
    }
}

export default League;

