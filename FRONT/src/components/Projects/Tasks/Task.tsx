import { useParams } from "react-router-dom";
import Button from "../../Buttons";
import type { Task } from "../../../types/task.type";

export const TaskComponent = ({ ProjectTask }: Task) => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0', 10);
  console.log("Rendering TaskComponent for task:", projectId);
  return (
    <div
      key={ProjectTask.taskId}
      className="flex justify-between content-around p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300"
    >
      <div>
        <div className="font-bold text-lg">{ProjectTask.title}</div>
        <div className="text-sm text-gray-600">
          Métier : {ProjectTask.id} | Client : {ProjectTask.customer}
        </div>
        <div className="text-xs text-gray-400">
          Statut : {ProjectTask.status} | Date Prévu : {ProjectTask.end_date}
        </div>
      </div>
      <div className="grid content-around">
        <Button
          variant="secondary"
          to={`/project/task/edit/${ProjectTask.id}`}
        >
          Modifier
        </Button>
      </div>
    </div>
  );
};
