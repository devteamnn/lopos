import profileMarkup from '../markup/online-profile.js';

export default {
  start() {
    profileMarkup.setProfile();
  },

  stop() {
    profileMarkup.clearProfile();
  }
};
