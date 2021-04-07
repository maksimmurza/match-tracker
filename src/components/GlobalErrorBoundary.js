import React from 'react';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: error };
	}

	componentDidCatch(error, errorInfo) {
		console.log('Error in global error boundary');
		console.log(error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="message-wrapper">
					<div className="ui negative message">
						<div className="header">Something went wrong...</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
