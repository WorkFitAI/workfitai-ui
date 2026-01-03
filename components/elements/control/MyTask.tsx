
import { Task, TaskTag } from "@/types";

type MyTaskProps = {
  task: Task;
};

const tagClassNames: Record<TaskTag, string> = {
  High: "high",
  Planing: "planing",
  "In Progress": "in-progress",
  Low: "low",
  Completed: "complete",
};

export default function MyTask({ task }: MyTaskProps) {
  return (
    <div className="card-style-2 hover-up">
      <div className="card-head">
        <div className="card-image">
          <img src={`/assets/imgs/page/dashboard/${task.img}`} alt="jobBox" />
        </div>
        <div className="card-title">
          <h6>{task.title}</h6>
          <span className="text-muted">Start: </span>
          <span>{task.date} days ago</span>
        </div>
      </div>
      <div className="mr-15">
        {task.tag.map((item) => (
          <span key={`${task.title}-${item}`}>
            <a className={`btn btn-tag ${tagClassNames[item]}`}>{item}</a>
          </span>
        ))}
      </div>
      <div className="card-progress">
        <span>Complete: </span>
        <strong>{task.progress}</strong>
        <span className="hour"> %</span>
      </div>
    </div>
  );
}
