import React from 'react';
import MatchList from './MatchList/MatchList';
import SelectionArea from './SelectionArea/SelectionArea';
import './MainScreen.css';
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
import store from '../../mobx/store';

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
				store.getLeaguesFromLocal(localLeagues);
				this.showNotification('', 'Loaded from local storage');
			} else {
				this.setState({
					message: 'Local schedule is empty or out of date. Fetching data from API...',
				});
				store
					.getLeaguesFromAPI(localLeagues)
					.then(() => {
						writeLocalLeagues(store.leagues);
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
			store.leagues.length < req.footballData.leaguesKeys.length &&
			!store.leagues.some(l => l?.matches)
		) {
			return (
				<Grid centered>
					<Grid.Column className="message-wrapper" computer={8} tablet={10} mobile={14}>
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
						sidebarContent={<SelectionArea leagues={store.leagues} />}
						sidebarVisible={this.state.sidebarVisible}
						sidebarToggle={this.sidebarToggle}>
						<Grid stackable centered reversed="mobile">
							<Grid.Column computer={9} tablet={10} mobile={16} id="match-list-column">
								<LocaleContext.Provider value={this.state.locale}>
									<MatchList
										leagues={store.leagues}
										quantity={this.state.quantity}
										todayDate={new Date()}
									/>
								</LocaleContext.Provider>
							</Grid.Column>
							<Grid.Column computer={5} tablet={6} mobile={16} id="controls">
								<ControlsBar
									values={{ quantity: this.state.quantity, locale: this.state.locale }}
									handlers={{
										setQuantity: this.setQuantity,
										setLocale: this.setLocale,
										sidebarToggle: this.sidebarToggle,
									}}
								/>
								<SelectionArea leagues={store.leagues} />
							</Grid.Column>
						</Grid>
					</MobileSidebar>
				</div>
			);
		}
	}
}

MainScreen.propTypes = {
	showNotification: PropTypes.func,
};

export default notificationable(observer(MainScreen));
