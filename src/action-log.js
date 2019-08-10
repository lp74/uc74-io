const fs = require('fs');

module.exports = (action) => {
  const record = `${Date.now()} ${JSON.stringify(action)}\r\n`;
  fs.appendFile(process.env.ACTION_LOG, record, (err) => {
    if (err) {
      console.error(err);
    }
    console.log('The "data to append" was appended to file!');
  });
};
