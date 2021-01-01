<template>
    <div class="login-container">
        <div>
            <label for="username">Username</label>
            <input name="username" @keyup="checkUsername" v-model="username" type="text" autofocus>
            <div class="error-container">
                <span v-if="unameerror.length">*{{unameerror[0]}}</span>
            </div>
        </div>

        <div>
            <label for="password">Password</label>
            <input @keyup="checkPassword" name="password" v-model="password" type="password">
            <div class="error-container">
                <span v-if="passerror.length">*{{passerror[0]}}</span>
            </div>
        </div>
        
        <div>
            <label for="psswdConf">Password Confirmation</label>
            <input @keyup="checkPasswordConf" name="psswd" v-model="passwordconf" type="password">
            <div class="error-container">
                <span v-if="conferror">*{{conferror}}</span>
            </div>
        </div>
            
        <div>
            <label for="firstname">First Name</label>
            <input name="firstname" @keyup="checkFName" placeholder="" v-model="firstname" type="text">
            <div class="error-container">
                <span v-if="fnameerror.length">*{{fnameerror[0]}}</span>
            </div>
        </div>

        <div class="submit">
            <button @click="go" v-bind:class="{colorAnimation : registeranimation}">Register</button>
        </div>
    </div>
</template>

<script>
    import { goToRequestedPage } from '@/shared/navigation'
    import { register } from '@/shared/logic';

    export default {
        name: "Register",
        data: function() {
            return {
                username: '',
                firstname: '',
                email: '',
                password: '',
                passwordconf: '',
                unameerror: [],
                passerror: [],
                conferror: '',
                fnameerror: [],
                registeranimation: false
            }
        },
        props: {},
        methods: {
            checkUsername() {
                this.unameerror = [];
                
                if (this.username == "") {
                    this.unameerror.push("Username required.");
                    return true;
                }
                
            },
            checkPassword() {
                this.passerror = [];
                let flag = false;
                if (this.password.length < 6) {
                    this.passerror.push("Six characters required on passwords.");
                    flag = true;
                }
                if (this.password != this.passwordconf && this.passwordconf.length == 0) {
                    this.conferror = "Your passwords must match.";
                    flag = true;
                }
                return flag;
            },
            checkPasswordConf() {
                this.conferror = '';
                if (this.password != this.passwordconf) {
                    this.conferror = "Your passwords must match.";
                    return true;
                }
            },
            checkFName() {
                this.fnameerror = [];
                if (this.firstname == "") {
                    this.fnameerror.push("First name is required.");
                    return true;
                }
            },
            toggle() {
                this.$parent.toggle();
            },
            async go() {
                this.checkFName();
                this.checkPassword();
                this.checkPasswordConf();
                this.checkUsername();
                
                const user = {
                    username: this.username,
                    password: this.password,
                    firstname: this.firstname
                }
                
                try {
                    let registerResult = await register(user);
                    
                    if (registerResult.tokens) {
                        goToRequestedPage();
                    } else {
                        this.unameerror.push("Username already taken");
                    }
                    
                } catch (error) {
                    console.log("Registration error: ", error);
                }
                
                
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

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

</style>
