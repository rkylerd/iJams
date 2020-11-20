<template>
    <div>
        <select 
            @change="({ target : { value = '' } = {} } = {}) => 
                {sort.by = value; sortMedia()}"
            :value="sort.by">Sort
            <!-- <option value="trackTimeMillis">Track Length</option> -->
            <option value="trackName">Name</option>
            <option value="releaseDate">Release Date</option>
        </select>
        <input 
            type="button" 
            @click="()=>{
                sortMedia(true)
            }" 
            :value="toggleBtnText.get(sort.by + (sort.inAsc ? 'true' : 'false'))">
    </div>
</template>

<script>
export default {
  name: "MediaSorter",
  data() {
        return {
            sort: {
                inAsc: false,
                by: 'releaseDate'
            },
            toggleBtnText: new Map([
                ['releaseDatetrue', 'Newest first'], 
                ['releaseDatefalse', 'Oldest first'], 
                ['trackNamefalse', '#\'s & A\'s first'], 
                ['trackNametrue', 'Z\'s first']])
        }
  },
  props: {
      media: Array,
      type: String
  },
  methods: {
      sortMedia(toggleFirst = false) {
          toggleFirst && (this.sort.inAsc = !this.sort.inAsc);
          let sortedMedia = [...this.media.sort(this.sorter(this.sort))];
          this.$emit('sortMedia', sortedMedia);
      },
      sorter({ inAsc = true, by = 'trackName'} = {}){
          return function(a, b) {
                let normA = a[by].toLowerCase().replace(/[^0-9a-z ]/gi, '');
                let normB = b[by].toLowerCase().replace(/[^0-9a-z ]/gi, '');

                return normA === normB ? 0 :
                ( inAsc ? 
                (normA < normB ?
                    -1 : 1)
                : (normA < normB ?
                    1 : -1) );
            }; 
      }   
  }
};
</script>

<style lang="scss">
    div {
        select, input[type="button"] {
            font-size: small;
            padding: 0;
        }
    }
</style>