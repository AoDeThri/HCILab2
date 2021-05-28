import { queryFakeList, uploadFile, addToWishList, getAllTags } from './service';

const Model = {
  namespace: 'searchList',
  state: {
    imgList: [],
    tagList: [],
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
    },
    *getAllTags({_}, {call, put}){
      const res = yield call(getAllTags)
      yield put({
        type: 'queryTagList',
        payload: Array.isArray(res) ? res : [],
      })
    }
  },
  reducers: {
    queryList(state, action) {
      return { ...state, imgList: action.payload };
    },
    changeList(state, action){
      state.list.forEach(element => {
        if(element.name === action.payload){
          element.inWishlist = true
        }
      });
      return { ...state }
    },
    queryTagList(state, action){
      return { ...state, tagList: action.payload}
    }
  },
};
export default Model;
