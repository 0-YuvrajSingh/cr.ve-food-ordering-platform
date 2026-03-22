#!/bin/bash
set -e

echo "🚀 [1/6] Initializing git..."
git init
git branch -M main

echo "📦 [2/6] Writing backend/server.js..."
cat > backend/server.js << 'EOF'
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/stages',   require('./routes/stages'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

io.on('connection', (socket) => {
  socket.on('join_project',  (projectId) => socket.join(projectId));
  socket.on('leave_project', (projectId) => socket.leave(projectId));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
EOF

echo "📦 [3/6] Writing backend/routes/stages.js..."
cat > backend/routes/stages.js << 'EOF'
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
EOF

echo "📦 [4/6] Writing frontend/src/hooks/useSocket.js..."
mkdir -p frontend/src/hooks
cat > frontend/src/hooks/useSocket.js << 'EOF'
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export function useSocket(projectId, onStageUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;

    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit('join_project', projectId);
    socketRef.current.on('stage_updated', (updatedProject) => {
      onStageUpdate(updatedProject);
    });

    return () => {
      socketRef.current.emit('leave_project', projectId);
      socketRef.current.disconnect();
    };
  }, [projectId]);
}
EOF

echo "📦 [5/6] Writing frontend/src/pages/ProjectDetail.jsx..."
cat > frontend/src/pages/ProjectDetail.jsx << 'EOF'
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { projectsAPI, stagesAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';

const STAGE_ICONS = ['🔍','✏️','📋','🎨','⚙️','🗄️','🔱','🚀'];
const STATUS_OPTIONS = ['pending', 'in_progress', 'done'];

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject]         = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [liveUpdate, setLiveUpdate]   = useState(false);

  useSocket(id, (updatedProject) => {
    setProject(updatedProject);
    setLiveUpdate(true);
    setTimeout(() => setLiveUpdate(false), 1500);
  });

  useEffect(() => {
    projectsAPI.getOne(id).then(({ data }) => setProject(data));
  }, [id]);

  const updateStage = async (stageNumber, updates) => {
    const { data } = await stagesAPI.update(id, stageNumber, updates);
    setProject(data);
  };

  const saveNotes = useCallback(
    debounce((stageNumber, val) => updateStage(stageNumber, { notes: val }), 500),
    []
  );

  if (!project) return <div className="loading">Loading...</div>;

  const selected = project.stages.find(s => s.stageNumber === activeStage);

  return (
    <div className="project-detail">
      <div className="detail-header">
        <h2>{project.title}</h2>
        {liveUpdate && <span className="live-badge">🟢 Live update</span>}
      </div>

      {project.client && <p className="client-label">Client: {project.client}</p>}

      <div className="progress-section">
        <div className="progress-bar large">
          <div className="progress-fill" style={{ width: `${project.progress}%` }} />
        </div>
        <span>{project.progress}% complete</span>
      </div>

      <div className="pipeline">
        {project.stages.map((stage) => (
          <div
            key={stage.stageNumber}
            className={`stage-node ${stage.status} ${activeStage === stage.stageNumber ? 'selected' : ''}`}
            onClick={() => setActiveStage(stage.stageNumber === activeStage ? null : stage.stageNumber)}
          >
            <span className="stage-icon">{STAGE_ICONS[stage.stageNumber - 1]}</span>
            <span className="stage-name">{stage.name}</span>
            <span className={`stage-dot ${stage.status}`} />
          </div>
        ))}
      </div>

      {selected && (
        <div className="stage-editor">
          <h3>{STAGE_ICONS[selected.stageNumber - 1]} Stage {selected.stageNumber} — {selected.name}</h3>
          <p className="tool-label">Tool: {selected.tool}</p>

          <div className="status-toggle">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                className={selected.status === s ? 'active' : ''}
                onClick={() => updateStage(selected.stageNumber, { status: s })}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Stage notes..."
            defaultValue={selected.notes}
            onChange={e => saveNotes(selected.stageNumber, e.target.value)}
          />

          <div className="artifacts">
            <h4>Artifacts</h4>
            {selected.artifacts.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noreferrer">{a.label}</a>
            ))}
            <ArtifactAdder onAdd={(artifact) =>
              updateStage(selected.stageNumber, {
                artifacts: [...selected.artifacts, artifact]
              })
            } />
          </div>
        </div>
      )}
    </div>
  );
}

function ArtifactAdder({ onAdd }) {
  const [label, setLabel] = useState('');
  const [url, setUrl]     = useState('');

  const handleAdd = () => {
    if (!label || !url) return;
    onAdd({ label, url });
    setLabel(''); setUrl('');
  };

  return (
    <div className="artifact-adder">
      <input placeholder="Label (e.g. PRD Doc)" value={label} onChange={e => setLabel(e.target.value)} />
      <input placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
EOF

echo "🔧 [5.5/6] Installing socket.io dependencies..."
cd backend && npm install socket.io && cd ..
cd frontend && npm install socket.io-client lodash && cd ..

echo "🐙 [6/6] Force pushing to existing repo..."
gh auth login
git remote add origin https://github.com/0-YuvrajSingh/cr.ve-food-ordering-platform.git 2>/dev/null || \
  git remote set-url origin https://github.com/0-YuvrajSingh/cr.ve-food-ordering-platform.git

git add .
git commit -m "feat: evolve to MERN AI pipeline manager with Socket.io real-time updates"
git push origin main --force

echo ""
echo "✅ Done! Repo live at: https://github.com/0-YuvrajSingh/cr.ve-food-ordering-platform"
