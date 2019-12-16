<template>
  <div class="container_box_div">
    <div class="header">
      <a href="#">
        <img src="../assets/images/Insert_logo.png" class="Insert_logo" />
      </a>
      <div class="Login_div">
        <div class="Date_div">
          <div class="Week_div">{{ dateFormat }}</div>
          <div class="Date_text">{{ dayFormat }}</div>
        </div>
      </div>
    </div>
    <div class="content_box_div">
      <div class="Drop_down_box">
        <div class="Drop_down_div">
          <select v-model="selsctValuea">
            <option v-for="(item, index) in chenJianOptions" :key="index" :value="item.chejian">{{item.chejian}}</option>
          </select>
        </div>
        <div class="Drop_down_div">
          <select v-model="selsctValueb">
            <option v-for="(item, index) in gongDuanOptions" :key="index" :value="item.gongduan">{{item.gongduan}}</option>
          </select>
        </div>
        <div class="Drop_down_div">
          <select v-model="selsctValuec">
            <option v-for="(item, index) in productTypeOptions" :key="index" :value="item.cplb">{{item.cplb}}</option>
          </select>
        </div>  
      </div>
    </div>
    <div class="Tip_box_div">
      <div class="Arrow_t_int">&nbsp;</div>
      <div class="Tip_div">
        <div class="Tip_left_div">工序类目:</div>
        <div class="Tip_main_div">
          <el-button
            :loading="loading" 
            type="primary" 
            v-for="(item, index) in workingProcedureOptions" 
            :key="index" 
            :value="item.isshow"
            :class="[item.isshow ? 'Yellow_btn' : 'Bule_btn']" 
            @click="showTableDate(item.gongXu)">{{ item.gongXu }}
          </el-button>
        </div>
      </div>
    </div>
    <div class="Open_table_div">
      <el-table :data="userUp" style="width: 100%" :header-cell-style="{background:'#092450', color: '#8ec0fd'}" @row-click="showDownTableDate">
        <el-table-column prop="gongxu" label="工序" align="center"></el-table-column>
        <el-table-column prop="control" label="控制点" align="center"></el-table-column>
        <el-table-column prop="data" label="控制点数据" align="center"></el-table-column>
        <el-table-column prop="shangxian" label="上限" align="center"></el-table-column>
        <el-table-column prop="xiaxian" label="下限" align="center"></el-table-column>
      </el-table>
    </div>
    <div class="Open_table_div">
      <el-table :data="userDown" style="width: 100%" :header-cell-style="{background:'#092450', color: '#8ec0fd'}">
            <el-table-column prop="datetime" label="时间" align="center"></el-table-column>
            <el-table-column prop="gongxu" label="工序" align="center"></el-table-column>
            <el-table-column prop="kongzd" label="控制点" align="center"></el-table-column>
            <el-table-column prop="shuju" label="数据" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { $api } from "@helper";
