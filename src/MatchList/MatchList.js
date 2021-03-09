import React from 'react'
import Match from '../Match/Match'
import { Container, SegmentGroup } from 'semantic-ui-react'
import './MatchList.css'

class MatchList extends React.Component {
    constructor(props) {
        super(props);
        this.todayDate = new Date();
    }

    render() {

        let boards = this.props.shedule?.map(game => {
            return (
                <Match  homeTeam={game.homeTeam.name} 
                        awayTeam={game.awayTeam.name} 
                        logotypes={this.props.logotypes}
						time={game.utcDate}
                        todayDate={this.todayDate} />
            );
        });

        return (
            <Container text className='match-list'>
            	<SegmentGroup>
					{boards}
            	</SegmentGroup>
            </Container>
        )
    }
}

export default MatchList;

