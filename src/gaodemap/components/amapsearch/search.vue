<template>
  <div class="amap-search__container" :style="{width: width + 'px',height: height + 'px'}">
  
    <!--自动输入框-->
    <div class="amap-search__autocomplate">
        <input type="text" v-model="autocomplateInput" id="autocomplate-input" 
        @keyup.enter="searchDefaultSuggestion" autocomplete="off"
        placeholder="输入详细地址,越详细定位越精准"/>
        <a class="amap-search__search-btn" @click="searchDefaultSuggestion">
            搜索
        </a>
    </div>

    <!--自定义的窗体 marker-content -->
    <div ref="marker-content" class="marker-content" v-show="selectedPoi.location.lat">
      <div class="marker-content-header">
          <span v-show="selectedPoi.isMoved==false" class="notice-icon">&#9873;</span>
          <span v-show="selectedPoi.isMoved==false" class="notice">当前选择地址位置为</span>
          <span v-show="selectedPoi.isMoved" class="notice">坐标定位</span>
      </div>
      <div class="marker-info">
          <div class="marker-name">{{selectedPoi.name}}</div>
          <div class="marker-address">{{selectedPoi.address}}</div>
      </div>
      <!--
      <a v-show="selectedPoi.isMoved" class="amap-search__confirm-btn" @click="setMarkerLocation(selectedPoi)">确定</a>
      -->
    </div>

    <!--地图容器-->
    <div id="amap-container"></div>
  </div>
</template>

<script>

 import amapmixinApp from '../../mixins/amap'
 export default {
 
   name: 'amapSearch',
   mixins: [amapmixinApp],
   data: function () {
        return {
            // 高德地图相关的 amapmixin 中使用的 
            autocomplateInput: '',
        };
    },
    watch: {
        autocomplateInput: function (val, oldVal) {
            this.$emit('userInput', val);
        },
        //经纬度有改变触发pickedLocation事件
        'selectedPoi.location.lat': function selectedPoiLocation(newVal, oldVal) {
            /**
             * 如果不显示确定按钮, 拖到那里是哪里的话,
             * searchCount 默认为1
             */
            if (this.autoConfirm) {
                this.selectedPoi.isMoved = false;
                var loc = JSON.stringify(this.selectedPoi);
               
                this.$emit('pickedLocation', JSON.parse(loc));
            }
        }
    },
    props: {
        defaultLng: {
            type: Number,
            default: 39.90923,
            required: false
        },
        defaultLat: {
            type: Number,
            default: 116.397428,
            required: false
        },
        defaultCity: {
            type: String,
            default: '北京',
            required: false
        },
        searchCount: {
            type: Number,
            default: 1,
            required: false
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        autoConfirm: {
            type: Boolean,
            default: false,
            required: false
        },
        useClick: {
            type: Boolean,
            default: false,
            required: false
        }
    },
    methods: {
    	
    	changePicker: function () {
    		
    		   if (this.autoConfirm) {
                this.selectedPoi.isMoved = false;
                var loc = JSON.stringify(this.selectedPoi);
                //不通过经纬度改变触发，获取行政区域后触发 amap.js
                this.$emit('pickedLocation', JSON.parse(loc));
            }
    		
    	},
    	
    	
        setMarkerLocation: function () {
            if (this.autoConfirm == false) {
                this.selectedPoi.isMoved = false;
                var loc = JSON.stringify(this.selectedPoi);
                this.$emit('pickedLocation', JSON.parse(loc));
                //点击信息窗体的确定按钮，关闭窗体
            }
        }
    },
    mounted: function () {
    	 
        // 初始化 domId
        this.initAmap('amap-container', [this.defaultLat, this.defaultLng]);
        /**
         * 如果不显示确定按钮, 拖到那里是哪里的话,
         * searchCount 默认为1
         */
        var searchCount = this.autoConfirm ? 1 : this.searchCount;
        /**
         * 如果支持用户点击, 点在哪里是哪里
         * searchCount 默认为1
         */
        if (this.useClick) {
            this.initMouseTools();
            searchCount = 1;
        }
        // 初始化 自动完成 domId ''代表默认全国
        this.initAutocomplate("autocomplate-input", searchCount, this.defaultCity);
        
    }
    
 
 
 
 }
</script>

<style lang="stylus" scoped>

  
.amap-search__container
  position: relative
  width: inherit
  height: inherit
  margin: 0 auto
  #amap-container
    width: inherit
    height: inherit
  .amap-search__autocomplate 
    width: 300px
    z-index: 20
    background-color: #ddf
    color: #333
    box-shadow: 0px 2px 4px 0px silver
    position: fixed
    top: 70px
    left: 50%
    margin-left: -125px
    overflow: hidden
    line-height: 20px
    height: 34px
    line-height: 34px
    display: flex
    flex: 1
    justify-content:stretch
    input[type="text"] 
      height: 25px
      border: 0
      width: auto
      outline: none
      height: inherit
      line-height: inherit
      font-size: 14px
      padding-left: 15px
      border-radius: 5px 0px 0px 5px
      flex: 1
      &:focus
        border: none !important
    a.amap-search__search-btn 
      text-align: center
      background: red
      color: #fff
      padding: 1px 10px
      border:0
      width: 40px
      height: inherit
      font-size: 13px
      line-height: inherit
  .marker-content
    a.amap-search__confirm-btn
      background: #06C1AE
      color: #fff
      border:0
      min-width: 40px
      text-align: center
      font-size: 12px
      height: 34px
      line-height: 34px
      padding:0px 10px
      display: inline-block
      border-radius: 5px
    .marker-content-header
      border-bottom: 1px solid #E5E5E5
      height: 24px
      background: none
      .marker-circle
        background: #99D465
        height: 18px
        width: 18px
        border-radius: 9px
        color: #fff;
        float: left;
        text-align: center
        span
          line-height: 18px
          width: 18px
      .notice-icon
         color: #06C1AE
         margin-right: 8px
       .notice
          font-size: 12px
          font-weight: bold
   .marker-info
       padding-top: 10px
       .marker-name 
          font-size: 15px
       .marker-address 
         padding: 5px 0px
         font-size: 12px
         color: #a0a0a0
   
.amap-sug-result 
  border-radius: 5px
  box-shadow: 0px 2px 4px 0px silver
  border: none
  font-family: "Helvetica Neue",Helvetica,Arial,sans-serif
  .auto-item
    font-size: 14px
    height: 24px
    line-height: 24px
    padding-left: 15px
    .auto-item-span
      font-size: 12px
.amap-info-outer
  border-radius: 5px !important
  border: none !important

</style>