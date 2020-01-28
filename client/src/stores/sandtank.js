function blobToArrayBuffer(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsArrayBuffer(blob);
  });
}

export default {
  state: {
    indicatorArray: null,
    saturationArray: null,
    solidArray: null,
    solidScaling: 1,
    time: 0,
    domain: {
      dimensions: [100, 1, 50],
      wells: [{ name: 'w1', position: [11, 15] }],
      setup: {
        maxHeight: 30,
      },
    },
  },
  getters: {
    SANDTANK_DOMAIN(state) {
      return state.domain;
    },
    SANDTANK_INDICATOR(state) {
      return state.indicatorArray;
    },
    SANDTANK_SATURATION(state) {
      return state.saturationArray;
    },
    SANDTANK_TIME(state) {
      return state.time;
    },
    SANDTANK_MASK(state) {
      if (!state.solidArray) {
        return null;
      }

      return {
        scale: state.solidScaling,
        array: state.solidArray,
      };
    },
  },
  mutations: {
    SANDTANK_DOMAIN_SET(state, value) {
      state.domain = value;
    },
  },
  actions: {
    SANDTANK_INDICATOR_UPDATE({ state }, { array }) {
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.indicatorArray = new Uint8Array(arrayBuffer);
      });
    },
    SANDTANK_SATURATION_UPDATE({ state }, { array, time }) {
      state.time = time;
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.saturationArray = new Uint8Array(arrayBuffer);
      });
    },
    SANDTANK_MASK_UPDATE({ state }, { scale, array }) {
      state.solidScaling = scale;
      blobToArrayBuffer(array).then((arrayBuffer) => {
        state.solidArray = new Uint8Array(arrayBuffer);
      });
    },
  },
};
