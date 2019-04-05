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
    SET_PAYMENTS: (state, payload = []) => {
      state.payments = Object.values(payload);
    },

    SET_LOADING: (state, payload = false) => {
      state.loading = payload;
    }
  },

  actions: {
    getPayments: async context => {
      context.commit("SET_LOADING", true);
      return firebase
        .database()
        .ref()
        .on("value", snapshot => {
          context.commit("SET_PAYMENTS", snapshot.val());
          context.commit("SET_LOADING", false);
        });
    },

    updatePayments: async (context, { row }) => {
      context.commit("SET_LOADING", true);
      return firebase
        .database()
        .ref(row.id)
        .set(row)
        .then(() => {
          context.commit("SET_LOADING", false);
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
