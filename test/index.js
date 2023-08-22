const {PikaBansScraper} = require('../src/index.js');
const playerIGN = 'TejasIsPro';
const bansScraper = new PikaBansScraper(playerIGN);

(async () => {
  try {
    const bans = await bansScraper.getBans();
    console.log(bans);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
