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
