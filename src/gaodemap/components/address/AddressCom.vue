<template>
  <div id="app" ref="wrapper">
   
   <div class="content" ref="content">
     <div class="back">
       
           <router-link :to="{path:'/',query:{tab:'address'}}"> <i class="icon-arrow_lift"></i> </router-link>
     </div>
   
    <div class="map">
     <div class="map-search-box">
      <search ref="amap"
      :selectedPoi="pLocation"
      :searchCount="2"
      :autoConfirm="true"
      :useClick="true"
      :width="width"
      :height="260"
      @userInput="handleUserInput"
      @pickedLocation="handlePickedLocation">
    </search>
    </div>
    
    <div class="map-address">
    
     <span> 
     <label>经纬度<font color='red'>*</font></label>
     <input class='disable-input'  type = 'text' name = 'lnglat' v-model='lnglat' placeholder='地图自动填充'>
     </span>
     <span> 
     <label>地址<font color='red'>*</font></label>
     <textarea  name = 'address'   placeholder='地图自动填充'>{{pLocation.name}}</textarea>
     </span>
     <span> 
     <label>门牌街道号</label>
     <input class='editable-input' type = 'text' name = 'detail' v-model='pLocation.detail' placeholder='如果地图地址不够全面,请填写'>
     </span>
     <span> 
     <label>收件人<font color='red'>*</font></label>
     <input class='editable-input' type = 'text' name = 'recname' v-model='recname' placeholder='填写收件人'>
     </span>
     <span> 
     <label>收件人电话<font color='red'>*</font></label>
     <input class='editable-input' type = 'text' name = 'mobile' v-model='mobile' placeholder='填写收件人电话'>
     </span>
     <span>
      <label>设为默认地址</label>
      <cube-switch v-model="default_set"></cube-switch>
     </span>
     
     <!--
     <p v-show="pLocation.province">省级行政区：{{pLocation.province}}</p>
     <p v-show="pLocation.city">市级行政区：{{pLocation.city}}</p>
     <p v-show="pLocation.district">区级行政区：{{pLocation.district}}</p>
      <p v-show="pLocation.citycode">citycode：{{pLocation.citycode}}</p>
      <p v-show="pLocation.adcode">adcode：{{pLocation.adcode}}</p>
     -->
     
     <div class="btn-control">
      
       <div class="submit-btn" @click="submit">
         保存地址
       </div>
     
     </div>
     
     <div class="btn-control">
      <router-link :to="{path:'/',query:{tab:'address'}}"> 
       <div class="submit-btn">
           返回地址簿
       </div>
       </router-link>
     
     </div>
     
     
    </div>
   
    </div>
    
    </div>
    
  </div>
</template>

<script>

