import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí podrías agregar lógica para registrar el error
    console.error('Error capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Aquí podrías mostrar un mensaje de error personalizado
      return <div>Lo sentimos, algo salió mal.</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
