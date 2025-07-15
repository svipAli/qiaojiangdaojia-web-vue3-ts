import {defineStore} from 'pinia'
import {menu, permission} from "@/api/module/user";

export const useUserStore = defineStore({
    id: 'user',
    state: () => {
        return {
            token: '',
            userInfo: {},
            permissions: [],
            menus: [],
            tableColumns: {
                warehouseBackColumns: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
            },
        }
    },
    actions: {
        async loadMenus() {
            const {data, code} = await menu();
            if (code == 0) {
                this.menus = data;
            }
        },
        async loadPermissions() {
            const {data, code} = await permission();
            if (code == 0) {
                this.permissions = data;
            }
        }
    },
    persist: {
        storage: localStorage,
        paths: ['token', 'userInfo', 'permissions', 'menus'],
    }
})