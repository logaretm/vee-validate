const aggressive = () => ({
  events: ['input']
});

const lazy = () => ({
  events: ['change']
});

const eager = ({ errors }) => {
  if (errors.length) {
    return {
      events: ['input']
    };
  }

  return {
    events: ['change']
  };
};

const passive = () => ({
  events: []
});

export const modes = {
  aggressive,
  eager,
  passive,
  lazy
};
