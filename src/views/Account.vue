<template>
        <div>
            
            <ul class="tabs group tabs-container">
              <li :class="{ active: login }"><a @click="toggle('Login')">Login</a></li> 
              <li :class="{ active: !login }"><a @click="toggle('Register')">Register</a></li> 
             
            </ul>
            <div id="account-container">
                <div id="account-title-container">
                    <h3 id="account-container-title">{{otheroption}}</h3>
                </div>
    
              <Login v-if="login"></Login>
              <Register v-else></Register>
            </div>
      </div>
</template>

<style type="text/css">
    @import url('https://fonts.googleapis.com/css?family=Cabin|Fjalla+One|Fredoka+One|Inconsolata|Josefin+Sans|Luckiest+Guy|Manjari|Modak&display=swap');
    
    .tabs li {     
        cursor: pointer;
      /* Makes a horizontal row */
      float: left; 
    
      /* So the psueudo elements can be
         abs. positioned inside */
      position: relative; 
    }
    .tabs a { 
      /* Make them block level
         and only as wide as they need */
      float: left; 
      padding: 5px 20px; 
      text-decoration: none;
      
      /* Default colors */ 
      color: white;
      font-family: 'Josefin Sans', sans-serif;    
      font-weight: bold;
      background: #192734; 
      
      /* Only round the top corners */
      -webkit-border-top-left-radius: 15px;
      -webkit-border-top-right-radius: 15px;
      -moz-border-radius-topleft: 15px;
      -moz-border-radius-topright: 15px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px; 
    }
    .tabs .active {
      /* Highest, active tab is on top */
      z-index: 3;
    }
    .tabs .active a { 
      /* Colors when tab is active */
      background: #42b983; 
      color: #192734; 
    }
    .tabs li:before, .tabs li:after, 
    .tabs li a:before, .tabs li a:after {
      /* All pseudo elements are 
         abs. positioned and on bottom */
      position: absolute;
      bottom: 0;
    }
    /* Only the first, last, and active
       tabs need pseudo elements at all */
    .tabs li:last-child:after,   .tabs li:last-child a:after,
    .tabs li:first-child:before, .tabs li:first-child a:before,
    .tabs .active:after,   .tabs .active:before, 
    .tabs .active a:after, .tabs .active a:before {
      content: "";
    }
    .tabs .active:before, .tabs .active:after {
      background: #42b983; 
      
      /* Squares below circles */
      z-index: 1;
    }
    /* Squares */
    .tabs li:before, .tabs li:after {
      background: #192734;
      width: 10px;
      height: 10px;
    }
    .tabs li:before {
      left: -10px;      
    }
    .tabs li:after { 
      right: -10px;
    }
    /* Circles */
    .tabs li a:after, .tabs li a:before {
      width: 20px; 
      height: 20px;
      /* Circles are circular */
      -webkit-border-radius: 10px;
      -moz-border-radius:    10px;
      border-radius:         10px;
      background: black;
      
      /* Circles over squares */
      z-index: 2;
    }
    .tabs .active a:after, .tabs .active a:before {
      background: #192734;
      
    }
    /* First and last tabs have different
       outside color needs */
    .tabs li:first-child.active a:before,
    .tabs li:last-child.active a:after {
      background: black;
    }
    .tabs li a:before {
      left: -20px;
    }
    .tabs li a:after {
      right: -20px;
    }



    .tabs-container {
        display: flex;
        width: 30vw;
        min-width: 310px;
        margin: 2% auto 0 auto;
    }
    
    .tab-item {
        min-width: 75px;
        min-height: 30px;
        background: #192734;
        border-top-left-radius: 15px;
        border-top-right-radius: 15px;
    }
    
   #account-container {
        /* display: block; */
        background: #192734;
        /*color: #42b983;*/
        color: whitesmoke;
        border: #0b0129 solid 1px;
        border-radius: 10px;
        box-shadow: #ccc 0px 4px 0px 0px;
        width: 30vw;
        min-width: 310px;
        min-height: 310px;
        /*height: 65vh;*/
        margin: 0 auto 0 auto;
    }
    
    #account-title-container {
        margin: 3%;
    }
    
    #account-container-title {
        font-family: 'Josefin Sans', sans-serif;    
        font-weight: bold;
    }
</style>

<script>
    import App from '@/App.vue'
    const axios = require('axios');
    import Login from "@/components/Login";
    import Register from "@/components/Register";
    import router from '@/router'
    
    export default {
        name: 'accountpage',
        data() {
            return {
                login: true,
                otheroption: "Login",
                user: {}
            }
        },
        components: {Login, Register},
        async created() {
        },
        methods: {
            toggle(option) {
                if (option != this.otheroption) {
                    this.login = !this.login; 
                    this.otheroption = this.otheroption == "Login" ? "Register" : "Login";
                }
            },
            comparePasswords() {
              //we only need to compare passwords when signing up
              if (this.login) return;
              
              if (this.password != this.passwordconf) {
                  this.errors.push("passwords must match.");
              }  
              
              if (this.password.length < 6) {
                  this.errors.push("passwords must be at least 6 characters long.");
              }
              
              this.loginanimation = true;
            },
            async go() {
                let hault = this.checkAllFields();
                if (hault) return;
                else this.loginanimation = false;
                
                let user = {username: this.username, password: this.password,
                            firstname: this.firstname, lastname: this.lastname,
                            email: this.email
                            }
                if (login) {
                    let loginResult = await this.$store.dispatch("login", user);
                    
                } else {
                    let registerResult = await this.$store.dispatch("register", user);
                    // let historyResult = await axios.post("api/users/register", user);
                    this.goHome();
                }
            },
            goHome() {
                router.push("Home");
            }
        }
    }
</script>