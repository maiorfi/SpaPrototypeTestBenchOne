<template>
  <div class="home">
    <label>Email <input v-model="email" /></label>
    <br/>
    <label>Password <input v-model="password" type="password" /></label>
    <br/>
    <button @click="login">Sign in</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SignIn extends Vue {

  private email = '';
  private password = '';

  async login() : Promise<void> {
      await (this as any).$auth.login({
            data: {
                username: this.email,
                password: this.password
            }, 
            success: function (response: any) {
                return true;
            },
            error: function (err: any) {
                console.log("login error");
                return false;
            },
            rememberMe: true,
            redirect: '/',
            fetchUser: true
        });
    }

}

</script>