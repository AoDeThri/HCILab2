import { deleteWishlist, queryWishlist } from './service';

const Model = {
  namespace: 'wishlist',
  state: {
    list: [],
  },
  effects: {
    *fetch(_, {call, put}){
      const res = yield call(queryWishlist);
      yield put({
        type: 'queryWishlist',
        payload: Array.isArray(res) ? res : [],
      })
    },
    *delImg({payload}, {call, put}){
      const res = yield call(deleteWishlist, payload)
      yield put({
        type: 'queryWishlist',
        payload: Array.isArray(res) ? res : [],
      })
    }
  },
  reducers: {
    queryWishlist(state, action){
      return { ...state, list: action.payload }
    }
  },
};
export default Model;
