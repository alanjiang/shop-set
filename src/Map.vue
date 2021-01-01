<template>
  <div class="app">
  
  
   <div class="step">
  
   <el-steps :active="nowStep" align-center>
     <el-step v-for="item in stepList" :key="item" :title="item"></el-step>
   </el-steps>
   </div>
   
   <div class="shop-base-info" v-show="show_step1">
    
    <el-form  label-width="120px">
      <el-form-item label="门店名称"> 
       <el-input v-model="shop.shop_name" maxlength="32" placeholder="门店名称"></el-input>
      </el-form-item>
  
     <el-form-item label="联系电话"> 
       <el-input v-model="shop.shop_tel" maxlength="64" placeholder="联系电话"></el-input>
      </el-form-item>
     

     <el-form-item label="门店简介"> 
       <el-input v-model="shop.shop_discription" maxlength="64" placeholder="门店简介"></el-input>
      </el-form-item>
     
     <el-form-item>
     <el-button type="primary" @click="__stepShop1">保存下一步</el-button>
     </el-form-item>

     </el-form>
    
   
   </div> <!-- end of show_step1 -->
 
    
     <div class="map" v-show="show_step2">
     
     <div class="map-search-box">
      <search  
      :searchCount="2"
      :autoConfirm="true"
      :useClick="true"
      :width="width"
      :height="250"
      @userInput="handleUserInput"
      @pickedLocation="handlePickedLocation">
    </search>
    </div>
   
  
    <div class="map-address">
  
    <el-form  label-width="120px">
    
      <el-form-item label="经纬度"> 
       <el-col :span="6">
       <el-input v-model="lnglat" maxlength="32" placeholder="地图自动填充"></el-input>
      </el-col>
      </el-form-item>
  
     <el-form-item label="地址"> 
     
       <el-input v-model="pLocation.name" maxlength="64" placeholder="地图自动填充"></el-input>
     
      </el-form-item>
     

     <el-form-item label="门牌街道号"> 
   
       <el-input v-model="pLocation.detail" maxlength="64" placeholder="如果地图地址不全面，请填写"></el-input>
    
      </el-form-item>
     
     <el-form-item>
     
      <el-button type="info" @click=backStep1>上一步</el-button>
      <el-button type="primary" @click="__stepShop2">保存下一步</el-button>
      
     </el-form-item>

     </el-form>
     
     </div>  <!-- map-address -->
     
  
     </div>  
     <!-- end of show_step2 -->
    
     <div  class="shop-set" v-show="show_step3">
        
      <el-form  label-width="120px">
      
       <el-form-item label="外卖配送">
       <el-col :span="6">
       <el-radio-group v-model="shop.delivery_set">
          <el-radio :label="2">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
        </el-col>
       </el-form-item>
    
    
 
    
           <el-form-item label="最大配送半径(公里）" v-show="shop.delivery_set == 2"> 
            <el-col :span="3">
              <el-input v-model="shop.max_delivery_distance" maxlength="32" placeholder="输入数值"></el-input>
           </el-col>
           </el-form-item>
           
           <el-form-item label="配送起步金额(RMB)" v-show="shop.delivery_set == 2"> 
              <el-col :span="3">
              <el-input v-model="shop.min_delivery_price" maxlength="64" placeholder="输入金额"></el-input>
             </el-col>
           </el-form-item>
           
           <el-form-item label="配送费(RMB)" v-show="shop.delivery_set == 2"> 
              <el-col :span="3">
              <el-input v-model="shop.delivery_fix" maxlength="64" placeholder="输入金额"></el-input>
             </el-col>
           </el-form-item>
          
      
      <el-form-item label="云打印机">
      <el-col :span="6">
       <el-radio-group v-model="shop.auto_print">
          <el-radio :label="2">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
       </el-col> 
       </el-form-item>
      
      
       
     
       <el-form-item label="微信新订单提醒">
          <el-col :span="6">
       <el-radio-group v-model="shop.order_alert">
          <el-radio :label="2">开启</el-radio>
          <el-radio :label="1">关闭</el-radio>
        </el-radio-group>
        </el-col>
       </el-form-item>
      
     
     
   
     <el-form-item>
       <el-button type="info" @click=backStep2>上一步</el-button>
       <el-button type="primary" @click="__stepShop3">保存下一步</el-button>
    
     </el-form-item>

     </el-form>
        
        
     
     </div> <!-- end of show_step3 -->
     
     
      <div v-show="show_step4">
        
        <ImageCut></ImageCut :imgSrc="shop.objectKey">
        
        <el-form  label-width="120px">
          <el-form-item>
          <el-button type="info" @click=backStep3>上一步</el-button>
          <el-button type="primary" @click="__stepShop4">保存</el-button>
    
         </el-form-item>
       </el-form>
       
     </div>  <!-- end of show_step4 -->
     
     
 
    </div>
    
  
