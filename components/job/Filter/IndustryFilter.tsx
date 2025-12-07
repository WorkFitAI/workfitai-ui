// "use client";
// import React from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { addFilter, removeFilter } from "@/redux/features/job/jobFilterSlice";

// export default function IndustryFilter() {
//   const dispatch = useAppDispatch();
//   const currentFilter = useAppSelector((state) => state.jobFilter.filter);

//   const industries = [
//     { name: "Software", count: 12 },
//     { name: "Finance", count: 23 },
//     { name: "Recruiting", count: 43 },
//     { name: "Management", count: 65 },
//     { name: "Advertising", count: 76 },
//   ];

//   const handleChange = (industry: string, checked: boolean) => {
//     if (checked) dispatch(addFilter(industry));
//     else dispatch(removeFilter(industry));
//   };

//   return (
//     <div className="filter-block mb-20">
//       <h5 className="medium-heading mb-15">Industry</h5>
//       <div className="form-group">
//         <ul className="list-checkbox">
//           {industries.map((item, idx) => (
//             <li key={idx}>
//               <label className="cb-container">
//                 <input
//                   type="checkbox"
//                   checked={currentFilter.includes(item.name)}
//                   onChange={(e) => handleChange(item.name, e.target.checked)}
//                 />
//                 <span className="text-small">{item.name}</span>
//                 <span className="checkmark" />
//               </label>
//               <span className="number-item">{item.count}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
