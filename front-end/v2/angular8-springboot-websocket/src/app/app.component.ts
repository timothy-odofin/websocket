import { Component } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { WebSocketAPI } from './WebSocketAPI';
import * as Stomp from 'stompjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular11-springboot-websocket';

  webSocketAPI: WebSocketAPI;
  greeting: any;
  name: string;
 subject:any
 stompClient: any;

  ngOnInit() {
   // this.webSocketAPI = new WebSocketAPI(new AppComponent());
   
  }

  connect(){
   // this.webSocketAPI._connect("994910125479591936");
   this.subject= webSocket('wss://localhost:8080/catalog/ws-callback')
  console.log("Done with the first step.........")
   this.stompClient = Stomp.client(this.subject);

    this.stompClient.connect({}, function (frame) {
      
        console.log('Connected: ' + frame);
        this.stompClient.subscribe('/queue/chats-abu', function (message) {
           console.log(JSON.stringify(message.body))
        });
    });
  }

  disconnect(){
    this.webSocketAPI._disconnect();
    
  }

  sendMessage(){
    this.webSocketAPI._send(this.name);
  }

  handleMessage(message){
    this.greeting = message;
  }
}
