<template>
  <div>
      <video width="200" height="150" controls>
          <source :src="mvid.previewUrl" type=""/>
      </video>
      <div class="mvideo-info">
          <span>{{mvid.trackCensoredName}}</span><br>
          <span>{{mvid.artistName}}</span>
      </div>
  </div>  
</template>

<script>

export default {
  name: "MVideoTile",
  props: {
    mvid: Object
  }
};
</script>

<style scoped>
  .mvideo-info {
      text-align: left;
  }
</style>
