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
        idx: String
    },
    setup(props) {
        const removeToast = () => store.dispatch("removeToast", props.idx); 
        if (props.timeoutSeconds) setTimeout(removeToast, props.timeoutSeconds*1000)
        return { ...props, removeToast }
    }
}
</script>

<style scoped lang="scss">
    .toaster-container {
        position: absolute;
        top: 4em;
        left: 1em;
        background-color: white;
        color: #292b2c;
        border-radius: 8px;
        border: 3px solid #d9534f;
        width: 300px;
        height: 80px;
        z-index: 20;
        -webkit-box-shadow: 0 0 10px #1f2b38;
        box-shadow: 0 0 10px #1f2b38;
        > #close {
            display: flex;
            justify-content: flex-start;
            padding: 5px 0 0 5px;
            > div {
                cursor: pointer;
                background-color: #d9534f;
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
                color: #d9534f;
            }
            > #msg {
                line-height: normal;
                text-align: left;
            }
        }
    }
</style>