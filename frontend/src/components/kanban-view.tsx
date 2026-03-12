import type { Skill } from "@/types";
import { KanbanBoard } from "@/components/kanban-board";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import api from '@/lib/api';

export function KanbanView() {
    // TODO: replace with request
    const [skills, setSkills] = useState<Skill[]>([]);
    const [fetchError, setFetchError] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
      const accessToken = localStorage.getItem('jwtToken');
      if (accessToken === null) {
        navigate('/login');
        return;
      }
      (async () => {
        try {
          const response = await api.get('/skills/');
          setSkills(response.data);
        } catch (error) {
          console.log(error);
          setFetchError(true);
          return;
        }
      })();
    }, []);

    return (
      <>
        {fetchError && <h2>The item you are looking for could not be found</h2>}
        <div>
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <KanbanBoard
              key={level}
              skills={skills.filter(s => s.skill.level === level)}
              level={level}
            />
          ))}
        </div>
      </>
    )
}