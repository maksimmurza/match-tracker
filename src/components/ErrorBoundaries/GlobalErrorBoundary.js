import React from 'react';
import { Grid, Message, Icon } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';

class GlobalErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { error: null, errorInfo: null };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({ error, errorInfo });
	}

	render() {
		if (this.state.error) {
			return (
				<Grid centered>
					<Grid.Column style={{ marginTop: '2rem' }} computer={8} tablet={10} mobile={14}>
						<Message icon negative>
							<Icon name="exclamation" />
							<Message.Header>Something went wrong</Message.Header>
						</Message>
						<h4>{this.state.error.toString()}</h4>
						<p style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo.componentStack}</p>
					</Grid.Column>
				</Grid>
			);
		}

		return this.props.children;
	}
}

GlobalErrorBoundary.propTypes = {
	children: PropTypes.element.isRequired,
};

export default GlobalErrorBoundary;
