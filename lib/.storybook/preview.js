/** @type { import('@storybook/html').Preview } */

import { setConsoleOptions } from '@storybook/addon-console';

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  }
};

export default preview;
