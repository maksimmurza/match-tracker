import React from 'react';
import ReactDOM from 'react-dom';
import { Segment, Icon, Label, Message, Popup } from 'semantic-ui-react';
import './Match.css';
import { LocaleContext } from '../../LocaleContext';

class Match extends React.Component {
	constructor(props) {
		super(props);
		this.gapi = window.gapi;
		this.dateLabels = React.createRef();

		this.state = { notification: { show: false, status: '', header: '' } };
	}

	static contextType = LocaleContext;

	hoverDateLabels = () => {
		let current = this.dateLabels.current.style.backgroundColor;

		if (current === 'rgb(232, 232, 232)') {
			this.dateLabels.current.style.backgroundColor = 'transparent';
			this.dateLabels.current.style.boxShadow = 'none';
		} else {
			this.dateLabels.current.style.backgroundColor = 'rgb(232, 232, 232)';
			this.dateLabels.current.style.boxShadow = '0 0 5px 0 rgba(0, 0, 0, 0.5)';
		}
	};

	preRender(matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel) {
		let matchDate = new Date(this.props.time);
		matchDateStr = matchDate.toLocaleDateString(this.context, {
			month: 'long',
			day: 'numeric',
		});
		matchTimeStr = matchDate.toLocaleTimeString(this.context, {
			hour: 'numeric',
			minute: 'numeric',
		});

		let date = this.props.todayDate.getDate();
		let month = this.props.todayDate.getMonth();

		if (date === matchDate.getDate() && month === matchDate.getMonth()) {
			if (this.props.status === 'IN_PLAY' || this.props.status === 'PAUSED') {
				liveLabel = (
					<Label color="red" ribbon="right" className="day-label">
						live
					</Label>
				);
			} else
				todayLabel = (
					<Label color="blue" ribbon="right" className="day-label">
						today
					</Label>
				);
		} else if (month === matchDate.getMonth() && date + 1 === matchDate.getDate())
			tomorrowLabel = (
				<Label color="teal" ribbon="right" className="day-label">
					tomorrow
				</Label>
			);

		return [matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel];
	}

	showNotification(type, header) {
		this.setState({
			notification: {
				show: true,
				status: `${type}`,
				header: `${header}`,
			},
		});
		setTimeout(() => {
			this.setState({
				notification: {
					show: false,
				},
			});
		}, 10000);
	}

	pushEventHandler = async () => {
		if (this.gapi.auth2.getAuthInstance().isSignedIn.get() === false) {
			this.showNotification('warning', 'You should sign in!');
			return;
		}

		const summary = `${this.props.homeTeam.name} - ${this.props.awayTeam.name}`;
		const endDate = new Date(this.props.time).addHours(1.5).toISOString();
		const eventExist = await this.gapi.client.calendar.events
			.list({
				calendarId: 'primary',
				timeMin: `${this.props.time}`,
			})
			.then(response => response.result.items.filter(event => event.summary === summary).length > 0)
			.catch(error => this.showNotification('error', error));

		if (eventExist) {
			this.showNotification('warning', 'Event is already in you calendar');
			return;
		}

		const gameEvent = {
			summary,
			start: {
				dateTime: `${this.props.time}`,
			},
			end: {
				dateTime: `${endDate}`,
			},
			reminders: {
				useDefault: false,
				overrides: [{ method: 'popup', minutes: 60 }],
			},
		};

		const request = this.gapi.client.calendar.events.insert({
			calendarId: 'primary',
			resource: gameEvent,
		});

		try {
			request.execute(response => {
				if (response.status === 'confirmed') {
					this.showNotification('success', 'Event successfuly created!');
				} else {
					this.showNotification('error', response.message);
				}
			});
		} catch (error) {
			this.showNotification('error', error);
		}
	};

	render() {
		let matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel;
		[matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel] = this.preRender(
			matchDateStr,
			matchTimeStr,
			todayLabel,
			tomorrowLabel,
			liveLabel
		);

		return (
			<>
				<Segment className="match">
					<div className="labels">
						{todayLabel}
						{tomorrowLabel}
						{liveLabel}

						<Popup
							trigger={
								<div
									ref={this.dateLabels}
									onMouseEnter={this.hoverDateLabels}
									onMouseLeave={this.hoverDateLabels}
									className="date-labels-container"
									onClick={this.pushEventHandler}>
									<Label>
										<Icon name="calendar" /> {matchDateStr}
									</Label>
									<Label>
										<Icon name="time" /> {matchTimeStr}
									</Label>
								</div>
							}
							mouseEnterDelay={800}
							content="Push to the calendar"
							position="top left"
						/>
					</div>

					<div className="teams">
						<span className="home-team">{this.props.homeTeam.name}</span>
						<img src={this.props.homeTeam.logo} className="team-logo" alt="Team logo" />
						<h3 className="devider">–</h3>
						<img src={this.props.awayTeam.logo} className="team-logo" alt="Team logo" />
						<span className="away-team">{this.props.awayTeam.name}</span>
					</div>

					<img
						src={this.props.leagueLogo}
						alt="League logo"
						width="25"
						className="league-logo"></img>
				</Segment>
				{this.state.notification.show &&
					ReactDOM.createPortal(
						<Message
							success={this.state.notification.status === 'success'}
							error={this.state.notification.status === 'error'}
							warning={this.state.notification.status === 'warning'}
							icon={this.state.notification.status === 'success' ? 'check' : 'warning'}
							header={this.state.notification.header}
							content={`${this.props.homeTeam.name} - ${this.props.awayTeam.name}, ${matchDateStr}, ${matchTimeStr}`}
							onDismiss={() => this.setState({ notification: { show: false } })}></Message>,
						document.getElementById('notification-area')
					)}
			</>
		);
	}
}

export default Match;
