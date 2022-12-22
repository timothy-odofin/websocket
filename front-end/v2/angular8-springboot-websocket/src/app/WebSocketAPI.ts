import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AppComponent } from './app.component';
import { webSocket } from "rxjs/webSocket";

export class WebSocketAPI {
    webSocketEndPoint: string = 'http://loclhost:8080/ws-callback';

    topic: string = "/queue/chats-";
    stompClient: any;
    appComponent: AppComponent;
    constructor(appComponent: AppComponent){
        this.appComponent = appComponent;
    }
    _connect(usernameData) {
        console.log("Initialize WebSocket Connection");
        let ws = new SockJS(this.webSocketEndPoint);
        this.stompClient = Stomp.over(ws);
        const _this = this;
        _this.stompClient.connect({}, function (frame) {
            _this.stompClient.subscribe(_this.topic+usernameData, function (sdkEvent) {
               
                _this.onMessageReceived(sdkEvent.body);
            });
            //_this.stompClient.reconnect_delay = 2000;
        }, this.errorCallBack);
    };


    _disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    // on error, schedule a reconnection attempt
    errorCallBack(error) {
        console.log("errorCallBack -> " + error)
        setTimeout(() => {
            this._connect("344488383");
        }, 5000);
    }

	/**
	 * Send message to sever via web socket
	 * @param {*} message 
	 */
    _send(message) {
        console.log("calling logout api via web socket");
        this.stompClient.send("/app/hello", {}, JSON.stringify(message));
    }

    onMessageReceived(message) {
      //  console.log("Message Recieved from Server :: " + message);
        this.appComponent.handleMessage(JSON.stringify(message));
    }
}