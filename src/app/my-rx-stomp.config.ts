import { Injectable } from '@angular/core';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { StompConfig } from '@stomp/stompjs';
import { StudentsWebsocketService } from './pages/students/service/students-websocket.service';

const brokerURL = 'ws://127.0.0.1:8090/studentStompEndpoint';

/* export const progressStompConfig: StompConfig = {
    webSocketFactory: () => {
      return new WebSocket(brokerURL);
    }
  };
  
  @Injectable()
  export class ProgressWebsocketService extends StudentsWebsocketService {
    constructor(stompService: RxStompService) {
      super(
        stompService,
        progressStompConfig
      );
    }
  } */