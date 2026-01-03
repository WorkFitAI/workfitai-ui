"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  addFilterValue,
  removeFilterValue,
} from "@/redux/features/job/jobFilterSlice";
import { selectSkillNames } from "@/redux/selectors/jobFilterSelectors";

const SKILLS = [
  { name: "Java", value: "JAVA" },
  { name: "Spring Boot", value: "SPRING_BOOT" },
  { name: "React", value: "REACT" },
  { name: "TypeScript", value: "TYPESCRIPT" },
  { name: "Python", value: "PYTHON" },
  { name: "Docker", value: "DOCKER" },
  { name: "Kubernetes", value: "KUBERNETES" },
  { name: "AWS", value: "AWS" },
  { name: "GCP", value: "GCP" },
  { name: "Azure", value: "AZURE" },
  { name: "MySQL", value: "MYSQL" },
  { name: "PostgreSQL", value: "POSTGRESQL" },
  { name: "MongoDB", value: "MONGODB" },
  { name: "Redis", value: "REDIS" },
  { name: "Node.js", value: "NODE_JS" },
  { name: "Express.js", value: "EXPRESS_JS" },
  { name: "Angular", value: "ANGULAR" },
  { name: "Vue.js", value: "VUE_JS" },
  { name: "GraphQL", value: "GRAPHQL" },
  { name: "REST API", value: "REST_API" },
  { name: "Microservices", value: "MICROSERVICES" },
  { name: "CI/CD", value: "CI_CD" },
  { name: "Jenkins", value: "JENKINS" },
  { name: "Git", value: "GIT" },
  { name: "Terraform", value: "TERRAFORM" },
  { name: "Ansible", value: "ANSIBLE" },
  { name: "ElasticSearch", value: "ELASTICSEARCH" },
  { name: "Kafka", value: "KAFKA" },
  { name: "RabbitMQ", value: "RABBITMQ" },
  { name: "Machine Learning", value: "MACHINE_LEARNING" },
  { name: ".NET", value: ".NET" },
];

export default function SkillFilter() {
  const dispatch = useAppDispatch();
  const selectedSkills = useAppSelector(selectSkillNames);

  const handleToggle = (skillValue: string, checked: boolean) => {
    if (checked) {
      dispatch(addFilterValue({ field: "skills.name", value: skillValue }));
    } else {
      dispatch(removeFilterValue({ field: "skills.name", value: skillValue }));
    }
  };

  return (
    <div className="filter-block mb-20">
      <h5 className="medium-heading mb-15">Skills</h5>
      <ul className="list-checkbox">
        {SKILLS.map((skill) => {
          const isChecked = !!selectedSkills?.includes(skill.value);
          return (
            <li key={skill.value}>
              <label className="cb-container">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => handleToggle(skill.value, e.target.checked)}
                />
                <span className="text-small">{skill.name}</span>
                <span className="checkmark" />
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
