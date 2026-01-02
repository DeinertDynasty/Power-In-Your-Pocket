import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }

  componentDidCatch(err, info) {
    console.error("Tab crashed:", err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card">
          <div className="mode-tabbar">Something broke</div>
          <div style={{ opacity: 0.9, marginBottom: 8 }}>
            One of the tabs threw an error while rendering. The details are below.
          </div>
          <pre style={{ whiteSpace: "pre-wrap" }}>{String(this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
