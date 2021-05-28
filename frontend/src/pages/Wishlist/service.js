import request from 'umi-request';
import { WISHLIST_PREFIX } from '@/target'

export async function queryFakeList(params) {
  return request('/api/fake_list', {
    params,
  });
}

export async function queryWishlist () {
  return request('',{
    method: 'GET',
    prefix: WISHLIST_PREFIX
  })
}

export async function deleteWishlist (params) {
  return request('', {
    method: 'DELETE',
    params,
    prefix: WISHLIST_PREFIX
  })
}