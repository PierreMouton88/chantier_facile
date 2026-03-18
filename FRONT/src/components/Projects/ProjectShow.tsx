import Button from "../Buttons";
import type { Project } from "../../types/projects.type";




export default function ProjectShow({ project }: { project: Project | undefined }) {
  return (
    
      <li className="flex items-start justify-between p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
        <div className="pr-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{project?.title}</h3>
            {project?.is_finished && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Terminé
              </span>
            )}
          </div>
          <p >
            <p>Description : </p>  
            {project?.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">{
            project?.start_date && `Début : ${new Date(project.start_date).toLocaleDateString()}`
          }</p>
        </div>
        <div className="">
          <Button to={`/project/edit/${project?.id}`} variant="secondary">
            Modifier
          </Button>
        </div>
      </li>
  );
}
