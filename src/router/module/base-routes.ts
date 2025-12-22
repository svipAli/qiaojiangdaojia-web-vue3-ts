import BasicLayout from '../../layouts/BasicLayout.vue';
import Login from '../../views/login/index.vue';


export default [
    {
        path: '/',
        redirect: '/workspace'
    },
    {
        path: '/login',
        component: Login,
        meta: {title: '登录页面'},
    },
    {
        path: '/workspace',
        redirect: '/workspace/workbench',
        component: BasicLayout,
        meta: {title: '工作空间'},
        children: [
            {
                path: '/workspace/workbench',
                name: 'Workbench',
                component: () => import('../../views/workSpace/workbench/index.vue'),
                meta: {title: '工作台', requireAuth: true, affix: true, closable: false},
            },
            {
                path: '/workspace/console',
                component: () => import('../../views/workSpace/console/index.vue'),
                meta: {title: '控制台', requireAuth: true},
            },
            {
                path: '/workspace/analysis',
                component: () => import('../../views/workSpace/analysis/index.vue'),
                meta: {title: '安装数据', requireAuth: true},
            },
            {
                path: '/workspace/monitor',
                component: () => import('../../views/workSpace/monitor/index.vue'),
                meta: {title: '监控页', requireAuth: true},
            }
        ]
    },
    {
        path: '/warehouse',
        component: BasicLayout,
        meta: {title: '仓库售后'},
        children: [
            {
                path: '/warehouse/back',
                name: 'WarehouseBack',
                component: () => import('../../views/warehouse/back/index.vue'),
                meta: {title: '退货质检', requireAuth: true},
            },
            {
                path: '/warehouse/shop',
                name: 'WarehouseShop',
                component: () => import('../../views/warehouse/shop/index.vue'),
                meta: {title: '店铺管理', requireAuth: true},
            },
            {
                path: '/warehouse/return',
                name: 'WarehouseReturn',
                component: () => import('../../views/warehouse/return/index.vue'),
                meta: {title: '退货管理', requireAuth: true},
            },
            {
                path: '/warehouse/tray',
                name: 'WarehouseTray',
                component: () => import('../../views/warehouse/tray/index.vue'),
                meta: {title: '托盘管理', requireAuth: true},
            },
            {
                path: '/warehouse/repair',
                name: 'WarehouseRepair',
                component: () => import('../../views/warehouse/repair/index.vue'),
                meta: {title: '次品维修', requireAuth: true},
            },
            {
                path: '/warehouse/inventory',
                name: 'WarehouseInventory',
                component: () => import('../../views/warehouse/inventory/index.vue'),
                meta: {title: '配件库存', requireAuth: true},
            },
            {
                path: '/warehouse/inventoryrecord',
                name: 'WarehouseInventoryRecord',
                component: () => import('../../views/warehouse/inventoryRecord/index.vue'),
                meta: {title: '库存单据', requireAuth: true},
            }
        ]
    },
    {
        path: '/qiaojiang',
        component: BasicLayout,
        meta: {title: '巧匠安维'},
        children: [
            {
                path: '/qiaojiang/invoice',
                name: 'QiaojiangInvoice',
                component: () => import('@/views/qiaojiang/invoice/index.vue'),
                meta: {title: '发票管理', requireAuth: true},
            },
            // {
            //     path: '/qiaojiang/qj_inventory',
            //     name: 'QiaojiangInventory',
            //     component: () => import('@/views/qiaojiang/qj_inventory/index.vue'),
            //     meta: {title: '巧匠配件库存', requireAuth: true},
            // },
            // {
            //     path: '/qiaojiang/qj_inventory_record',
            //     name: 'QiaojiangInventoryRecord',
            //     component: () => import('@/views/qiaojiang/qj_inventoryRecord/index.vue'),
            //     meta: {title: '巧匠库存单据', requireAuth: true},
            // },
            // {
            //     path: '/qiaojiang/qj_warehouse',
            //     name: 'QiaojiangWarehouse',
            //     component: () => import('@/views/qiaojiang/qj_warehouse/index.vue'),
            //     meta: {title: '巧匠仓库管理', requireAuth: true},
            // },
        ]
    },
    {
        path: '/product',
        component: BasicLayout,
        meta: {title: '产品信息'},
        children: [
            {
                path: '/product/class',
                name: 'ProductClass',
                component: () => import('../../views/product/class/index.vue'),
                meta: {title: '类目管理', requireAuth: true},
            },
            {
                path: '/product/info',
                name: 'ProductInfo',
                component: () => import('../../views/product/info/index.vue'),
                meta: {title: '产品管理', requireAuth: true},
            },
            {
                path: '/product/part',
                name: 'ProductPart',
                component: () => import('../../views/product/part/index.vue'),
                meta: {title: '配件管理', requireAuth: true},
            }
        ]
    },
    {
        path: '/error',
        component: BasicLayout,
        meta: {title: '错误页面'},
        children: [
            {
                path: '/error/401',
                component: () => import('../../views/error/401.vue'),
                meta: {title: '401'},
            },
            {
                path: '/error/403',
                component: () => import('../../views/error/403.vue'),
                meta: {title: '403'},
            },
            {
                path: '/error/404',
                component: () => import('../../views/error/404.vue'),
                meta: {title: '404'},
            },
            {
                path: '/error/500',
                component: () => import('../../views/error/500.vue'),
                meta: {title: '500'},
            }
        ]
    }, {
        path: '/system',
        component: BasicLayout,
        meta: {title: '系统管理'},
        children: [
            {
                path: '/system/user',
                component: () => import('../../views/system/user/index.vue'),
                meta: {title: '用户管理', requireAuth: true},
            },
            {
                path: '/system/role',
                name: 'SystemRole',
                component: () => import('../../views/system/role/index.vue'),
                meta: {title: '角色管理', requireAuth: true},
            },
            {
                path: '/system/menu',
                component: () => import('../../views/system/menu/index.vue'),
                meta: {title: '菜单管理', requireAuth: true},
            },
            {
                path: '/system/file',
                component: () => import('../../views/system/file/index.vue'),
                meta: {title: '文件管理', requireAuth: true},
            },
            {
                path: '/system/login',
                component: () => import('../../views/system/login/index.vue'),
                meta: {title: '登录日志', requireAuth: true},
            },
            {
                path: '/system/visit',
                component: () => import('../../views/system/visit/index.vue'),
                meta: {title: '访问日志', requireAuth: true},
            },
        ]
    }, {
        path: '/result',
        component: BasicLayout,
        meta: {title: '错误页面'},
        children: [
            {
                path: '/result/success',
                component: () => import('../../views/result/success.vue'),
                meta: {title: '成功页面', requireAuth: true},
            },
            {
                path: '/result/failure',
                component: () => import('../../views/result/failure.vue'),
                meta: {title: '失败页面', requireAuth: true},
            },
        ]
    }, {
        path: '/component',
        component: BasicLayout,
        meta: {title: '常用组件'},
        children: [
            {
                path: '/component/qrcode',
                component: () => import('../../views/component/qrcode.vue'),
                meta: {title: '二维码', requireAuth: true},
            },
            {
                path: '/component/barcode',
                component: () => import('../../views/component/barcode.vue'),
                meta: {title: '条形码', requireAuth: true},
            },
            {
                path: '/component/treeSelect',
                component: () => import('../../views/component/treeSelect.vue'),
                meta: {title: '下拉树', requireAuth: true},
            },
        ]
    }, {
        path: '/enrollee',
        component: BasicLayout,
        meta: {title: '个人中心'},
        children: [
            {
                path: '/enrollee/profile',
                component: () => import('../../views/enrollee/profile/index.vue'),
                meta: {title: '我的资料', requireAuth: true},
            },
            {
                path: '/enrollee/message',
                component: () => import('../../views/enrollee/message/index.vue'),
                meta: {title: '我的消息', requireAuth: true},
            },

        ]
    }
]
