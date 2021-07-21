import React from 'react';
import MatchList from './MatchList/MatchList';
import SelectionArea from './SelectionArea/SelectionArea';
import { LocaleContext } from '../../context/LocaleContext';
import { Grid, Message, Icon } from 'semantic-ui-react';
import notificationable from '../Notification/Notification';
import ControlsBar from './ControlsBar/ControlsBar';
import MobileSidebar from '../MobileSidebar/MobileSidebar';
import req from '../../utils/requestOptions';
import { getLocalLeagues } from '../../utils/localStorage';
import { writeLocalLeagues } from '../../utils/localStorage';
import { observer } from 'mobx-react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';

class MainScreen extends React.Component {
	constructor(props) {
		super(props);
		this.showNotification = props.showNotification;
		this.state = {
			quantity: 15,
			locale: 'ru',
			sidebarVisible: false,
			message: '',
		};
	}

	componentDidMount() {
		this.setState({ message: 'Checking local storage...' });
		getLocalLeagues().then(({ localLeagues, outOfDate }) => {
			if (localLeagues && !outOfDate) {
				this.props.store.getLeaguesFromLocal(localLeagues).then(() => {
					this.showNotification('', 'Loaded from local storage');
				});
			} else {
				this.setState({
					message: 'Local schedule is empty or out of date. Fetching data from API...',
				});
				this.props.store
					.getLeaguesFromAPI(localLeagues)
					.then(() => {
						writeLocalLeagues(this.props.store.leagues);
						this.showNotification('', 'Loaded from API');
					})
					.catch(e => {
						console.log('Problems while fetching data from APIs after mounting component');
						console.log(e);
					});
			}
		});
	}

	setLocale = (event, selected) => {
		this.setState({ locale: selected.value });
	};

	setQuantity = event => {
		this.setState({ quantity: event.target.value });
	};

	sidebarToggle = () => {
		this.setState(state => ({ sidebarVisible: !state.sidebarVisible }));
	};

	render() {
		if (
			this.props.store.leagues.length < req.footballData.leaguesKeys.length &&
			!this.props.store.leagues.some(l => l?.matches)
		) {
			return (
				<Grid centered>
					<Grid.Column style={{ marginTop: '2rem' }} computer={8} tablet={10} mobile={14}>
						<Message icon>
							<Icon name="circle notched" loading />
							<Message.Content>
								<Message.Header>Just one second</Message.Header>
								<p>{this.state.message}</p>
							</Message.Content>
						</Message>
					</Grid.Column>
				</Grid>
			);
		} else {
			return (
				<div style={{ maxHeight: '100vh', overflow: 'auto' }}>
					<MobileSidebar
						sidebarContent={<SelectionArea leagues={this.props.store.leagues} />}
						sidebarVisible={this.state.sidebarVisible}
						sidebarToggle={this.sidebarToggle}>
						<Grid stackable centered reversed="mobile">
							<MatchListColumn computer={9} tablet={10} mobile={16}>
								<LocaleContext.Provider value={this.state.locale}>
									<MatchList
										leagues={this.props.store.leagues}
										quantity={this.state.quantity}
										todayDate={new Date()}
									/>
								</LocaleContext.Provider>
							</MatchListColumn>
							<ControlsColumn computer={5} tablet={6} mobile={16}>
								<ControlsBar
									values={{ quantity: this.state.quantity, locale: this.state.locale }}
									handlers={{
										setQuantity: this.setQuantity,
										setLocale: this.setLocale,
										sidebarToggle: this.sidebarToggle,
									}}
								/>
								<SelectionArea leagues={this.props.store.leagues} />
							</ControlsColumn>
						</Grid>
					</MobileSidebar>
				</div>
			);
		}
	}
}

const MatchListColumn = styled(Grid.Column)`
	&&&&& {
		@media (max-width: 767px) {
			padding: 0 !important;
		}
	}
`;

const ControlsColumn = styled(Grid.Column)`
	&&&&& {
		margin: 1rem 0 0 0 !important;
		height: 100vh !important;
		display: flex !important;
		flex-direction: column;
		@media (max-width: 767px) {
			height: initial !important;
			padding: 5px !important;
			margin-top: 1rem !important;
		}
	}
`;

MainScreen.propTypes = {
	showNotification: PropTypes.func,
};

export default notificationable(observer(MainScreen));
