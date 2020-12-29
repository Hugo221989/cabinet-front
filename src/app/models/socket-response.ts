export class SocketResponse {
  type: string;
  message: any;
}

export class WebSocketOptions {
  constructor(public brokerEndpoint: string) {}
}