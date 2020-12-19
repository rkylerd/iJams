import router from '@/router';

const filterArtist = async (artistId) => {
    router.push({name:"artist", query: {"artist":artistId}});
};

const goToAlbum = async ({ collectionId = ""} = {}) => {
    router.push({name:"album", query: {"album": collectionId}});
};

const goToAccount = () => {
    router.replace("Account");
};

const goToCheckout = () => {
    router.push({name:"checkout"});
}

const redirectHome = () => {
    router.replace('/ijams/');
}

export {
    redirectHome,
    filterArtist,
    goToAlbum,
    goToAccount,
    goToCheckout
};