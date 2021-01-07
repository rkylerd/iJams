<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="$props.class" :viewBox="`0 0 ${width} ${height}`">
    <path fill="currentColor" :d="svgPath"/>
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core'

export default defineComponent({
  name: 'FontAwesomeIcon',
  props: {
    icon: {
      type: String,
      required: true
    },
    prefix: {
        type: String,
        required: true
    },
    class: String
  },

  setup (props) {
    const definition = computed(() => findIconDefinition({
      prefix: props.prefix,
      iconName: props.icon
    }))
    
    const width = computed(() => definition.value.icon[0])
    const height = computed(() => definition.value.icon[1])
    const svgPath = computed(() => definition.value.icon[4])

    return { width, height, svgPath }
  }
})
</script>

<style lang="scss" scoped>
.vert-middle {
  vertical-align: text-top; 
  vertical-align: -webkit-baseline-middle;
}

.menu-icon {
  max-height: 100%;
  height: 20px;
  margin: auto;
}

.block {
  display: block;
}

.distance-left {
  margin-left: .2em;
}

.spin {
  @keyframes spinner {
    to { transform: rotate(360deg); }
  }
  /* This is the class name given by the Font Awesome component when icon contains 'spinner' */
  
  /* Apply 'spinner' keyframes looping once every second (1s)  */
  animation: spinner 2s linear infinite;
  
}
</style>