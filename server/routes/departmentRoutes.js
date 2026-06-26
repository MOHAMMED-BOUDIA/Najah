const router = require('express').Router();
const { getDepartments, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getDepartments);
router.post('/', auth, authorize('admin'), createDepartment);
router.put('/:id', auth, authorize('admin'), updateDepartment);
router.delete('/:id', auth, authorize('admin'), deleteDepartment);

module.exports = router;
