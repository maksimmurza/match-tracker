import React from 'react';
import { Grid, Message, Icon } from 'semantic-ui-react';

class GlobalErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error) {
		return { error: error };
	}

	componentDidCatch(error, errorInfo) {
		console.log('Error in global error boundary');
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<Grid centered>
					<Grid.Column className="message-wrapper" computer={8} tablet={10} mobile={14}>
						<Message icon negative>
							<Icon name="exclamation" />
							<Message.Header>Something went wrong</Message.Header>
							<p>{this.state.error}</p>
						</Message>
					</Grid.Column>
				</Grid>
			);
		}

		return this.props.children;
	}
}

export default GlobalErrorBoundary;
