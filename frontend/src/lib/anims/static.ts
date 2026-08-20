// Animations for static areas - divs, spans,...

export const S_CONTENT_TRANSITION = {
  leave: {
    seq_1: {
      y: 225,
      opacity: 0.4,
      scaleY: 0.8,
    },

    seq_2: {
      scaleY: 1,
      transformOrigin: "bottom",
    },
  },

  enter: {
    seq_1: {
      y: 0,
      opacity: 1,
      scaleY: 1,
    },

    seq_2: {
      scaleY: 0,
      transformOrigin: "top",
    },
  },
};

export const S_VIEW = {
  initial: {
    opacity: 0,
  },

  show: {
    opacity: 1,
  },

  exit: {
    opacity: 0,
  },
};
