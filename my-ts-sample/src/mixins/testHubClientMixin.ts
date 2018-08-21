import Vue from "vue";
import Component from "vue-class-component";

import * as signalR from "@aspnet/signalr";

@Component
export default class TestHubClientMixin extends Vue {
  hubConnection!: signalR.HubConnection;
  clientId!: string;

  readonly HUB_URL='https://localhost:5001/testHub';

  async created(): Promise<void> {

    console.log("testHubClientMixin createdAsync()");

    this.clientId = `VUE_TS_CLIENT_${Math.round(1000 * Math.random())}`;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.HUB_URL, {
        accessTokenFactory: () => this.getLoginToken() || "ERR_NO_TOKEN_IN_LOCAL_STORAGE"
      })
      .build();

    try {
      await this.hubConnection.start();
    } catch (err) {
      console.warn("hubConnection.start", err);
    }

    this.hubConnection.on("MessageSentToOtherClients", (sender, message) => {
      this.onMessageSentToOtherClient(sender, message);
    });

  }

  getLoginToken(): string | null {
    let token = localStorage.getItem("default_auth_token");

    return token;
  }

  async sendMessageToAllClients(message: string) : Promise<void> {
    try {
      await this.hubConnection.invoke(
        "SendMessageToAllClients",
        this.clientId,
        message
      );
    } catch (err) {
      console.warn("onBtnClick", err);
    }
  }

  onMessageSentToOtherClient(sender: string, message: string): void {
    console.log("testHubClientMixin inMessageSentToTherClient");
  }
}
