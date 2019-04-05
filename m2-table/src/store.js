import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    payments: [],
    loading: false
  },

  getters: {
    payments: state => {
      return state.payments;
    },

    isLoading: state => {
      return state.loading;
    }
  },

  mutations: {
    setPayments: (state, payload = []) => {
      state.payments = Object.values(payload);
    },

    setLoading: (state, payload = false) => {
      state.loading = payload;
    }
  },

  actions: {
    getPayments: async context => {
      context.commit("setLoading", true);
      return firebase
        .database()
        .ref()
        .once("value", snapshot => {
          context.commit("setPayments", snapshot.val());
          context.commit("setLoading", false);
        });
    },

    updatePayments: async (context, { row }) => {
      context.commit("setLoading", true);
      return firebase
        .database()
        .ref(row.id)
        .set(row)
        .then(() => {
          context.commit("setLoading", false);
          console.log("Updated payments data successfully.");
        })
        .catch(error => {
          console.log(
            `Updating payments data failed\n ${JSON.stringify(error)}`
          );
        });
    }
  }
});
