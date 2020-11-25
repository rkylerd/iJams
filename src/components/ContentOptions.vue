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
import { addToPlaylist, deleteFromPlaylist } from '@/shared/logic'
import { goToCheckout } from '@/shared/navigation'

export default {
    name: 'ContentOptions',
    props: {
        media: Object,
        type: String
    },
    setup(props) {
        const showing = ref(false);
        const cartOptions = [
            {
                'displayText': 'Delete',
                'action':  async () => deleteFromPlaylist(props.media)
            },
            {
                'displayText': 'Fast purchase',
                'action':  async () => { await store.dispatch('setCheckoutItems', [props.media]); goToCheckout(props.media) }
            }
        ];
        
        const songOptions = [
            {
                'displayText': 'Add to cart',
                'action':  async () => await store.dispatch('addToCart', props.media)
            },
            {
                'displayText': 'Fast purchase',
                'action':  async () => { await store.dispatch('setCheckoutItems', [props.media]); goToCheckout(props.media) }
            },
            {
                'displayText': 'Add to playlist',
                'action':  () => addToPlaylist(props.media)
            }
        ];

        const optionsMap = {
            'song-cart': cartOptions,
            'song': songOptions
        };

        let options = optionsMap[props.type]
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