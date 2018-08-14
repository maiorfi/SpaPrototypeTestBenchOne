import _Vue from "vue";
import * as signalR from '@aspnet/signalr';
import store from './store';

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default function hub<HubPluginOptions>(Vue: typeof _Vue, options?: HubPluginOptions): void {
    // do stuff with options
    //Vue.prototype.$http = Axios;

    console.info('testHubClientMixin createdAsync()');

    let _options = new HubPluginOptions();
    //if(options) {
    //    _options = options as HubPluginOptions;
    //}

    let hub = new HubClient();
    hub.init(_options.HUB_URL)

    Vue.prototype.$hub = hub;
}

export class HubPluginOptions {
    public HUB_URL: string = 'http://localhost:5000/testHub';
}

export class HubClient {
    hubConnection!: signalR.HubConnection;
    clientId!: string;

    async init(hub_url: string): Promise<void> {
  
      console.info('HubClient createdAsync()');
  
      this.clientId = `VUE_TS_CLIENT_${Math.round(1000 * Math.random())}`;
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(hub_url).build();
  
      try {
        await this.hubConnection.start();
      } catch (err) {
        console.warn('hubConnection.start', err);
      }
  
      this.hubConnection.on('MessageSentToOtherClients', (sender, message) => {
        //this.onMessageSentToOtherClient(sender, message);
        store.commit('newMessage', new Message(sender, message));
      });
  
    }
  
    async sendMessageToAllClients(message: string) : Promise<void> {
      try {
        console.info("HUB-SERVICE::Sending-MessageSentToOtherClients", this.clientId, message);
        await this.hubConnection.invoke(
          'SendMessageToAllClients',
          this.clientId,
          message
        );
      } catch (err) {
        console.warn('Errore invio messaggio...', err);
      }
    }
  
    // onMessageSentToOtherClient(sender:string, message: string) {
    //   let msg = new Message(sender, message);
    //   store.commit('newMessage', msg);
    // }
  }
  
  export class Message {
    sender: string = '';
    message: string = '';

    constructor(sender: string, message: string) {
      this.sender = sender;
      this.message = message;
    }
  }