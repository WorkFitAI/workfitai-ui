// "use client";

// import React from "react";
// import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import {
//   addFilterValue,
//   removeFilterValue,
// } from "@/redux/features/job/jobFilterSlice";

// const POSITIONS = [
//   { name: "Senior", enum: "SENIOR", count: 120 },
//   { name: "Mid-Level", enum: "MID", count: 80 },
//   { name: "Junior", enum: "JUNIOR", count: 60 },
//   { name: "Fresher", enum: "FRESHER", count: 40 },
// ];

// export default function PositionFilter() {
//   const dispatch = useAppDispatch();
//   const selectedFilters = useAppSelector(
//     (state) => state.jobFilter.filter["experienceLevel"] || []
//   );

//   const handleToggle = (enumName: string, checked: boolean) => {
//     if (checked) {
//       dispatch(addFilterValue({ field: "experienceLevel", value: enumName }));
//     } else {
//       dispatch(
//         removeFilterValue({ field: "experienceLevel", value: enumName })
//       );
//     }
//   };

//   return (
//     <div className="filter-block mb-30">
//       <h5 className="medium-heading mb-10">Position</h5>
//       <div className="form-group">
//         <ul className="list-checkbox">
//           {POSITIONS.map((item) => {
//             const isChecked = selectedFilters.includes(item.enum);
//             return (
//               <li key={item.enum}>
//                 <label className="cb-container">
//                   <input
//                     type="checkbox"
//                     checked={isChecked}
//                     onChange={(e) => handleToggle(item.enum, e.target.checked)}
//                   />
//                   <span className="text-small">{item.name}</span>
//                   <span className="checkmark" />
//                 </label>
//                 <span className="number-item">{item.count}</span>
//               </li>
//             );
//           })}
//         </ul>
//       </div>
//     </div>
//   );
// }
