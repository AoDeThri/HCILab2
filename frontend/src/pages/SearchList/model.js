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
    *addToWishList({payload}, {call, put}){
      const res = yield call(addToWishList, payload);
      yield put({
        type: 'changeList',
        payload: payload.get("file")
      })
    }
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
    changeList(state, action){
      state.list.forEach(element => {
        if(element.name === action.payload){
          element.inWishlist = true
        }
      });
      return { ...state }
    }
  },
};
export default Model;
