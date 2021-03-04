import React from 'react'
import Board from '../Board/Board'

class Container extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let boards = this.props.shedule?.map(game => {
            return (
                <Board  homeTeam={game.homeTeam.name} 
                        awayTeam={game.awayTeam.name} 
                        logotypes={this.props.logotypes} />
            );
        });

        return (
            <div>{boards}</div>
        )
    }
}

export default Container;

