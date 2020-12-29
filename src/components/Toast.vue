<template>
  <div class="toaster-container">
    <div id="close">
        <div @click="removeToast">
            <fa icon="times" prefix="fas" class="menu-icon block"></fa>
        </div>
    </div>

    <div id="content">
        <div id="exclamation">
            <fa icon="exclamation" prefix="fas" class="menu-icon block"></fa>
        </div>
        <span id="msg">
            {{msg}}
        </span>
    </div>
  </div>
</template>

<script>
import store from '@/store'

export default {
    name: 'Toaster',
    props: {
        msg: String,
        timeoutSeconds: Number,
        idx: Number
    },
    setup(props) {
        const removeToast = () => store.dispatch("removeToast", props.idx); 
        setTimeout(removeToast, props.timeoutSeconds*1000)
        return { ...props, removeToast }
    }
}
</script>

<style scoped lang="scss">
    .toaster-container {
        position: absolute;
        top: 4em;
        left: 1em;
        background-color: #ffd42a;
        color: black;
        border-radius: 8px;
        border: 3px solid #ddb101;
        width: 300px;
        height: 80px;
        z-index: 20;
        -webkit-box-shadow: 0 0 10px #f8f9fa;
        box-shadow: 0 0 10px #f8f9fa;
        > #close {
            display: flex;
            justify-content: flex-start;
            padding: 5px 0 0 5px;
            > div {
                cursor: pointer;
                background-color: black;
                color: white;
                border-radius: 3px;
                padding: 2px;
                width: 15px;
                height: 15px;
            }
        }
        > #content {
            display: flex;
            > #exclamation {
                align-self: center;
                width: 3em;
            }
            > #msg {
                text-align: left;
            }
        }
    }
</style>