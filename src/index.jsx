import React, { Component } from "react";

const server = typeof window === "undefined" && require("./server");

export function withContext(contextTypes = {}) {
  const ProvideContext = server && server._makeProvider(contextTypes);

  class ServerBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
        error: null,
        errorInfo: "",
      };
    }

    // eslint:disable
    static defaultProps = {
      fallBack: () => null,
    };
    static contextTypes = contextTypes;

    componentDidCatch(error, errorInfo) {
      this.setState({
        hasError: true,
        error,
        errorInfo,
      });
    }

    render() {
      if (server) return server._render(this, ProvideContext);
      const { error, errorInfo, hasError } = this.state;
      if (hasError) {
        return this.props.fallBack({ error, errorInfo });
      } else {
        if (typeof this.props.children === "function") {
          return this.props.children({ error, errorInfo });
        } else {
          return this.props.children;
        }
      }
    }
  }

  return ServerBoundary;
}

export default withContext();
