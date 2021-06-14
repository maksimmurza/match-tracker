import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Message } from 'semantic-ui-react';

function notificationable(WrappedComponent) {
	return class Notificationable extends Component {
		constructor(props) {
			super(props);
			this.state = { notification: { show: false, status: '', header: '' } };
		}

		showNotification = (type, header, content = '') => {
			let icon;
			switch (type) {
				case 'success':
					icon = 'check';
					break;
				case 'error':
					icon = 'error';
					break;
				case 'warning':
					icon = 'warning';
					break;
				default:
					icon = 'info circle';
			}
			this.setState({
				notification: {
					icon,
					show: true,
					status: `${type}`,
					header: `${header}`,
					content: `${content}`,
				},
			});
			setTimeout(() => {
				this.setState({
					notification: {
						show: false,
					},
				});
			}, 10000);
		};

		render() {
			return (
				<>
					<WrappedComponent
						{...this.props}
						showNotification={this.showNotification}></WrappedComponent>
					{this.state.notification.show &&
						ReactDOM.createPortal(
							<Message
								success={this.state.notification.status === 'success'}
								error={this.state.notification.status === 'error'}
								warning={this.state.notification.status === 'warning'}
								icon={this.state.notification.icon}
								header={this.state.notification.header}
								content={this.state.notification.content}
								onDismiss={() => this.setState({ notification: { show: false } })}></Message>,
							document.getElementById('notification-area')
						)}
				</>
			);
		}
	};
}

export default notificationable;
