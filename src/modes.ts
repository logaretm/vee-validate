const aggressive = () => ({
  on: ['input']
});

const lazy = () => ({
  on: ['change']
});

const eager = ({ errors }) => {
  if (errors.length) {
    return {
      on: ['input']
    };
  }

  return {
    on: ['change', 'blur']
  };
};

const passive = () => ({
  on: []
});

export const modes = {
  aggressive,
  eager,
  passive,
  lazy
};
