"use client";

import { useState } from "react";
import { Skill } from "@/types/job/skill";

interface Props {
  onClose: () => void;
  onSubmit: (payload: Partial<Skill>) => void;
}

export default function CreateSkillModal({ onClose, onSubmit }: Props) {
  const [name, setName] = useState("");

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "#00000080" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Skill</h5>
            <button className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <input
              className="form-control"
              placeholder="Skill name"
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
              onClick={() => onSubmit({ name })}
              disabled={!name.trim()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
