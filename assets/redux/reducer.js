import initialState from './state.js'
import { AsyncStorage } from 'react-native'

export const CHANGE_NAME = 'CHANGE_NAME';
export const СHANGE_ACTIVE_LANG = 'СHANGE_ACTIVE_LANG';

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      AsyncStorage.setItem("name", action.name);
      return { ...state, userName: action.name};
    case СHANGE_ACTIVE_LANG:
      AsyncStorage.setItem("activeLang", action.lang);
      return { ...state, activeLang: action.lang};
    default:
      return state;
  }
}

export const changeName = name => ({ type: CHANGE_NAME, name: name });
export const changeActiveLanguage = lang => ({ type: СHANGE_ACTIVE_LANG, lang: lang });