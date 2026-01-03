export type Job = {
  img: string;
  company: string;
  location: string;
  title: string;
  type: string;
  date: number;
  desc: string;
  tags: string[];
  salary: number;
};

export type TaskTag = "High" | "Planing" | "In Progress" | "Low" | "Completed";

export type Task = {
  img: string;
  title: string;
  date: string;
  tag: TaskTag[];
  progress: number;
};

export type Candidate = {
  img: string;
  title: string;
  job: string;
  des: string;
  rating: string;
  skills: string[];
  location: string;
  salary: string;
};

export type Recruiter = {
  img: string;
  title: string;
  rating: string;
  location: string;
  open: number;
};
