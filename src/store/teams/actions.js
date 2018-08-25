import axios from 'axios';

const URI = 'http://mangrowe.test/api/v1/teams';

export const index = (state) => {
    axios.get(URI, { headers: 
        {'Authorization': 'Bearer mu1zSFPHZPDCy2f5rmqyjfzG9o1A505jqV2WqJGlOBRqVKx0zcGAmeSEYVj4'}
    }).then((response) => {
        state.commit('all', response.data || []);
    });
}

export const create = (state) => {
    axios.get(URI +'/create', { headers: 
        {'Authorization': 'Bearer mu1zSFPHZPDCy2f5rmqyjfzG9o1A505jqV2WqJGlOBRqVKx0zcGAmeSEYVj4'}
    }).then((response) => {
        let data = response.data.data.users || [];
        if(data) {
            let users = [];
            for(let i = 0; i < data.length; i++) {
                users.push({
                    label: data[i].name,
                    value: data[i].id
                });
            }
            state.commit('users', users);
        }else {
            state.commit('users', [])
        }
    });
}

export const store = (state, team) => {
    axios.post(URI, team,
    { headers: 
        {'Authorization': 'Bearer mu1zSFPHZPDCy2f5rmqyjfzG9o1A505jqV2WqJGlOBRqVKx0zcGAmeSEYVj4'}
    }).then((response) => {
        state.commit('messages', response.data.message);
    });
}