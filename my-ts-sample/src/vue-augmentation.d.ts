import Vue from "vue";

declare module 'vue/types/vue' {
  interface Vue {
    $hub: HubInterface;
  }
}

export declare class HubInterface {
  sendMessageToAllClients (message: string): Promise<void>;
}