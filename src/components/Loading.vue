<template>
  <div class="loading-box">
      <div>
        <div class="disc">
            <fa icon="compact-disc" prefix="fas" class="spin"></fa>
        </div>
        <span style="font-size: 25px;">{{message}}</span>
      </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

export default {
    name: 'Loading',
    props: {
        msg: String
    },
    setup(props) {
        const message = ref(props.msg);

        onBeforeUnmount(() => {
            document.querySelector("body").style.overflow = "scroll";
        });

        onBeforeMount(() => {
            document.querySelector("body").style.overflow = "hidden";
        })
        return { message };
    }
}
</script>

<style lang="scss" scoped>
    div.loading-box {
        background-color: rgba(255, 255, 255, .7);
        position: absolute;
        margin: 0;
        top: 12vh;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        > div {
            margin: auto;
            display: flex;
            flex-direction: column;
            > div.disc {
                margin: auto;
                width: 200px;
            }
        }
    }
</style>