</template>

<script>
import Steps from 'element-ui'
import search from './gaodemap/components/amapsearch/search.vue'
import ImageCut from './imagecut/ImageCut.vue'
import {getShop,stepShop,lastShop} from './api/'
export default {
  name: 'map',
  data() {
    return {
     show_step1: true,
     show_step2: false,
     show_step3: false,
     show_step4: false,
     nowStep: 1,
     stepList: ['门店基本信息',
        '门店地图',
        '门店配置',
        '照片设置'],
      
      width: document.body.clientWidth,
      
      shop: {
        
        shop_name: '',
        shop_discription: '',
        shop_tel: '',
        min_delivery_price: '',
        max_delivery_distance: 0, 
        delivery_fix: '',
        //设置
        order_alert: 2,
        delivery_set: 2,
        auto_print: 2
        
        
        
      },
      
      //map
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
  computed: {
  
   print() {
     
     return this.shop.auto_print
   
   },
  
    lnglat() {
       if(this.pLocation.location.lat == 0 && this.pLocation.location.lng ==0){
         return '';
       }
       return this.pLocation.location.lat+','+this.pLocation.location.lng
    }
    
    
    
    
  },
  created() {
     // eg: https://www.dianliaome.com/mappc/#/2,
     // -1: 代表新增 
     if(this.$route.params.id != -1){ 
     
          getShop({'id':this.$route.params.id}).then((res) => {
           if(res.status != 200){
             this.$message.error('网络故障，请检查网络环境');
             return false;
           }else
           {
              if(res.data.resCode == '0')
              { 
                 
                 if(res.data.shop){
                   this.shop = res.data.shop 
                   this.shop.id = res.data.shop.id
                   //填充model
                   this.initData()
                 }
                 
              }else
              {
              
                 this.$message.error(res.data.resMsg );
                 return false;
              }
          }
        
        });
         
     }
  
  },
  
  methods: {
  
  //保存第1步
  __stepShop1() {
   if(this.shop.shop_name == ''){
      this.$message.error('门店名称必须填写');
      return false;
   }
   
   if(this.shop.shop_tel == ''){
      this.$message.error('门店电话必须填写');
      return false;
   }
   var shop = this.reverseShop()
   
   stepShop(shop).then((res) => {
           if(res.status != 200){
             this.$message.error('网络故障，请检查网络环境');
             return false;
           }else
           {
              if(res.data.resCode == '0')
              { 
                 
                 this.hideStep(1)
                 
              }else
              {
              
                 this.$message.error(res.data.resMsg );
                 return false;
              }
          }
        
        });
  
  
  
  },
  //保存第2步
  __stepShop2() {
   var shop = this.reverseShop()
   stepShop(shop).then((res) => {
           if(res.status != 200){
             this.$message.error('网络故障，请检查网络环境');
             return false;
           }else
           {
              if(res.data.resCode == '0')
              { 
                 
                 this.hideStep(2)
                 
              }else
              {
              
                 this.$message.error(res.data.resMsg );
                 return false;
              }
          }
        
        });
  
  
  
  },
  
  //保存第3步
   __stepShop3() {
   var shop = this.reverseShop()
   stepShop(shop).then((res) => {
           if(res.status != 200){
             this.$message.error('网络故障，请检查网络环境');
             return false;
           }else
           {
              if(res.data.resCode == '0')
              { 
                 
                 this.hideStep(3)
                 
              }else
              {
              
                 this.$message.error(res.data.resMsg );
                 return false;
              }
          }
        
        });
 
  },
  
  //保存第4步
  __stepShop4() {
   var shop = this.reverseShop()
   lastShop(shop).then((res) => {
           if(res.status != 200){
             this.$message.error('网络故障，请检查网络环境');
             return false;
           }else
           {
              if(res.data.resCode == '0')
              { 
                 
                this.linkto("/security_shop/browse")
                 
              }else
              {
              
                 this.$message.error(res.data.resMsg );
                 return false;
              }
          }
        
        });
  
  
  
  },
  
  
  initData() {
     
    
    
    if(this.shop.location && this.shop.location.indexOf(',') != -1){
      this.pLocation.location.lng = this.shop.location.split(',')[0]
      this.pLocation.location.lat = this.shop.location.split(',')[1]
    }
    this.pLocation.name = this.shop.shop_address  
    this.pLocation.province = this.shop.province
    this.pLocation.city = this.shop.city
    this.pLocation.district = this.shop.district
    this.pLocation.detail  = this.shop.shop_detail
    this.pLocation.citycode  = this.shop.citycode 
    this.pLocation.adcode  = this.shop.adcode 
    //alert(JSON.stringify(this.shop))    
   
  
  },
  
  reverseShop( ){
    
    
    this.shop.location = this.pLocation.location.lng+','+this.pLocation.location.lat
    this.shop.shop_address  = this.pLocation.name
    this.shop.province = this.pLocation.province
    this.shop.city = this.pLocation.city
    this.shop.district = this.pLocation.district
    this.shop.shop_detail =  this.pLocation.detail
    this.shop.citycode = this.pLocation.citycode
    this.shop.adcode = this.pLocation.adcode
    //alert(JSON.stringify(this.shop))
    return  this.shop;
  },

  
  hideStep(i) {
  
     if(i == 1){
       this.nowStep = 2
       this.show_step2 = true
       this.show_step1 = false
       this.show_step3 = false
       this.show_step4 = false
     }
     
     if(i == 2){
       this.nowStep = 3
       this.show_step3 = true
       this.show_step1 = false
       this.show_step2 = false
       this.show_step4 = false
     }
     
     if(i == 3){
       this.nowStep = 4
       this.show_step4 = true
       this.show_step1 = false
       this.show_step2 = false
       this.show_step3 = false
     }
     
     
     
  },
   backStep1() {
  
       this.nowStep = 1
       this.show_step1 = true
       this.show_step2 = false
       this.show_step3 = false
       this.show_step4 = false
       
       
  },
  backStep2() {
       this.nowStep = 2
       this.show_step2 = true
       this.show_step1 = false
       this.show_step3 = false
       this.show_step4 = false
  },
  
  backStep3() {
       this.nowStep = 3
       this.show_step3 = true
       this.show_step1 = false
       this.show_step2 = false
       this.show_step4 = false
  },
  
   

     handleUserInput(input){
        this.userInput = input
     },
     
     linkto(url) {
      
        window.open(url)
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
    search,ImageCut
   
  }
}
</script>

<style lang="stylus" scoped>
.app
  font-family: Helvetica, sans-serif;
  text-align: center;
  .step
    position: relative
    height: 65px
  .shop-base-info
    position: relative
    padding: 10px 15px
  .shop-set
    position: relative
    padding: 10px 15px
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
            background: #836FFF
            color: #fff
            font-size: 14px
            width: 120px
            height: 20px
            padding: 10px 15px
        .map-form
          margin-top: 10px
          padding: 15px 8px
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
            background-color:rgba(241,241,241,.98)
            width: 220px
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
            width: 220px
            height: 35px
            padding: 10px
            resize: none
    

</style>
