<template>
        <div >
            <div id="input-login-container">
                <span class="input">
                    <label for="username">username</label>
                    <input name="username" class="start-pages" v-model="username" type="text"><br>
                </span><br>

                <span class="input">
                    <label for="password">password</label>
                    <input class="start-pages" name="password" v-model="password" type="password"><br>
                </span><br>

                <div id="account-error-container">
                    <span v-for="error in errors">{{error}}</span>
                </div>

            </div>

            <div style="margin: auto; width: 240px; height: 40px; padding-top: 20px;">
                <!--<input @click="toggle" style="width: 125px;" class="confirmation-buttons" value="Register" type="button"/>-->
                <input @click="go" class="confirmation-buttons" v-bind:class="{colorAnimation : loginanimation}" :disabled="errors.length > 0" value="Submit" type="button"/>
            </div>
        </div>
</template>

<script>

import App from '@/App'
import router from '@/router'

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

        let user = {username: this.username, password: this.password}
            
        let loginResult = await this.$store.dispatch("login", user);
        console.log("loginResult", loginResult);
        
        if (loginResult.data) {
            this.$store.dispatch("setUser", loginResult.data);
            router.push("/");
        } else {
            this.errors.push("Invalid username/password combination. Try again.");
        }
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    @import url('https://fonts.googleapis.com/css?family=Cabin|Fjalla+One|Fredoka+One|Inconsolata|Josefin+Sans|Luckiest+Guy|Manjari|Modak&display=swap');

    #nav {
        /*display: none;    */
    }

    #account-error-container {
        min-height: 15px;
        color: red;
        text-align: left;
        
    }
    
    .confirmation-buttons {
        display: block; 
        float: right; 
        font-size: small;
        background-color: #42b983; 
        color: white; 
        width: 80px; 
        height: 25px;
        border-radius: 15px;
        margin: 0 auto 5px auto;
        text-align: center;
    }
    
    .confirmation-buttons:hover {
        cursor: pointer;
    }
    
    .colorAnimation {
        animation: colorchange 10s infinite; /* animation-name followed by duration in seconds*/
             /* you could also use milliseconds (ms) or something like 2.5s */
          -webkit-animation: colorchange 10s infinite; /* Chrome and Safari */
    }
    
    @keyframes colorchange
    {
      0%   {background: #1c89cc;}
      25%  {background: green;}
      50%  {background: #1c89cc;}
      75%  {background: green;}
      100% {background: #1c89cc;}
    }
    
    @-webkit-keyframes colorchange /* Safari and Chrome - necessary duplicate */
    {
        0%   {background: #1c89cc;}
        25%  {background: green;}
        50%  {background: #1c89cc;}
        75%  {background: green;}
        100% {background: #1c89cc;}
    }
    
    #input-login-container {
        width: 200px;
        font-size: small;
        text-align: center;
        margin: 20px auto 0 auto;
    }
    
    
    label {
        display: block;
        text-align: left;
        font-size: larger;
    }
    
    input.start-pages {
        /* margin: 10px; */
        width: 220px;
        height: 30px;
        
        font-family: 'Manjari', sans-serif;
        border-radius: 4px;
        background-color: #192734;
        
        color: #42b983;
        font-size: 15px;
        padding-left: 3px;
    }
    
    .two-col-container {
        display: grid;
        grid-template-columns: 60% 40%;
        align-items: center;
        justify-content: center;
    }
</style>
