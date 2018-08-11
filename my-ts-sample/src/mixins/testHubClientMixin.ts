import Vue from 'vue';
import Component from 'vue-class-component';

import * as signalR from '@aspnet/signalr';

@Component
export default class TestHubClientMixin extends Vue {
  hubConnection!: signalR.HubConnection;
  clientId!: string;

  readonly HUB_URL='https://localhost:44317/testHub';

  async created(): Promise<void> {

    console.info('testHubClientMixin createdAsync()');

    this.clientId = `VUE_TS_CLIENT_${Math.round(1000 * Math.random())}`;

    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.HUB_URL).build();

    try {
      await this.hubConnection.start();
    } catch (err) {
      console.warn('hubConnection.start', err);
    }

    this.hubConnection.on('MessageSentToOtherClients', (sender, message) => {
      this.onMessageSentToOtherClient(sender, message);
    });

  }

  async sendMessageToAllClients(message: string) : Promise<void> {
    try {
      await this.hubConnection.invoke(
        'SendMessageToAllClients',
        this.clientId,
        message
      );
    } catch (err) {
      console.warn('onBtnClick', err);
    }
  }

  onMessageSentToOtherClient(sender: string, message: string) {
    console.log('testHubClientMixin inMessageSentToTherClient');
  }
}
