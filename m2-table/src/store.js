import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    payments: []
  },

  getters: {
    payments: state => {
      return state.payments;
    }
  },

  mutations: {
    setPayments: (state, payload = []) => {
      state.payments = payload;
    }
  },

  actions: {
    getPayments: async context => {
      return firebase
        .database()
        .ref()
        .on("value", snapshot => {
          context.commit("setPayments", snapshot.val());
        });
    },

    updatePayments: async (context, { row, rowIndex }) => {
      return firebase
        .database()
        .ref(rowIndex)
        .set(row)
        .then(() => {
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