import _ from "lodash";
import Moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: "processControl",
  data () {
    return {
      query: {
        workShop: "",
        gongDuan: "",
        cplb: "",
        gx: "",
        KZD: ""
      },
      loading: false,
      userUp: [],
      userDown: [],
      chenJianOptions: [],
      gongDuanOptions: [],
      productTypeOptions: [],
      workingProcedureOptions: [],
      selsctValuea: [],
      selsctValueb: [],
      selsctValuec: []
    }
  },
  watch: {
    selsctValuea () {
      this.getGongDuanSelect()
    },
    selsctValueb () {
      this.getProductTypeSelect()
    },
    async selsctValuec () {
      await this.getWorkingProcedure()
    }
  },
  created () {
    this.init()
  },
  computed : {
    dateFormat () {
      return Moment().format('dddd')
    },
    dayFormat () {
      return Moment().format('LL')
    }
  },
  methods: {
    init () {
      this.getChenJianSelect()
    },
    async getChenJianSelect() {
      try {
        const respones = await $api.tuanchu.getChenJian();
        this.chenJianOptions = JSON.parse(respones);
        this.selsctValuea = this.chenJianOptions[0].chejian
      } catch (e) {}
    },
    async getGongDuanSelect() {
      try {
        this.query.workShop = this.selsctValuea;
        const respones = await $api.tuanchu.getGongDuan(_.pick(this.query, ["workShop"]));
        this.gongDuanOptions = JSON.parse(respones);
        this.selsctValueb = this.gongDuanOptions[0].gongduan;
      } catch (e) {}
    },
    async getProductTypeSelect() {
      try {
        this.query.gongDuan = this.selsctValueb
        const respones = await $api.tuanchu.getProductType(_.pick(this.query, ["workShop", "gongDuan"]));
        this.productTypeOptions = JSON.parse(respones);
        this.selsctValuec = this.productTypeOptions[0].cplb;
      } catch (e) {}
    },
    async getWorkingProcedure() {
      try {
        this.loading = true
        this.query.cplb = this.selsctValuec
        const respones = await $api.tuanchu.getWorkProduce(_.pick(this.query, ["workShop", "gongDuan", "cplb"]));
        this.workingProcedureOptions = JSON.parse(respones);
        if (this.workingProcedureOptions) {
          this.showTableDate(this.workingProcedureOptions[0].gongXu)
        }
      } catch (e) {}
      this.loading = false
    },
    showTableDate (isshow) {
      this.query.gx = isshow
      this.getControlPoint()
    },
    async getControlPoint () {
      try {
        const respones = await $api.tuanchu.getControlPoint(_.pick(this.query, ["workShop", "gongDuan", "cplb", "gx"]));
        this.userUp = JSON.parse(respones)
        if (this.userUp) {
          this.showDownTableDate(this.userUp[0])
        }
      } catch (e) {}
    },
    showDownTableDate (row) {
      this.query.KZD = row.control
      this.getEJJMSJ();
    },
    async getEJJMSJ () {
      try {
        const respones = await $api.tuanchu.getEJJMSJ(this.query);
        this.userDown = JSON.parse(respones);
      } catch (e) {}
    }
  }
}
</script>
<style>
.container_box_div {
	width:100%;
	margin: 0 auto;
	overflow: hidden;
}
.header{
	height:72px;
	padding:0 20px;
	background:url(../assets/images/header_bg.png) repeat-x bottom;
}
.header .Insert_logo{
	width:140px;
	margin:20px 0 0 0;
	float:left;
	}
