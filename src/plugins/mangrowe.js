import { LocalStorage } from 'quasar';

const token = LocalStorage.has('token') ? LocalStorage.get.item('token') : null;
const organization_id = LocalStorage.has('organization_id') ? LocalStorage.get.item('organization_id') : null;
const organization_title = LocalStorage.has('organization_title') ? LocalStorage.get.item('organization_title') : null;
const settings = LocalStorage.has('settings') ? LocalStorage.get.item('settings') : null;

export default ({ Vue }) => {
    Vue.prototype.$mangrowe = {
        url: 'http://mangrowe.test/api/v1',
        token,
        organization_id,
        organization_title,
        settings,
        dated: (value) => {
            const hour = value.substr(11);
            const created = value.substring(0, 10);
            return created.substr(5, 2) +'/'+ created.substr(8, 2) +'/'+ created.substr(0, 4) +' '+ hour;
        }
    };
}