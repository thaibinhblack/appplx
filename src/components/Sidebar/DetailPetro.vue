<template>
    <div>
    <!-- Side Modal Top Right -->
    
    <mdb-modal fullHeight :removeBackdrop="true" :scrollable="true" position="right" direction="right" :show="detail.modal" @close="updateModalDetail({
        back: true,
        detail: false
    })">
        <mdb-modal-header>
            <mdb-modal-title>
                <span class="btn btn-back" v-if="back == true" @click="backModal"><i class="fas fa-chevron-left"></i></span>
                <span class="petro-title">Thông tin chi tiết cây xăng {{detail.detail.Title}}</span>
                
            </mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
            <mdb-input placeholder="Thẻ được chấp nhận" label="Thẻ được chấp nhận" v-model="detail.detail.CardAccepts" />
            <mdb-input placeholder="Tỉnh/Thành Phố" label="Tỉnh/Thành Phố" v-model="detail.detail.Province" />
            <mdb-input placeholder="Phường" label="Phường" v-model="detail.detail.County" />
            <mdb-input placeholder="Quận/Huyện" label="District" v-model="detail.detail.District" />
            <mdb-input placeholder="Email" label="Email" v-model="detail.detail.Email" />
            <mdb-input placeholder="Các mặt hàng" label="Các mặt hàng" v-model="detail.detail.Goods" />
            <mdb-input placeholder="Sở hữu" label="Sở hữu" v-model="detail.detail.OwnedBy" />
            <mdb-input placeholder="Số điện thoại" label="Số điện thoại" v-model="detail.detail.Phone" />
            <mdb-input placeholder="PumpsForAutos" label="PumpsForAutos" v-model="detail.detail.PumpsForAutos" />
            <mdb-input placeholder="Dịch vụ" label="Dịch vụ" v-model="detail.detail.Services" />
            <mdb-input placeholder="Địa chỉ trạm xăng" label="Địa chỉ trạm xăng" v-model="detail.detail.StationAddress" />
        </mdb-modal-body>
        <mdb-modal-footer>
            <mdb-btn color="secondary" @click="updateDetail(false,{})">Close</mdb-btn>
            <mdb-btn color="primary">Save changes</mdb-btn>
        </mdb-modal-footer>
    </mdb-modal>
  </div>
</template>
<script>

import { mdbModal, mdbModalHeader, mdbModalTitle, mdbModalBody, mdbModalFooter, mdbBtn, mdbListGroup, mdbListGroupItem, mdbInput   } from 'mdbvue';
import {mapGetters, mapActions} from 'vuex'
export default {
    name: 'detail-petro',
      components: {
      mdbModal,
      mdbModalHeader,
      mdbModalTitle,
      mdbModalBody,
      mdbModalFooter,
      mdbBtn,
      mdbListGroup,
      mdbListGroupItem,
      mdbInput
    },
    computed:{
        ...mapGetters(["detail","back"])
    },
    methods: {
        ...mapActions(["updateDetail","updateModalDetail","backModal"])
    }
}
</script>
<style>
.petro-title { margin-left: 10px;}
</style>