.header .Login_div {
  float: right;
  margin: 6px 0 0 0;
}
.Login_div .Date_div {
  float: left;
  margin: 0 30px 0 0;
  overflow: hidden;
}
.Date_div .Week_div{
	font-weight:bold;
	text-align: right;
	margin: 8px 0 3px 0;
	color:#35a6ff;
	font-size: 14px;
}
.Date_div .Date_text{
	text-align: right;
  color:#35a6ff;
}
.content_box_div {
	padding: 20px;
}
.Drop_down_box{
	width:100%;
  background: linear-gradient(to right,#0d1d61,#081334);
  background: linear-gradient(to right top,#0d1d61,#081334);
  background: linear-gradient(90deg,#0d1d61,#081334);
  border-radius: 4px;
  height:40px;
	}
.Drop_down_box .Drop_down_div{
	margin:10px 0 0 20px;
  float: left;
  overflow: hidden;
  border-right: 1px solid #1e59a9;
  padding: 0 20px 0 0;
}
.Drop_down_box select {
  border:1px solid #0d1d61;
  height:20px;
	line-height:20px;
  color: #34a6ff;
  border-radius: 4px;
  background: url(../assets/images/down.png) no-repeat scroll right 3px center;
  background-size: 12px;
  padding-right:10px;
	font-size:14px;
	max-width:120px;
}
.Drop_down_box  .Year_div{
	float:right;
	margin:10px 20px 0 0;
}
.Drop_down_box .Drop_down_div:last-child{
	border:none;
}
.Drop_down_box option{
	color:#34a6ff;
  height:30px;
	line-height:30px;
	background:#0d1e62;
}
.container_box_div .Chart_box_div{
	width:100%;
	overflow: hidden;
   margin: 20px 0 0 0;
	display: flex;
  justify-content: space-between;
}
.Chart_box_div .Chart_div{
	background:#051847;
  border-radius: 4px;
	width: 100%;
  margin: 0 20px 0 0;
	padding:20px;
}
.Chart_box_div .Chart_div:last-child{
	margin:0;
}
.Chart_box_div .Chart_title_div{
	font-size:16px;
	font-weight:bold;
	color:#8ec0fd;
	height:30px;
	line-height:30px;
}
.Chart_title_div .More_news {
  float: right;
}
.Chart_title_div .More_news img {
  margin: 14px 16px 0 0;
}
.Chart_box_div .Chart_main_div{
	margin:20px 0 0 0;
}
.container_box_div .Pass_rate_box_div {
  width: 100%;
  overflow: hidden;
  margin:35px 0 0 0;
}
.Pass_rate_box_div .Chart_box_div{
	width:100%;
	overflow: hidden;
   margin: 20px 0 0 0;
}
.Pass_rate_box_div .Chart_title_div{
	text-align:center;
	color:#ff0000;
	font-size:16px;
	width: 100%;
}
.Pass_rate_box_div .Chart_main_div{
	text-align:left;
	font-size:12px;
	width: 100%;
  margin:35px 0 0 0;
}
/*弹出开始*/
.Tip_box_div{
  color: #8ec0fd;
  text-align:left;
  background: #081334;
  position: relative;
  margin: 20px;
  padding: 20px;
  /* float: left; */
  border-radius: 4px;
  box-shadow: 0px 0px 10px #5d9cec;
}
.Tip_box_div .Arrow_t_int{
  width: 24px;
  height: 13px;
  background: url(../assets/images/Open_bg.png) no-repeat 0 bottom;
  position: absolute;
  top: -11px;
  left: 40px;
}
.Tip_box_div .Tip_div{
	overflow:hidden;
	display: flex;
  justify-content: flex-start;
}
.Tip_div .Tip_left_div{
	overflow:hidden;
	margin:0 10px 0 0;
	float:left;
	font-size: 16px;
  min-width:80px;
}
.Tip_div .Tip_main_div{
	overflow:hidden;
	float:left;
}
.Yellow_btn{
  background: linear-gradient(to right,#ffce55,#fb6f52);
  background: linear-gradient(to right top,#ffce55,#fb6f52);
  background: linear-gradient(90deg,#ffce55,#fb6f52);
	}
.Yellow_btn:hover, .Yellow_btn:focus{
  background: linear-gradient(to right,#ffce55,#fb6f52);
  background: linear-gradient(to right top,#ffce55,#fb6f52);
  background: linear-gradient(90deg,#ffce55,#fb6f52);
  opacity: 0.8;
}
.Bule_btn {
  color:#fff;
  background: linear-gradient(to right,#00b6ee,#1b6ce9);
  background: linear-gradient(to right top,#00b6ee,#1b6ce9);
  background: linear-gradient(90deg,#00b6ee,#1b6ce9);
}
.Bule_btn:hover {
  opacity: 0.8;
}
.Open_btn_div{
	float:right;
	height:50px;
  line-height:50px;
  background: url(../assets/images/up.png) no-repeat right center;
	background-size:14px;
}
.Open_btn_div a{
	color:#8ec0fb;
	padding:0 25px 0 0;
}
.Open_table_div{
	overflow: hidden;
  background: #0b1634;
  padding:20px;
	margin: 20px;
  border-radius: 4px;
  box-shadow: 0px 0px 10px #5d9cec;
}
.Open_table_div table{
	border-collapse:collapse;
	width:100%;
	font-size:14px;
	}
.Open_table_div tr{
	text-align:center;
	height:50px;
	line-height:50px;
	}
.Open_table_div tr:hover{
	background:#1c316a;
}
.Open_table_div th{
	background:#092450;
	height:40px;
	line-height:40px;
	}
.Open_table_div td{
	border-bottom:1px dashed #1c316a;
}
.el-table {
  background: #0b1634;
}
.el-table__body tr:hover>td{
  background-color: #092450!important;
}
.el-table td, .el-table th.is-leaf {
  border-bottom: 1px solid #1c316a !important;
}
.el-table th, .el-table tr {
  background:#0b1634;
  color: #8ec0fd
}
.el-table td, .el-table th.is-leaf {
  border-bottom: none;
}
.el-table::before {
  width: 0;
}
.el-button {
  border: none;
  margin: 0 20px 20px 0;
}
.el-button+.el-button {
  margin-left: 0;
}
</style>