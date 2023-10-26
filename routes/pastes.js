const express = require('express')
const router = express.Router()

const pasteController = require('../controllers/pasteController')

router.get('/', pasteController.paste_index)
router.post('/', pasteController.paste_create)
router.get('/:pasteId', pasteController.paste_raw)
router.patch('/:pasteId', pasteController.paste_update)
router.delete('/:pasteId', pasteController.paste_delete)

module.exports = router