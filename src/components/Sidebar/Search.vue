<template>
    <div>
    <!-- Side Modal Top Right -->
    
    <mdb-modal fullHeight :removeBackdrop="true" :scrollable="true" position="right" direction="right" :show="search" @close="updateSearch(false)">
        <mdb-modal-header>
            <mdb-modal-title>Danh sách cây xăng của {{getNameContry}}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            <mdb-list-group v-if="getListPetro.length > 0">
                <span class="result">Kết quả là: {{getListPetro.length}}</span>
                <mdb-list-group-item :action="false"  v-for="(value,index) in getListPetro" :value="value.UUID" :key="index" >
                    {{value.Title}} 
                    <span>
                      <span @click="goToPoint(value)" class="btn-goto"><i class="fas fa-map-marker-alt"></i></span>
                      <span @click="detailPetro(value)" class="btn-goto"><i class="fas fa-angle-double-right"></i></span>
                    </span>
                </mdb-list-group-item>
               
            </mdb-list-group>
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="secondary" @click="updateSearch(false)">Close</mdb-btn>
            <mdb-btn color="primary">Save changes</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Vuex from 'vuex'
  Vue.use(Vuex)
  import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbListGroup, mdbListGroupItem  } from 'mdbvue';
  import {mapGetters, mapActions} from 'vuex'
  import axios from 'axios'
  export default {
    name: 'sidebar-search',
    components: {
      mdbModal,
      mdbModalHeader,
      mdbModalTitle,
      mdbModalBody,
      mdbModalFooter,
      mdbBtn,
      mdbListGroup,
      mdbListGroupItem
    },
    data(){
        return{
          petrolimexs: []
        }
    },
    computed:
    {
        ...mapGetters(["search","getNameContry","getListPetro","listPetro"])
    },
    
    methods:
    {
        ...mapActions(["updateSearch","goToPoint"]),
       
        detailPetro(value)
        {
         
          this.$store.dispatch("updateModalDetail",{
            back:true,
            detail: true
          })
          this.$store.dispatch("updateDetail",value)
          this.$store.dispatch("goToPoint",value)
        },
        UpdatePetro(value)
        {
          this.$store.dispatch("updateListPetro",value)
        }
    },
  };
</script>
<style>
.btn-goto {cursor: pointer;margin-right: 10px;}
.result {text-align: left;padding: 7px 0;}
</style>
