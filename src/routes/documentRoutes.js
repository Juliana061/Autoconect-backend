const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
} = require('../controllers/documentController');

router.use(protect);
router.post('/vehicle/:vehicleId', upload.single('archivo'), uploadDocument);
router.get('/', getDocuments);
router.route('/:id').get(getDocument).put(updateDocument).delete(deleteDocument);

module.exports = router;
