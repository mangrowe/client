import { LocalStorage } from 'quasar';

const token = LocalStorage.has('token') ? LocalStorage.get.item('token') : null;
const organization_id = LocalStorage.has('organization_id') ? LocalStorage.get.item('token') : null;

export default ({ Vue }) => {
    Vue.prototype.$mangrowe = {
        url: 'http://mangrowe.test/api/v1',
        token,
        organization_id
    };
}