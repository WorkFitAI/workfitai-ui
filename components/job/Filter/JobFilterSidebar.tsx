import React from "react";
// import IndustryFilter from "./IndustryFilter";
import SalaryFilter from "./SalaryFilter";
// import KeywordFilter from "./KeywordFilter";
// import PositionFilter from "./PositionFilter";
// import ExperienceFilter from "./ExperienceFilter";
import WorkTypeFilter from "./WorkTypeFilter";
import PostedFilter from "./PostedFilter";

export default function JobFilterSidebar() {
  return (
    <div className="col-lg-3 col-md-12 col-sm-12 col-12">
      <div className="sidebar-shadow none-shadow mb-30">
        <div className="sidebar-filters">
          {/* <IndustryFilter /> */}
          <SalaryFilter />
          {/* <KeywordFilter /> */}
          {/* <PositionFilter /> */}
          {/* <ExperienceFilter /> */}
          <WorkTypeFilter />
          <PostedFilter />
        </div>
      </div>
    </div>
  );
}
