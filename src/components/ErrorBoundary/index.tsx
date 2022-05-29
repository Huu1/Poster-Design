import React, { ErrorInfo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: unknown) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    // logErrorToMyService(error, errorInfo);
    console.log(error, errorInfo);
  }

  render() {
    const { hasError, error } = this.state;
    if (hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>{error.message}</h1>;
    }

    return this.props.children;
  }
}
