import router from '@/router';
import store from '@/store';

const filterArtist = async (artistId) => {
    router.push({name:"artist", query: {"artist":artistId}});
};

const goToAlbum = async ({ collectionId = ""} = {}) => {
    router.push({name:"album", query: {"album": collectionId}});
};

const goToLogin = () => {
    router.replace({name:"account"});
};

const goToCheckout = () => {
    router.push({name:"checkout"});
}

const redirectHome = () => {
    router.replace('/ijams/');
}

const goToRequestedPage = () => {
    router.replace(store.state.loginRedirect);
}

export {
    redirectHome,
    filterArtist,
    goToAlbum,
    goToLogin,
    goToCheckout,
    goToRequestedPage
};