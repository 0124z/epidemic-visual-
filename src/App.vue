<template>
  <div class="box" :style="{background:`url(${bg})`}">
    <div class="box-left">
      <div style="color:white" class="box-left">
        <div class="box-left-card">
          <section>
            <div>较上日+ {{ store.chinaAdd.localConfirmH5 }}</div>
            <div>{{ store.chinaTotal.localConfirm }}</div>
            <div>本土现有确诊</div>
          </section>
          <section>
            <div>较上日+ {{ store.chinaAdd.nowConfirm }}</div>
            <div>{{ store.chinaTotal.nowConfirm }}</div>
            <div>现有确诊</div>
          </section>
          <section>
            <div>较上日+ {{ store.chinaAdd.confirm }}</div>
            <div>{{ store.chinaTotal.confirm }}</div>
            <div>累计确诊</div>
          </section>
          <section>
            <div>较上日+ {{ store.chinaAdd.noInfect }}</div>
            <div>{{ store.chinaTotal.noInfect }}</div>
            <div>无症状感染者</div>
          </section>
          <section>
            <div>较上日+ {{ store.chinaAdd.importedCase }}</div>
            <div>{{ store.chinaTotal.importedCase }}</div>
            <div>境外输入</div>
          </section>
          <section>
            <div>较上日+ {{ store.chinaAdd.dead }}</div>
            <div>{{ store.chinaTotal.dead }}</div>
            <div>累计死亡</div>
          </section>
        </div>
        <div class="box-left-pie"></div>
        <div class="box-left-line"></div>
      </div>
    </div>
    <div class="box-center china">
      <!-- 2、准备echarts容器 -->
    </div>
    <div class="box-right">
      <div class="box-right" v-show="isRight">
        <table cellspacing="0">
          <thead>
            <tr>
              <th align="left">地区</th>
              <th align="left">新增确诊</th>
              <th align="left">累计确诊</th>
              <th align="left">治愈</th>
              <th align="left">死亡</th>
            </tr>
          </thead>
          <transition-group enter-active-class="animate__animated animate__bounceIn">
            <tr v-for="item in store.item" :key="item.name">
              <td align="left">{{item.name}}</td>
              <td align="left">{{item.today.confirm}}</td>
              <td align="left">{{item.total.confirm}}</td>
              <td align="left">{{item.total.heal}}</td>
              <td align="left">{{item.total.dead}}</td>
            </tr>
          </transition-group>
        </table>
      </div>
    </div>
  </div>
</template>
  
<script setup lang='ts'>
import bg from "./assets/山峰.jpg";
import { useCounterStore } from "./stores/index";
import { onMounted, ref } from "vue";
// 导入经纬度数据
import { geoCoordMap } from "./assets/geoMap";
// 1、导入echarts 必须使用类型别名
import * as echarts from "echarts";
// 5、导入对应图的包,执行
import "./assets/china";
import axios from "axios";
import "animate.css";

// 引入store获取数据的方法
let store = useCounterStore();
// 函数调用
onMounted(async () => {
  await store.getList();
  initcharts();
});
let isRight = ref(false);
const initcharts = () => {
  const city = store.data.diseaseh5Shelf.areaTree[0].children;
  const data = city.map((x) => {
    return {
      name: x.name,
      value: geoCoordMap[x.name].concat(x.total.confirm),
      children: x.children,
    };
  });
  // 3、在onMounted生命周期函数中调用echarts.init并传入元素实例
  const charts = echarts.init(<HTMLElement>document.querySelector(".china")); //使用类型断言
  //  4、准备配置项
  charts.setOption({
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "100%",
      itemStyle: {
        //  normal: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: "#0f5d9d",
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5,
        // },
      },
      emphasis: {
        areaColor: "#0f5d9d",
      },

      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            //normal: {
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
            //},
          },
          label: {
            show: false,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "100%",
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 12,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        symbol: "pin",
        symbolSize: [45, 45],
        label: {
          show: true,
          color: "#fff",
          formatter(value: any) {
            return value.data.value[2];
          },
        },
        itemStyle: {
          color: "#1E90FF", //标志颜色
        },
        data: data,
      },
    ],
  });
  charts.on("click", (e: any) => {
    console.log(e);
    store.item = e.data.children;
    isRight.value = true;
  });
};
</script>
  
<style lang="less">
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  height: 100%;
}
.box {
  display: flex;
  height: 100%;
  background-size: 100% 100% !important ;
  color: #1a7edd;
  &-left {
    width: 400px;
    margin: 5px;
    &-card{
      display: grid;
      grid-template-columns: auto auto auto;
      grid-template-rows: auto auto auto;
      background-color: #0c3653;
      section{
         display: flex;
         flex-direction: column;
         align-items: center;
         border: 1px solid #1a7edd;
         div:nth-child(2){
           color: #1a7edd;
           font-size: 20px;
           padding: 5px 0;
           font-weight: bold;
         }
      }
    }
  }
  &-center {
    flex: 1;
  }
  &-right {
    width: 400px;
  }
}
</style>