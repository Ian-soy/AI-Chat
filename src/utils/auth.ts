import { tokenKey, keyPrefix } from "./setting";
import { useStorage } from "@vueuse/core";

import Cookies from "js-cookie";

const tokenStorage = useStorage(tokenKey, null);

export const getToken = () => tokenStorage.value;

export const setToken = (access_token: any) => (tokenStorage.value = access_token);

export const removeToken = () => (tokenStorage.value = null);

export function getCookie(key: any) {
  return Cookies.get(`${keyPrefix}${key}`);
}
export function setCookie(key: any, value: any) {
  Cookies.set(`${keyPrefix}${key}`, value, { expires: 30 });
}

export function removeCookie(key: any) {
  return Cookies.remove(`${keyPrefix}${key}`);
}