import request from 'umi-request';
import { IMG_UPLOAD_PREFIX, WISHLIST_PREFIX, TAG_PREFIX } from "@/target"

export async function queryFakeList(params) {
  return request('/api/fake_list', {
    params,
  });
}

export async function uploadFile(data) {
  return request('',{
    method: 'POST',
    data,
    prefix: IMG_UPLOAD_PREFIX,
  })
}

export async function addToWishList(data){
  return request('', {
    method: 'POST',
    data,
    prefix: WISHLIST_PREFIX,
  })
}

export async function getAllTags(){
  return request('', {
    method: 'GET',
    prefix: TAG_PREFIX
  })
}