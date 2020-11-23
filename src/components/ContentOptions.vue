<template>
  <div>
      <div @click.prevent="()=> showing = !showing" class="svg-container">
        <fa icon="ellipsis-h" prefix="fas" class="classname"></fa>
        <div v-if="showing" class="options-container">
            <p v-for="(option, idx) in options" @click.prevent="option.action" :key="idx">{{option.displayText}}</p>
        </div>
        </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import store from '@/store'
import { addToPlaylist } from '@/shared/logic'
import { goToCheckout } from '@/shared/navigation'

export default {
    name: 'ContentOptions',
    props: {
        song: Object
    },
    setup(props) {
        const showing = ref(false);
        const options = [
            {
                'displayText': 'Add to cart',
                'action':  (item) => store.dispatch('addToCart', item)
            },
            {
                'displayText': 'Fast purchase',
                'action':  (item) => goToCheckout(item)
            },
            {
                'displayText': 'Add to playlist',
                'action':  () => addToPlaylist(props.media)
            }
        ];
        return { options, showing }
    }
}
</script>

<style lang="scss">
    div {
        div.svg-container {
            width: 1em;
            padding-right: 4px;
        }
        div.options-container {
            position: absolute;
            font-size: small;
            background-color: white;
            color: black;
            p {
                margin: 0;
                padding: 0 2px;
                border-bottom: 1px solid black;
            }
        }
    }
    .svg-container:hover {
        cursor: pointer;
    }
</style>