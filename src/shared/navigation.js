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

const goToCheckout = () => {
    router.push({path:"checkout"});
}

const redirectHome = () => {
    router.replace('/');
}

export {
    redirectHome,
    filterArtist,
    goToAlbum,
    goToAccount,
    goToCheckout
};