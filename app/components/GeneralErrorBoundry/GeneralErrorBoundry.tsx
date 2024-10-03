import React, { ErrorInfo } from 'react';
import { Document } from '../../root'; // Adjust the import based on your project structure

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class GeneralErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  // This lifecycle method is called when an error is thrown
  static getDerivedStateFromError(error: Error) {
    // Update state to render the fallback UI
    return { hasError: true };
  }

  // This lifecycle method can be used to log errors
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can log the error to an error reporting service
    console.error('Error caught in GeneralErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <Document theme="light"> {/* You can set the theme here as needed */}
          <h1>Something went wrong.</h1>
          <p>We're sorry for the inconvenience. Please try again later.</p>
        </Document>
      );
    }

    return this.props.children; // Render children if no error
  }
}
