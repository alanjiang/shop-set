import Vue from 'vue'
import Router from 'vue-router'

import map from '../Map.vue'


Vue.use(Router)

export default new Router({
  routes: [
	{
	    path: '/:id',
	    name: 'Map',
	    component: map
	}
	
	 
    
   
  ]
})
