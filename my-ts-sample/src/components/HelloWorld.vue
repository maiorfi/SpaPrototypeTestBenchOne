<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <hr/>
    <p>{{content}}</p>
    <button v-on:click="onBtnClick()">Send Message</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import store from '@/store';

@Component
export default class HelloWorld extends Vue {

  @Prop() private msg!: string;

  // proprietà calcolata
  get content(): string {
    console.info("HelloWorld::MessageSentToOtherClients", store.state.lastMessage.sender, store.state.lastMessage.message);
    return `Message ${store.state.lastMessage.message} from ${store.state.lastMessage.sender}`;
  }

  private counter: number = 0;

  async created(): Promise<void> {
    console.info("HelloWorld component createdAsync()");
  }
  
  async onBtnClick() : Promise<void> {
    await this.$hub.sendMessageToAllClients(`onBtnClick() - counter: ${++this.counter}`);
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
