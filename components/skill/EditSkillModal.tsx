import { Skill } from "@/types/job/skill";
import { useState } from "react";

interface Props {
  skill: Skill;
  onClose: () => void;
  onSubmit: (skill: Skill) => void;
}

export default function EditSkillModal({ skill, onClose, onSubmit }: Props) {
  const [name, setName] = useState(skill.name);

  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Edit Skill</h5>
          </div>

          <div className="modal-body">
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onSubmit({ ...skill, name })}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
