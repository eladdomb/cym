const router = global.router;
const path = require('path');

console.log(__dirname);

router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname,'/html/index.html'));
});

module.exports = router;