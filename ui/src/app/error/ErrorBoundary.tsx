'use client';
import React, { Component, ReactNode } from 'react';
import Error from "@/app/error"; // Adjust the import path as necessary

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error }; // Update state to indicate an error occurred
    }

    resetError = () => {
        this.setState({ hasError: false, error: null }); // Reset the error state
    };

    render() {
        if (this.state.hasError) {
            console.log('ErrorBoundary component is being rendered');
            return <Error error={this.state.error} />;
        }
        return this.props.children; // Render children if no error
    }
}

export default ErrorBoundary;
