"use client";

import { useEffect, useState } from "react";
import CrudTable, { CrudColumn } from "@/components/common/CrudTable";
import { getSkills, postSkill, putSkill, deleteSkill } from "@/lib/skillApi";
import { toast } from "react-toastify";
import { Skill } from "@/types/job/skill";
import EditSkillModal from "@/components/skill/EditSkillModal";
import CreateSkillModal from "@/components/skill/CreateSkillModal";
import { BsPlusLg, BsSearch } from "react-icons/bs";

export default function SkillPageClient() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  /** LOAD DATA */
  const loadSkills = async () => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        size: "5",
      });

      if (keyword.trim()) {
        query.append("filter", `name ~'${keyword.trim()}'`);
      }

      const res = await getSkills<{
        result: Skill[];
        meta: { pages: number };
      }>(`/admin/skills?${query.toString()}`);

      setSkills(res?.data?.result || []);
      setTotalPages(res?.data?.meta?.pages || 1);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setPage(0);
  }, [keyword]);

  useEffect(() => {
    loadSkills();
  }, [page, keyword]);

  /** CREATE */
  const handleCreate = async (payload: Partial<Skill>) => {
    try {
      await postSkill("/admin/skills", { body: payload });
      toast.success("Skill created");
      setPage(0);
      loadSkills();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /** UPDATE */
  const handleUpdate = async (payload: Skill) => {
    try {
      await putSkill(`/admin/skills`, {
        body: payload,
      });
      toast.success("Skill updated");
      setEditingSkill(null);
      loadSkills();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /** DELETE */
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this skill?")) return;

    try {
      await deleteSkill(`/admin/skills/${id}`);
      toast.success("Skill deleted");
      loadSkills();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  /** TABLE COLUMNS */
  const columns: CrudColumn<Skill>[] = [
    {
      key: "name",
      header: "Skill",
      render: (s) => s.name,
    },
    {
      key: "actions",
      header: "Actions",
      render: (s) => (
        <>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => setEditingSkill(s)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(s.skillId)}
          >
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="row mb-3 align-items-center">
        {/* SEARCH */}
        <div className="col-md-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search skill..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setPage(0);
                  loadSkills();
                }
              }}
            />
            <span className="input-group-text bg-white">
              <BsSearch />
            </span>
          </div>
        </div>

        {/* ADD BUTTON */}
        <div className="col-md-8 text-end">
          <button
            className="btn btn-primary d-inline-flex align-items-center gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <BsPlusLg />
            Add Skill
          </button>
        </div>
      </div>

      <CrudTable
        title="Skills"
        data={skills}
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {/* CREATE MODAL */}
      {createOpen && (
        <CreateSkillModal
          onClose={() => setCreateOpen(false)}
          onSubmit={async (payload) => {
            await handleCreate(payload);
            setCreateOpen(false);
          }}
        />
      )}

      {/* EDIT MODAL */}
      {editingSkill && (
        <EditSkillModal
          skill={editingSkill}
          onClose={() => setEditingSkill(null)}
          onSubmit={handleUpdate}
        />
      )}
    </>
  );
}
