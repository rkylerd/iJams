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
        <button 
            @click="()=>{
                sortMedia(true)
            }">{{toggleBtnText.get(sort.by + (sort.inAsc ? 'true' : 'false'))}}</button>
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
                ['trackNamefalse', '#s & As first'], 
                ['trackNametrue', 'Zs first']])
        }
  },
  props: {
      media: Array,
      type: String
  },
  methods: {
      sortMedia(toggleFirst = false) {
          toggleFirst && (this.sort.inAsc = !this.sort.inAsc);
          let m = this.media; 
          let sortedMedia = [...m.sort(this.sorter(this.sort))];
          this.$emit('sort-media', sortedMedia);
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

<style lang="scss" scoped>
    div {
        select, button {
            font-size: small;
            padding: .4em;
            min-height: 2em;
            display: inline-block;
        }
        button {
            background-color: #292b2c;
            border-color: transparent;
            color: #f7f7f7;
            &:hover {
                background-color: #42b983;
            }
            border-radius: 3px;
        }
    }
</style>