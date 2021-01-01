import { async_post,get,post,del,delParam } from './helpers'

const getShop = get('/security_shop/get')
const stepShop = post('/security_shop/step')
const lastShop = post('/security_shop/last')

export {
	 getShop,stepShop,lastShop
}