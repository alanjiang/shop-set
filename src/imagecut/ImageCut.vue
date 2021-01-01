<template>
  <div class="container">
    <span class="photo">
	   <my-upload field="upload"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="show"
		:width="300"
		:height="300"
		url="https://www.dianliaome.com/file_upload"
		:params="params"
		:headers="headers"
		img-format="png"></my-upload>
	   <img :src="imgDataUrl">
	 </span>
	 <span class="btn">
	  <el-button type="primary" @click="toggleShow">{{btn_msg}}</el-button>
	 </span> 
	 <div class="msg">
	   为保证照片的最佳效果，照片的大小限制在200KB-2MB。
	 </div>
  </div>
</template>
<script>

import 'babel-polyfill'; // es6 shim
import myUpload from 'vue-image-crop-upload';
export default {
  name: 'ImageCut',
  props: {
    msg: String,
    imgSrc: ''
  },
  data() {
   return {
     btn_msg: '上传照片',
     show: false,
	 params: {
      token: '123456798',
	  name: 'avatar'
	},
	headers: {
	  smail: '*_~'
	},
	
     imgDataUrl: this.imgSrc
    }
  },
  components: {
      'my-upload': myUpload
    },
    methods:{
    toggleShow() {
	this.show = !this.show;
	},
	cropSuccess(imgDataUrl, field){
		console.log('-------- crop success --------');
		this.imgDataUrl = imgDataUrl;
	},
	cropUploadSuccess(jsonData, field){
	
	    if(jsonData.resCode == '0'){
	      this.$message({
             message: '上传成功',
             type: 'success'
           });
	    }else{
	      this.$message.error(jsonData.resMsg);
	    }
		
		this.btn_msg='重新上传';
	},
	cropUploadFail(status, field){
		console.log('-------- upload fail --------');
		console.log(status);
		console.log('field: ' + field);
	}
    }
}
</script>


<style lang="stylus" scoped>

 .container
 
   padding: 15px 15px
   font-size: 14px
   color: #000
   display: flex
   flex-direction: column
   vertical-align: middle
   justify-content: center
   align-items: center
   .btn
      width: 200px
      line-height: 25px
    .photo  
      padding: 5px 5px
    .msg
      color: #000
      font-size: 13px
      
      
</style>