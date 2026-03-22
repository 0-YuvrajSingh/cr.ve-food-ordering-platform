const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

router.patch('/:projectId/:stageNumber', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.user._id });
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const stage = project.stages.find(s => s.stageNumber === Number(req.params.stageNumber));
    if (!stage) return res.status(404).json({ message: 'Stage not found' });

    const { status, notes, artifacts } = req.body;
    if (status) {
      stage.status = status;
      stage.completedAt = status === 'done' ? new Date() : null;
    }
    if (notes !== undefined) stage.notes = notes;
    if (artifacts) stage.artifacts = artifacts;

    await project.save();

    req.io.to(req.params.projectId).emit('stage_updated', project);

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
