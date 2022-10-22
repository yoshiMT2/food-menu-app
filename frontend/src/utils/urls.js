export const BACKEND_URL =
    '__env__' in window ? window.__env__.BACKEND_URL : 'https://flimap-api.up.railway.app/';

export const LOGIN_ENDPOINT = BACKEND_URL + 'api/user/token/'

export const  FORGOT_ENDPOINT = BACKEND_URL + 'api/user/forgot/'