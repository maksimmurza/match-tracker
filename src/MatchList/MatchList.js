import React from 'react'
import Match from '../Match/Match'
import { Container, SegmentGroup } from 'semantic-ui-react'

class MatchList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        let boards = this.props.shedule?.map(game => {
            return (
                <Match  homeTeam={game.homeTeam.name} 
                        awayTeam={game.awayTeam.name} 
                        logotypes={this.props.logotypes}
						time={game.utcDate} />
            );
        });

        return (
            <Container text style={{	
										margin:'1em 0',
										height:'calc(100vh - 2em)', 
										overflow:'auto',
										
									}}>
            	<SegmentGroup>
					{boards}
            	</SegmentGroup>
            </Container>
        )
    }
}

export default MatchList;

