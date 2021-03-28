import React from 'react'

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.log('Error in global error boundary');
    }
  
    render() {
      if (this.state.hasError) {
        return (
          <div className='message-wrapper'>
          <div class="ui negative message">
              <div class="header">
              Something went wrong...
              </div>
          </div>
          </div>
      )
      }
  
      return this.props.children; 
    }
  }

export default ErrorBoundary;