import React from 'react';
import MatchPoster from '../MatchPoster/MatchPoster';
import { SegmentGroup, Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

class MatchList extends React.Component {
	constructor(props) {
		super(props);
		this.loader = <StyledLoader active inline="centered" data-testid="matchList-loader" />;
		this.visibleMatches = [];
		this.lazy = false;
		this.emptyListMessage = (
			<StyledMessage>
				<Message.Header>No matches to show</Message.Header>
				<Message.List
					items={['All matches in leagues have been played', 'Errors while fetching informaion']}
				/>
			</StyledMessage>
		);
	}

	getMarkedMatches(leagues, quantity) {
		let markedMatches = [];
		const sortByTime = (a, b) => {
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

		leagues.forEach(league => {
			if (league.status.match(/loading|unchecked/)) {
				return;
			} else if (league.status === 'checked') {
				markedMatches = markedMatches.concat(league.matches);
			} else {
				league.matches.forEach(match => {
					if (match.homeTeam.show === true || match.awayTeam.show === true) {
						markedMatches.push(match);
					}
				});
			}
		});

		markedMatches.sort(sortByTime);
		quantity = quantity <= markedMatches.length ? quantity : markedMatches.length;
		return markedMatches.slice(0, quantity);
	}

	getLayout(matches) {
		return matches.map(match => {
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
	}

	componentDidUpdate() {
		this.lazy = false;
	}

	*lazyLoading(markedMatches) {
		// console.log(markedMatches);
		const step = 15;

		if (markedMatches.length <= step) {
			return this.getLayout(markedMatches);
		} else {
			const rest = markedMatches.length % step;
			const times = (markedMatches.length - rest) / step;

			for (let i = 1; i <= times; i++) {
				yield this.getLayout(markedMatches.slice(step * (i - 1), step * i));
			}

			if (rest > 0) {
				console.log(markedMatches.slice(-rest));
				return this.getLayout(markedMatches.slice(-rest));
			}
		}
	}

	handleScroll = e => {
		const el = e.target;
		const progress = (el.scrollTop / el.scrollHeight + el.clientHeight / el.scrollHeight) * 100;
		if (progress > 90) {
			const iteration = this.lazyLoad.next();
			if (iteration.value) {
				this.lazy = true;
				this.visibleMatches = this.visibleMatches.concat(iteration.value);
				this.forceUpdate();
			}
		}
	};

	render() {
		if (!this.lazy) {
			// update iterator when props are new
			this.lazyLoad = this.lazyLoading(this.getMarkedMatches(this.props.leagues, this.props.quantity));
			this.visibleMatches = this.lazyLoad.next().value;
		}

		return (
			<MatchListWrapper data-testid="match-list" onScroll={this.handleScroll}>
				<StyledSegmentGroup>
					{this.props.leagues.every(league => league.loading)
						? this.loader
						: this.visibleMatches.length > 0
						? this.visibleMatches
						: this.emptyListMessage}
				</StyledSegmentGroup>
			</MatchListWrapper>
		);
	}
}

const StyledMessage = styled(Message)`
	&&& {
		margin: 1em 2em 1em 1em;
	}
`;

const StyledLoader = styled(Loader)`
	&&& {
		margin-top: 2em;
	}
`;

const MatchListWrapper = styled.div`
	overflow-x: visible;
	height: calc(100vh - 2rem);
	border-radius: 5px;
	margin: 1rem 0;
	box-shadow: 0 0 10px 0 rgba(0, 33, 36, 0.305);
	@media (max-width: 767px) {
		margin: 0;
		height: calc(100vh - 42px);
	}
}
`;

const StyledSegmentGroup = styled(SegmentGroup)`
	&&& {
		height: 100%;
		border-radius: 5px;
		overflow-y: auto;
		overflow-x: visible;
		border: none;
		box-shadow: none;
		margin-right: -1.1rem;

		-ms-overflow-style: none; /* for Internet Explorer, Edge */
		scrollbar-width: none; /* for Firefox */
	}

	&::-webkit-scrollbar {
		display: none;
	}
}
`;

MatchList.propTypes = {
	leagues: MobxPropTypes.observableArrayOf(MobxPropTypes.observableObject),
	quantity: PropTypes.number,
	todayDate: PropTypes.instanceOf(Date),
};

export default observer(MatchList);
