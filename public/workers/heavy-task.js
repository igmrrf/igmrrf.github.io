import { expose } from 'comlink';

const api = {
  heavyTask: () => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }
    return 'Task finished';
  },
};

expose(api);
