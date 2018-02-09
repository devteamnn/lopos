import profileMarkup from '../markup/online__profile.js';

export default {
  start() {
    profileMarkup.setProfile();
  },

  stop() {
    profileMarkup.clearProfile();
  }
};
