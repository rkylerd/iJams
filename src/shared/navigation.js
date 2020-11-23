import router from '@/router';

const filterArtist = async (artistId) => {
    router.push({path:"artist", query: {"artist":artistId}});
};

const goToAlbum = async ({ collectionId = ""} = {}) => {
    router.push({path:"album", query: {"album": collectionId}});
};

const goToAccount = () => {
    router.replace("Account");
};

const goToCheckout = ({trackId = ""}) => {
    router.push({path:"checkout", query: {"item": trackId}});
}

export {
    filterArtist,
    goToAlbum,
    goToAccount,
    goToCheckout
};