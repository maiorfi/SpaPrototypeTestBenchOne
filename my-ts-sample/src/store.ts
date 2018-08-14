import Vue from 'vue';
import Vuex from 'vuex';
import { Message } from './hub';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lastMessage: new Message('','')
  },
  mutations: {
    newMessage (state, message: Message) {
      state.lastMessage = message;
      console.info("STORE::MessageSentToOtherClients", message.sender, message.message);
    }
  },
  actions: {}
});
