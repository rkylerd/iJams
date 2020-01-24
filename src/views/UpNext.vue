<template>
    
</template>

<style>
</style>

<script>
    import App from '@/App'
    const axios = require('axios');
    import router from './router'

    export default {
        name: "upnext",
        data() {
            return {
                upnext: [],
                playing: {},
                playingSong: '',
                isPlaying: { isPlaying: false, index: '' }
            }
        },
        created() {
            
        },
        methods: {
            
        },
    }
</script>