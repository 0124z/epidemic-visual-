import { defineStore } from 'pinia'
import {getData} from '../server/index'
import type {RootObject,Children,ChinaAdd,ChinaTotal} from './type'
export const useCounterStore = defineStore({
  id: 'counter',
  state: () => ({
    data:<RootObject>{},
    item:<Children[]>[],
    chinaAdd:<ChinaAdd>{},
    chinaTotal:<ChinaTotal>{}
  }),
  getters: {
    
  },
  actions: {
   async getList(){
         const result=await getData()
         this.data=result
         this.chinaAdd=this.data.diseaseh5Shelf.chinaAdd  
         this.chinaTotal=this.data.diseaseh5Shelf.chinaTotal   
    }
  }
})