import BScroll from 'better-scroll'
import search from '../amapsearch/search.vue'
import {updateAddress,autoLogin,loadAddress} from   '../../../api'
export default {
  name: 'map',
  computed: {
  
  
    lnglat() {
       if(this.pLocation.location.lat == 0 && this.pLocation.location.lng ==0){
         return '';
       }
       return this.pLocation.location.lat+','+this.pLocation.location.lng
    }
  },
  data() {
    return {
      address: {}, //加载出来的地址
      default_set: true,
      recname: '',
      mobile: '',
      width: document.body.clientWidth,
      userInput: '', 
      pLocation: {
        location: { lat:0,lng:0 },
        name: '',
        province: '',
        city: '',
        district: '',
        detail:'',
        citycode:'',
        adcode:''
        
      }
     }
    
  
  },
  
  mounted() {

   const that = this
      window.onresize = () => {
        return (() => {
          window.screenWidth = document.body.clientWidth
          that.width = window.screenWidth
        })()
     }
  },
  
  created() {
     
     if(this.$route.query.id){
     
         this.getAddress()
     }
     
     
     this.$nextTick(() => {
         this.myScroll() 
        
     })
     
     
  },
  methods: {
  
  //加载的地址信息处理可见
  initData() {
     
    this.recname =  this.address.name
    this.mobile = this.address.mobile
    this.pLocation.name = this.address.address_name
    this.pLocation.province = this.address.province
    this.pLocation.city = this.address.city
    this.pLocation.district = this.address.district
    this.pLocation.detail = this.address.detail
    this.pLocation.citycode = this.address.citycode
    this.pLocation.adcode = this.address.adcode
    if(this.address.address_lnglat){
      if(this.address.address_lnglat.indexOf(',') != -1){
        var array = this.address.address_lnglat.split(',')
        this.pLocation.location.lng = array[0]
        this.pLocation.location.lat = array[1]
        
      }
    }
    
    if(this.address.default_set == 2) {
       this.default_set = true
    }else{
        this.default_set = false
    }
    //this.$refs.amap.method()
  
  },
  
  
  //loadAddress
  getAddress () {
      
      var bean = {}
      bean.id = this.$route.query.id //由router-link传递过来
      
      loadAddress(bean).then((res) => {
           
           if(res.status != 200){
             this.showMsg(1000,'服务器请求未响应，请检查网络环境');
             return false;
           }else{
             if(res.data.resCode=='999999'){
                this.showMsg(1000,'登陆超时，请重新扫码登录');
                this._auth()
             }else if(res.data.resCode=='0'){
                 this.address = res.data.address
                 if(this.address.id) {
                   this.initData()
                 }
                 
             }else{
             
                this.showMsg(1000,res.data.resMsg);
                return false;
             }
         }
       });
   },
  
  submit () {
      if(this.pLocation.name == '' ){
        this.showMsg(1000,'未从地图选择地址');
        return false;
      }
      if(this.recname == '' ){
        this.showMsg(1000,'收件人未填写');
        return false;
      }
      if(this.mobile == '' ){
        this.showMsg(1000,'收件人电话未填写');
        return false;
      }
      var pcd = this.pLocation.province+this.pLocation.city+this.pLocation.district
      var location = '';
      if(this.pLocation.name.indexOf(pcd) == -1 ){
         location = pcd+this.pLocation.name
      
      }else{
         location = this.pLocation.name
      
      }
      
      
      var bean = {'address_name':location, 'name': this.recname, 'mobile':this.mobile,
                  'province':this.pLocation.province,'city':this.pLocation.city,
                  'district':this.pLocation.district,
                  'detail':this.pLocation.detail,
                  'address_lnglat': this.lnglat,
                  'citycode': this.pLocation.citycode,
                  'adcode': this.pLocation.adcode
                  

                   }
      
      if(this.$route.query.id ){
          bean.id = this.$route.query.id //由router-link传递过来
      }    
     
      var judge = new Boolean(this.default_set);
      if(judge == true){
        
        bean.default_set=2;
      }else{
        bean.default_set=1;
      }
      updateAddress(bean).then((res) => {
           
           if(res.status != 200){
             this.showMsg(1000,'服务器请求未响应，请检查网络环境');
             return false;
           }else{
             if(res.data.resCode=='999999'){
                this.showMsg(1000,'登陆超时，请重新扫码登录');
                this._auth()
             }else if(res.data.resCode=='0'){
             
                this.showMsg(1000,'保存成功');
                this.$router.push({path:'/', query:{tab:'address'}})
                
             }else{
             
                this.showMsg(1000,res.data.resMsg);
                return false;
             }
         }
       });
   },
  
    //消息方法    
    showMsg(ms,msg ) {
         const toast = this.$createToast({
           time: ms,
           txt: msg
         });
         toast.show();
     },
     _auth() {
      
        var bean = JSON.parse(localStorage.getItem("wechatUserInfoForm"));
        if(!bean){
          return false
        }
         this.showMsg(1000,'开始自动登录');
         autoLogin(bean).then((res) => {
           if(res.status != 200){
             this.showMsg(1000,'服务器请求未响应，请检查网络环境');
             return false;
           }else
           {
              this.showMsg(1000,'登录成功,请重新操作');
            }
        
        });
      
      },
 
    myScroll () {
      const options = {
        scrollY: true, 
        scrollX: false,
        mouseWheel: true,
        click: true,
        tap: true
      }
      var height = 700
    
      this.$refs.content.style.height = height + 'px'  // 修改滚动区域的宽度
      
      var bScroll  = new BScroll(this.$refs.wrapper, options)
      bScroll.refresh();
      
        
    },
  
     handleUserInput(input){
        this.userInput = input
     },
     
     
     
     
     handlePickedLocation(picker){
         this.pLocation.location = {'lat':picker.location.lat,'lng':picker.location.lng}
         this.pLocation.name = picker.name;
         this.userInput = this.pLocation.name
         this.pLocation.address = picker.address;
         if(picker.province){
           this.pLocation.province = picker.province;
         }
         if(picker.city){
           this.pLocation.city = picker.city;
         }
         if(picker.district){
           this.pLocation.district = picker.district;
         }
         if(picker.citycode){
            this.pLocation.citycode = picker.citycode;
         }
         if(picker.adcode){
             this.pLocation.adcode = picker.adcode;
         }
        
        
         
         console.log('picker:'+JSON.stringify(picker))
     }
     
  },
  components:
  {
    search
  }
}
</script>

<style lang="stylus" scoped>
#app
  font-family: Helvetica, sans-serif
  text-align: left
  width: 100%
  height: 100%
  position: fixed
  left: 0
  top: 0
  overflow: hidden
  .content
    padding: 3px
    .back
        position: relative
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size: 16px
          color: #e8864c
    .map
      display: flex
      flex-direction: column
      .map-search-box
        border-radius: 15px
      .map-address
        display: flex
        flex-direction: column
        .btn-control
          display: flex
          justify-content: center
          align-items: center
          .submit-btn
            margin-top: 20px
            text-align: center
            border-radius: 5px
            background: red
            color: #fff
            font-size: 14px
            width: 120px
            height: 20px
            padding: 10px 15px
        span
          text-align: left
          font-color: #000
          font-size: 12px
          line-height: 20px
          padding: 3px 3px
          display: flex
          label
            padding: 3px 3px
            height: 20px
            width: 90px
          .editable-input
            border:0
            border-radius:5px
            background-color:#FFFAFA
            width: 300px
            height: 20px
            padding: 3px 3px
            resize: none
          .disable-input
            border:0
            border-radius:5px
            background-color:rgba(241,241,241,.98)
            width: 160px
            height: 20px
            padding: 3px 3px
            resize: none
          textarea
            border:0
            border-radius:5px
            background-color:rgba(241,241,241,.98)
            width: 300px
            height: 35px
            padding: 10px
            resize: none

</style>
