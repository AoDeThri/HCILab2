import { queryFakeList, uploadFile, addToWishList } from './service';

const Model = {
  namespace: 'searchList',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryFakeList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *uploadFile({payload}, {call, put}){
      const res = yield call(uploadFile, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(res) ? res : [],
      })
    },
    *addToWishList({payload}, {call, _}){
      const res = yield call(addToWishList, payload);
    }
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
