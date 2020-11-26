<template>
  <fa :icon="icon" prefix="fas" class="vert-middle"></fa>
  <span v-if="qty">{{qty}}</span>
</template>

<script>
import { toRefs } from 'vue'

export default {
    name: 'MenuOption',
    props: {
        icon: String,
        qty: Number
    },
    setup(props) {
        return {
            ...toRefs(props)
        }
    }
}
</script>

<style>

</style>