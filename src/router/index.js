import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '@/components/Index.vue';
import SystemPage from '../page/System.vue'
import StatisticalFSM from '@/components/System/Statistical/FSM.vue'
import StatisticalPage from '@/components/System/Statistical.vue'
Vue.use(VueRouter);
const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/fsms',
        component: SystemPage,
        children: [
            {
                path: 'statistical',
                component: StatisticalPage,
                children: [
                    {
                        path: 'fsm',
                        component:StatisticalFSM
                    }
                ]
            }
        ]
    }
]

export default new VueRouter({
    routes: routes,
    mode: 'history'
});