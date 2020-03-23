<template>
  <div>
  
      <div id="input-register-container">
          <span class="input">
                  <label for="username">username</label>
                  <input name="username" class="start-pages" @keyup="checkUsername" v-model="username" type="text" autofocus>
                  <span v-if="unameerror.length > 0" id="account-error-container" v-for="error in unameerror">{{error}}</span>
              </span><br><br>
  
          <span class="input">
                  <label for="password">password</label>
                  <input class="start-pages" @keyup="checkPassword" name="password" v-model="password" type="password">
                  <span v-if="passerror.length > 0" id="account-error-container" v-for="error in passerror">{{error}}</span>
              </span><br><br>
          
          <span class="input">
                <label for="psswdConf">password confirmation</label>
                <input class="start-pages" @keyup="checkPasswordConf" name="psswd" v-model="passwordconf" type="password">
                <span v-if="passwordconf != ''" id="account-error-container">{{conferror}}</span>
            </span><br><br>
                
            <span class="input">
                <label for="firstname">first name</label>
                <input name="firstname" @keyup="checkFName" class="start-pages" placeholder="" v-model="firstname" type="text">
                <span v-if="fnameerror.length > 0" id="account-error-container" v-for="error in fnameerror">*{{error}}</span>
            </span><br><br>

            <span class="input">
                <label for="lastname">last name</label>
                <input class="start-pages" @keyup="checkLName" name="lastname" v-model="lastname" type="text">
                <span v-if="lnameerror.length > 0" id="account-error-container" v-for="error in lnameerror">*{{error}}</span>
            </span><br><br>
            
            <span class="input">
                <label for="email">email</label>
                <input name="email" class="start-pages" @keyup="checkEmail" v-model="email" type="email">
                <span id="account-error-container" v-for="error in emailerror">*{{error}}</span>
            </span><br>
          
      </div>
  
      <div style="margin: 0 auto 30px auto; width: 240px; height: 40px; padding-top: 20px;">
          <!--<input @click="toggle" style="width: 125px;" class="confirmation-buttons" value="Login" type="button" />-->
          <input @click="go" class="confirmation-buttons" v-bind:class="{colorAnimation : registeranimation}" value="Submit" type="button" />
      </div>
  </div>
  
</template>

<script>
    import App from '@/App'
    import router from '@/router'
    
    export default {
        name: "Register",
        data: function() {
            return {
                username: '',
                firstname: '',
                lastname: '',
                email: '',
                password: '',
                passwordconf: '',
                unameerror: [],
                passerror: [],
                conferror: [],
                fnameerror: [],
                lnameerror: [],
                emailerror: [],
                registeranimation: false
            }
        },
        props: {},
        methods: {
            checkUsername() {
                this.unameerror = [];
                
                if (this.username == "") {
                    this.unameerror.push("You need a username, pal. That's that.");
                    return true;
                }
                
            },
            checkPassword() {
                this.passerror = [];
                let flag = false;
                if (this.password.length < 6) {
                    this.passerror.push("Six charachter minimum on the password.");
                    flag = true;
                }
                if (this.password != this.passwordconf && this.passwordconf.length == 0) {
                    this.conferror = "Your passwords have to match, obviously.";
                    flag = true;
                }
                return flag;
            },
            checkPasswordConf() {
                this.conferror = '';
                if (this.password != this.passwordconf) {
                    this.conferror = "Your passwords must match, obviously.";
                    return true;
                }
            },
            checkEmail() {
                this.emailerror = [];
                if (this.email == "") {
                    this.emailerror.push("We need to know where to spam you at. Give us an email.");
                    return true;
                }
            },
            checkFName() {
                this.fnameerror = [];
                if (this.firstname == "") {
                    this.fnameerror.push("Tell me your first name and I swear I won't tell nobody.");
                    return true;
                }
            },
            checkLName() {
                this.lnameerror = [];
                if (this.lastname == "") {
                    this.lnameerror.push("I might reveal your last name though.");
                    return true;
                }
            },
            toggle() {
                this.$parent.toggle();
            },
            async go() {
                this.checkEmail();
                this.checkFName();
                this.checkLName();
                this.checkPassword();
                this.checkPasswordConf();
                this.checkUsername();
                
                const user = {
                    username: this.username,
                    password: this.password,
                    firstname: this.firstname,
                    lastname: this.lastname,
                    email: this.email
                }
                
                try {
                    let registerResult = await this.$store.dispatch("register", user);
                    
                    if (registerResult.tokens) {
                        window.localStorage.setItem("user", JSON.stringify({...registerResult, "username": this.username}))
                            
                        if (this.$store.state.loginRedirect) {
                            router.replace(this.$store.state.loginRedirect);
                        } else {
                            router.replace("/");
                        }
                    } else {
                        this.unameerror.push(registerResult);
                    }
                    
                } catch (error) {
                    console.log("Registration error: ", error);
                }
                
                
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

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
        margin: 0 auto 15px auto;
        text-align: center;
    }
    
    .confirmation-buttons:hover {
        cursor: pointer;
    }

    .colorAnimation {
        animation: colorchange 10s infinite;
        /* animation-name followed by duration in seconds*/
        /* you could also use milliseconds (ms) or something like 2.5s */
        -webkit-animation: colorchange 10s infinite;
        /* Chrome and Safari */
    }

    @keyframes colorchange {
        0% {
            background: #1c89cc;
        }
        25% {
            background: green;
        }
        50% {
            background: #1c89cc;
        }
        75% {
            background: green;
        }
        100% {
            background: #1c89cc;
        }
    }

    @-webkit-keyframes colorchange
    /* Safari and Chrome - necessary duplicate */

        {
        0% {
            background: #1c89cc;
        }
        25% {
            background: green;
        }
        50% {
            background: #1c89cc;
        }
        75% {
            background: green;
        }
        100% {
            background: #1c89cc;
        }
    }

    #input-register-container {
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
