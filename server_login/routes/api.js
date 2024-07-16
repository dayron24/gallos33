const router = require('express').Router();

router.use('/users', require('./api/user'));
router.use('/mensajes', require('./api/mensajes'));
router.use('/streams', require('./api/streams'));



module.exports = router;