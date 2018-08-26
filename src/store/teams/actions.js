import axios from 'axios';

export const index = (state, data) => {
    axios.get(data.url +'/teams', { headers: 
        {'Authorization': 'Bearer '+ data.token}
    }).then((response) => {
        state.commit('all', response.data || []);
    });
}

export const create = (state, data) => {
    axios.get(data.url +'/teams/create', { headers: 
        {'Authorization': 'Bearer '+ data.token}
    }).then((response) => {
        let result = response.data.users || [];
        if(result) {
            let users = [];
            for(let i = 0; i < result.length; i++) {
                users.push({
                    label: result[i].name,
                    value: result[i].id
                });
            }
            state.commit('users', users);
        }else {
            state.commit('users', [])
        }
    });
}

export const store = (state, data) => {
    axios.post(data.url +'/teams', data, { headers: 
        {'Authorization': 'Bearer '+ data.token}
    }).then((response) => {
        state.commit('message', {
            color: 'green',
            text: response.data.message,
        });
    }).catch((err) => {
        state.commit('message', {
            color: 'red',
            text: response.data.message,
        });
    });
}