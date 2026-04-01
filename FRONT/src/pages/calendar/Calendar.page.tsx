import React, { useMemo } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import frLocale from '@fullcalendar/core/locales/fr';
import { useGetAllProjectsByUserId } from '../../hooks/useProject'; // Ajustez le chemin selon votre structure
import type { Task } from '../../types/task.type';
import { useMe } from '../../hooks/useAuth';


const CalendarPage: React.FC = () => {
  const { data: user } = useMe();
  
  // On récupère les projets qui contiennent normalement les tâches
  const { data: projects, isLoading, isError } = useGetAllProjectsByUserId(user?.id);

  // Transformation des données Prisma en événements FullCalendar
  const events = useMemo(() => {
    if (!projects) return [];

    return projects.flatMap(project => 
      (project.tasks || []).map((task: Task) => ({
        id: String(task.id),
        title: `${project.title} : ${task.title}`,
        start: task.start_date,
        end: task.end_date,
        extendedProps: {
          status: task.status,
          description: task.description
        },
        // Couleur selon le statut
        backgroundColor: task.status === 'finished' ? '#10b981' : '#3b82f6',
        borderColor: 'transparent'
      }))
    );
  }, [projects]);

  if (isLoading) return <div className="p-8 text-center">Chargement du planning...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Erreur lors du chargement des tâches.</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm h-screen">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Mon Planning Travaux</h1>
      
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        locale={frLocale}
        events={events}
        
        editable={true}
        selectable={true}
        height="80%"
        eventClick={(info) => {
          alert(`Tâche : ${info.event.title}\nStatus : ${info.event.extendedProps.status}`);
        }}
        // Style personnalisé pour Tailwind
        eventClassNames="cursor-pointer hover:opacity-80 transition-opacity p-1 shadow-sm"
      />
    </div>
  );
};

export default CalendarPage;