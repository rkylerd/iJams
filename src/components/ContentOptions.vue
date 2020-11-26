<template>
  <div>
      <div @click.prevent="toggleShowing" class="svg-container">
        <fa icon="ellipsis-h" prefix="fas" :class="iconClassName" class="fa-icon"></fa>
        <div class="options-container" v-if="showing" :style="{'left':rightOffset}">
            <p v-for="(option, idx) in options" @click.prevent="()=>{option.action()}" :key="idx">{{option.displayText}}</p>
        </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
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

        const optionsData = reactive({
            showing: false,
            iconClassName: {song:'block-icon', 'song-cart':'block-icon'}[props.type],
            dropdownArea: undefined,
            rightOffset: '0px',
            toggleShowing: (e) => {
                let dropdownArea = e.srcElement;
                if (dropdownArea.tagName == 'p') {
                    dropdownArea = dropdownArea.parentElement.parentElement;
                }
                if (dropdownArea.tagName === 'path') dropdownArea = dropdownArea.parentElement;  
                if (dropdownArea.tagName === 'svg') dropdownArea = dropdownArea.parentElement;
                // dropdownArea should now be div.svg-container
                optionsData.dropdownArea = dropdownArea;

                if (!optionsData.showing) { // about to show the dropdown options
                    document.addEventListener('mousedown', optionsData.handleClickOutside, true); 
                } else { // about to be set to hide the options again
                    document.removeEventListener('mousedown', optionsData.handleClickOutside, true);
                }
                optionsData.showing = !optionsData.showing;
                optionsData.rightOffset = `${e.screenX}px`;
            },
            handleClickOutside: () => {
                if (optionsData.dropdownArea && !optionsData.dropdownArea.contains(event.target)) {
                    document.removeEventListener('click', optionsData.handleClickOutside, true);
                    optionsData.showing = false;
                }
            }
        });

        return { options: optionsMap[props.type], ...toRefs(optionsData) }
    }
}
</script>

<style lang="scss" scoped>
    div {
        div.svg-container {
            margin: 4px 4px 0 0;
            padding: 4px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
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
        background-color: #159;
    }
    .block-icon {
        display: block;
    }
</style>