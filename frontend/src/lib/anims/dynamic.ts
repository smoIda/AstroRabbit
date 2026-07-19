// Animations for interactive areas - buttons, inputs...

export const D_SCALE = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const D_SHIFT = {
  initial: {
    x: 0,
  },

  hover: {
    x: 6,

    tap: {
      x: -5,
    },
  },
};

export const D_ARISE = {
  initial: { opacity: 0, y: 25 },
  hover: {
    opacity: 1,
    y: 0,
  },
};
