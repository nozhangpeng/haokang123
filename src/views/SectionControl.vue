<template>
  <div class="container_box_div">
    <div class="header">
      <a href="#"><img src="../assets/images/Insert_logo.png" class="Insert_logo"/></a>
      <div class="Login_div">
        <div class="Date_div">
          <div class="Week_div">{{dateFormat}}</div>
          <div class="Date_text">{{dayFormat}}</div>
        </div>
      </div>
    </div>
    <div class="content_box_div">
      <div class="Drop_down_box">
        <div class="Drop_down_div">
          <select v-model="selsctValuea" @change="getSelectChenJian($event)">
            <option v-for="(item, index) in chenJianOptions" :key="index" :value="item.chejian">{{ item.chejian }}</option>
          </select>
        </div>
        <div class="Drop_down_div">
          <select v-model="selsctValueb" @change="getSelectGongDuan($event)">
            <option v-for="(item, index) in gongDuanOptions" :key="index" :value="item.gongduan">{{ item.gongduan }}</option>
          </select>
        </div>
      </div>
      <div class="Chart_box_div">
        <div class="Chart_div">
          <div class="Chart_title_div">
              柱状图分布
          </div>
          <div class="Chart_main_div">
            <div
              id="container"
              v-loading="loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              style="height:400px;color:white;background-color:#061848;"
            ></div>
          </div>
        </div>
        <div class="Chart_div">
          <div class="Chart_title_div">
              数据表名称
          </div>
          <div class="Chart_main_div">
            <div
              id="container_B"
              v-loading="loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              style="height:400px;color:white;margin-left:50px;background-color:#061848;"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import { $api } from "@helper";
