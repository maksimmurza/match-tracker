import React from 'react';
import MatchPoster from '../MatchPoster/MatchPoster';
import { SegmentGroup, Loader, Message } from 'semantic-ui-react';
import './MatchList.css';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';

class MatchList extends React.Component {
	constructor(props) {
		super(props);
		this.loader = <Loader style={{ marginTop: '2em' }} active inline="centered" />;
		this.emptyListMessage = (
			<Message style={{ margin: '1em 2em 1em 1em' }}>
				<Message.Header>No matches to show</Message.Header>
				<Message.List
					items={['All matches in leagues have been played', 'Errors while fetching informaion']}
				/>
			</Message>
		);
	}

	getMarkedMatches() {
		let markedMatches = [];
		let qty = this.props.quantity;

		this.props.leagues.forEach(league => {
			if (league.status !== 'checked' && league.status !== 'indeterminate') return;

			league.matches.forEach(match => {
				if (match.homeTeam.show === true || match.awayTeam.show === true) {
					markedMatches.push(match);
				}
			});
		});

		markedMatches.sort(this.sortByTime);
		qty = qty <= markedMatches.length ? qty : markedMatches.length;
		return markedMatches.slice(0, qty);
	}

	sortByTime = (a, b) => {
		let aDate = new Date(a.utcDate);
		let bDate = new Date(b.utcDate);
		if (aDate.getFullYear() - bDate.getFullYear() !== 0) {
			return aDate.getFullYear() - bDate.getFullYear();
		} else if (aDate.getMonth() - bDate.getMonth() !== 0) {
			return aDate.getMonth() - bDate.getMonth();
		} else if (aDate.getDate() - bDate.getDate() !== 0) {
			return aDate.getDate() - bDate.getDate();
		} else {
			return aDate.getTime() - bDate.getTime();
		}
	};

	render() {
		let markedMatches = this.getMarkedMatches().map(match => {
			return (
				<MatchPoster
					key={match.id}
					homeTeam={match.homeTeam}
					awayTeam={match.awayTeam}
					time={match.utcDate}
					status={match.status}
					todayDate={this.props.todayDate}
					leagueLogo={match.leagueLogo}
				/>
			);
		});

		return (
			<div className="block">
				<SegmentGroup className="match-list">
					{this.props.leagues.every(league => league.loading)
						? this.loader
						: markedMatches.length > 0
						? markedMatches
						: this.emptyListMessage}
				</SegmentGroup>
			</div>
		);
	}
}

MatchList.propTypes = {
	leagues: MobxPropTypes.observableArrayOf(MobxPropTypes.observableObject),
	quantity: PropTypes.number,
	todayDate: PropTypes.instanceOf(Date),
};

export default observer(MatchList);
