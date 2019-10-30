import { LocalStorage } from 'quasar';

const token = LocalStorage.has('token') ? LocalStorage.get.item('token') : null;
const organization_id = LocalStorage.has('organization_id') ? LocalStorage.get.item('organization_id') : null;
const organization_title = LocalStorage.has('organization_title') ? LocalStorage.get.item('organization_title') : null;
const settings = LocalStorage.has('settings') ? LocalStorage.get.item('settings') : null;

export default ({ Vue }) => {
    Vue.prototype.$mangrowe = {
        // url: 'http://mangrowe.test/api/v1',
        url: 'http://localhost:8000/api/v1',
        urlClient: 'http://localhost:8080/#',
        token,
        organization_id,
        organization_title,
        settings,
        dated: (value) => {
            const hour = value.substr(11);
            const created = value.substring(0, 10);
            return created.substr(5, 2) +'/'+ created.substr(8, 2) +'/'+ created.substr(0, 4) +' '+ hour;
        },
        format: (value, format) => {
            let formatted = parseFloat(value)
            .toFixed(2)
            .replace('.', ',')
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

            switch(format) {
                case 'percentage':
                    formatted += '%';
                    break;
                case 'currency':
                    formatted = 'R$' + formatted;
                    break;
                default:
                    break;
            }
            return formatted;
        },
        deformat: (value) => {
            if(typeof value == 'string') {
                return value.replace('R$', '')
                .replace('%', '')
                .replace('.', '')
                .replace(',', '.');
            }
            return value;
        },
        dateHuman: (value) => {
            return value.split('-').reverse().join('/');
        },
        levels: (value) => {
            let level = '';
            switch(value) {
                case 'strategic':
                    level = 'Estratégico';
                    break;
                case 'tactical':
                    level = 'Tático';
                    break;
                default:
                    level = 'Operacional';
                    break;
            }
            return level;
        }
    };
}