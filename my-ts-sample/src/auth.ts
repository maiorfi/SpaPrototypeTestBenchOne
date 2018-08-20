import Vue from 'vue';
import router from './router'
import axios from 'axios';
import VueAxios from 'vue-axios';

(Vue as any).router = router;
Vue.use(VueAxios, axios);
axios.defaults.baseURL = 'https://localhost:44317/api/v1';

let vueauth = require('@websanova/vue-auth');

// https://github.com/websanova/vue-auth/blob/master/docs/Authentication.md
Vue.use(vueauth, {
   http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
   router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
   authRedirect: {path: '/login'},
   //auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
   auth: {
    request: function (req: any, token: any) {
      req.headers['Authorization'] = 'Bearer ' + token;
    },
    response: function (res: any) {
      if(res.data.token)
         return res.data.token;
    }
  },
});

axios.interceptors.response.use(undefined, err => {
  let res = err.response;
  
  // Unauthorized Access      
  if (!err.response || (res.status === 401 && ['UnauthorizedAccess', 'InvliadToken'].indexOf(res.data.code) > -1)) {
    vueauth.logout({ makeRequest: false });
  }
  // System Error
  else if (res.status === 500) {
      // Redirect to 500 page
      console.log("Error 500");
  };
})

export default axios;