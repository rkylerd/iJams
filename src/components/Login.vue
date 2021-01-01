<template>
    <div class="login-container">
        <div>
            <label for="username">Username</label>
            <input name="username" v-model="username" type="text">
            <div class="error-container">
            </div>
        </div>

        <div>
            <label for="password">Password</label>
            <input name="password" v-model="password" type="password">
            <div class="error-container" style="min-height: 3em;">
                <span v-for="(error,idx) in errors" :key="idx">*{{error}}</span>
            </div>
        </div>
        
        <div class="submit">
            <button @click="go" v-bind:class="{colorAnimation : loginanimation}">Login</button>
        </div>
    </div>
</template>

<script>
import { login } from '@/shared/logic';

export default {
  name: "Login",
  data: function () {
    return {
        username: '',
        password: '',
        loginanimation: false,
        errors: [],
    }
  },
  props: {
  }, methods: {
      toggle() {
        this.$parent.toggle();
      },
      async go() {
        this.errors = [];
        const user = { username: this.username, password: this.password };
        try {
            const loginSuccess = await login(user);
            if (!loginSuccess) {  
                this.errors.push("Invalid username/password combination. Try again.");
            }
        } catch (err) {
            console.log('login error', err);
        }
      }
  }
};
</script>
