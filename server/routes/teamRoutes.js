const router = require('express').Router();
const { createTeam, getAllTeams, getTeamById, updateTeam, deleteTeam, addMember, removeMember } = require('../controllers/teamController');
const { auth } = require('../middleware/auth');

router.post('/', auth, createTeam);
router.get('/', auth, getAllTeams);
router.get('/:id', auth, getTeamById);
router.put('/:id', auth, updateTeam);
router.delete('/:id', auth, deleteTeam);
router.post('/:id/add-member', auth, addMember);
router.post('/:id/remove-member', auth, removeMember);

module.exports = router;