import Moment from 'moment'
import 'moment/locale/zh-cn'
import _ from "lodash";
export default {
  name: "sectionControl",
  data() {
    return {
      loading: false,
      chenJianOptions: [],
      gongDuanOptions: [],
      selsctValuea: [],
      selsctValueb: [],
      chartColumn: null,
      columnXdata: [],
      columnYdata: [],
      columnYdataFail: [],
      chartPie: null,
      peiData: [],
      query: {
        workShop: "",
        gongDuan: ""
      }
    };
  },
  created() {
    this.getChenJianSelect();
  },
  computed : {
    dateFormat () {
      return Moment().format('dddd')
    },
    dayFormat () {
      return Moment().format('LL')
    }
  },
   mounted() {
    this.drawCharts();
  },
  methods: {
    async getChenJianSelect() {
      try {
        const respones = await $api.app.getChenJian();
        this.chenJianOptions = JSON.parse(respones);
        this.selsctValuea = this.chenJianOptions[0].chejian
        await this.getGongDuanSelect();
      } catch (e) {}
    },
    getSelectChenJian(event) {
      this.selsctValuea = event.target.value
      this.getGongDuanSelect();
    },
    async getSelectGongDuan(event) {
      this.selsctValueb = event.target.value
      this.query = {
        workShop: this.selsctValuea,
        gongDuan: this.selsctValueb
      }
      await this.getColumnChart();
      await this.getPieChart();
    },
    async getGongDuanSelect() {
      try {
        this.query.workShop = this.selsctValuea;
        const respones = await $api.app.getGongDuan(_.pick(this.query, ["workShop"]));
        this.gongDuanOptions = JSON.parse(respones);
        this.selsctValueb = this.gongDuanOptions[0].gongduan;
        this.query.gongDuan = this.selsctValueb
        await this.getColumnChart();
        await this.getPieChart();
      } catch (e) {}
    },
    async getColumnChart() {
      try {
        this.loading = true
        const respones = await $api.app.getGongXuNumber(this.query);
        const res = JSON.parse(respones);
        this.columnXdata = [];
        this.columnYdata = [];
        this.columnYdataFail = []
        res.forEach(item => {
          this.columnXdata.push(item.gongXu);
          this.columnYdata.push({ value: item.rowCount - item.count });
          this.columnYdataFail.push({ value: item.count });
        });
        await this.drawColumnChart()
      } catch (e) {}
      this.loading = false
    },
    async getPieChart() {
      try {
        this.loading = true
        const respones = await $api.app.getGongXu(this.query);
        const res = JSON.parse(respones);
        console.log("====>", res)
        this.peiData = [];
        res.forEach(item => {
          this.peiData.push({
            value: parseInt(item.TotalCount),
            legendname: item.gongXu,
            name: `${item.gongXu} ${parseInt(Number(item.BFB)*100)}%`,
            ZB: `${parseInt(Number(item.BFB)*100)}%`
          });
        });
        await this.drawPieChart();
      } catch (e) {}
      this.loading = false
    },
    drawColumnChart() {
      this.chartColumn = echarts.init(document.getElementById("container"));
      const ydata = this.columnYdata
      const xdata = this.columnXdata
      const ydataFail = this.columnYdataFail
      this.chartColumn.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            axisLabel: {
              interval:0,
              textStyle: {
                fontSize: "16"
              }
            },
            type: "category",
            data: xdata,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: "#8ec0fd"
              }
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              textStyle: {
                fontSize: "16"
              }
            },
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#8ec0fd"
              }
            }
          }
        ],
        series: [
          {
            name: "录入合格条数",
            type: "bar",
            barWidth: "15%",
            itemStyle: {
              barBorderRadius: [10, 10, 0, 0],
              color: function(params) {
                const colorList = ['#ffce55', '#5d9cec', '#fb6e52', '#a0d468', '#50c1e9', '#96dee8']
                return colorList[params.dataIndex]
              }
            },
            data: ydata
          },
          {
            name: "录入不合格条数",
            type: "bar",
            barWidth: "15%",
            itemStyle: {
              // 柱子圆角
              barBorderRadius: [10, 10, 0, 0],
              color: function(params) {
                const colorList = ['#3fb1e3', '#6be6c1', '#626c91', '#a0a7e6', '#c4ebad', '#6a7985']
                return colorList[params.dataIndex]
              }
            },
            data: ydataFail
          }
        ]
      });
    },
    drawPieChart() {
      this.chartPie = echarts.init(document.getElementById("container_B"));
      const m2R2Data = this.peiData;
      this.chartPie.setOption({
        tooltip: {
          trigger: "item",
          formatter: function(parms) {
            console.log("===>", parms)
            const str =
              parms.seriesName +
              "</br>" +
              parms.marker +
              "" +
              parms.data.legendname +
              "</br>" +
              "录入条数：" +
              parms.data.value +
              "</br>" +
              "不合格条数：" +
              parms.data.value +
              "</br>" +
              "占比：" +
              parms.percent +
              "%";
            return str;
          }
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          left: "70%",
          align: "left",
          top: "middle",
          textStyle: {
            color: "#8ec0fd",
            fontSize: 18
          },
          height: 250
        },
        series: [
          {
            name: "标题",
            type: "pie",
            center: ["35%", "50%"],
            radius: ["40%", "65%"],
            clockwise: false, //饼图的扇区是否是顺时针排布
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "inside",
                formatter: function(parms) {
                  return parms.data.ZB;
                },
                textStyle: {
                  fontSize: 16
                }
              }
            },
            labelLine: {
              normal: {
                length: 5,
                length2: 3,
                smooth: true
              }
            },
            itemStyle: {
              color: function(params) {
                const colorList = ['#ffce55', '#5d9cec', '#fb6e52', '#a0d468', '#50c1e9', '#96dee8']
                return colorList[params.dataIndex]
              }
            },
            data: m2R2Data
          }
        ]
      });
    },
    drawCharts() {
      this.drawColumnChart();
      this.drawPieChart();
    }
  }
};
</script>
<style scoped>
.container_box_div {
  width: 100%;
  margin: 0 auto;
}
.header {
  height: 72px;
  padding: 0 20px;
  background: url(../assets/images/header_bg.png) repeat-x bottom;
}
.header .Insert_logo {
  width: 140px;
  margin: 20px 0 0 0;
  float: left;
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
.Date_div .Week_div {
  font-weight: bold;
  text-align: right;
  margin: 8px 0 3px 0;
  color: #35a6ff;
  font-size: 14px;
}
.Date_div .Date_text {
  text-align: right;
  color: #35a6ff;
}
.content_box_div {
  padding: 20px;
}
.Drop_down_box {
  width: 100%;
  background: #0d1d61;
  border-radius: 4px;
  height: 40px;
}
.Drop_down_box .Drop_down_div {
  margin: 5px 0 0 20px;
  float: left;
  overflow: hidden;
  border-right: 1px solid #1e59a9;
  padding: 0 20px 0 0;
}
.Drop_down_box select {
  border: 1px solid #0d1d61;
  height: 30px;
  line-height: 30px;
  color: #34a6ff;
  border-radius: 4px;
  background: url(../assets/images/down.png) no-repeat scroll right 3px center;
  background-size: 12px;
  padding-right: 10px;
  font-size: 14px;
  max-width: 120px;
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
.container_box_div .Chart_box_div {
  width: 100%;
  overflow: hidden;
  margin: 20px 0 0 0;
  display: flex;
  justify-content: space-between;
}
.Chart_box_div .Chart_div {
  background: #051847;
  border-radius: 4px;
  width: 100%;
  margin: 0 20px 0 0;
  padding: 20px;
}
.Chart_box_div .Chart_div:last-child {
  margin: 0;
}
.Chart_box_div .Chart_title_div {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
  color: #8ec0fd;
  height: 30px;
  line-height: 30px;
}
.Chart_box_div .Chart_main_div {
  margin: 20px 0 0 0;
}
</style>
