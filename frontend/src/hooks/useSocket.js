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
