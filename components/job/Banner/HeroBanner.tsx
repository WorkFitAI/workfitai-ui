"use client";

import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setFilter } from "@/redux/features/job/jobFilterSlice";
import { JobFilterState } from "@/redux/features/job/jobFilterSlice";

export default function HeroBanner() {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((s) => s.jobFilter.filter);

  // =============================
  // LOCAL STATE (GIỮ INPUT)
  // =============================
  const [keyword, setKeyword] = useState(filter.title?.[0] ?? "");

  // sync khi filter đổi từ nơi khác (sidebar, reset...)
  useEffect(() => {
    setKeyword(filter.title?.[0] ?? "");
  }, [filter.title]);

  // =============================
  // DEBOUNCE REF
  // =============================
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const updateFilterDebounced = (nextFilter: JobFilterState["filter"]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      dispatch(setFilter(nextFilter));
    }, 800);
  };

  return (
    <section className="section-box-2">
      <div className="container">
        <div className="banner-hero banner-single banner-single-bg">
          <div className="block-banner text-center">
            <div className="form-find text-start mt-40">
              <form onSubmit={(e) => e.preventDefault()}>
                {/* ===== Industry ===== */}
                <div className="box-industry">
                  <select
                    className="form-input mr-10"
                    value={filter.industry?.[0] ?? "0"}
                    onChange={(e) =>
                      updateFilterDebounced({
                        ...filter,
                        industry:
                          e.target.value === "0" ? [] : [e.target.value],
                      })
                    }
                  >
                    <option value="0">Industry</option>
                    <option value="Software">Software</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                {/* ===== Location ===== */}
                <div className="box-industry">
                  <select
                    className="form-input mr-10"
                    value={filter.location?.[0] ?? ""}
                    onChange={(e) =>
                      updateFilterDebounced({
                        ...filter,
                        location: e.target.value ? [e.target.value] : [],
                      })
                    }
                  >
                    <option value="">Location</option>

                    <option value="Tuyên Quang">Tuyên Quang</option>
                    <option value="Lào Cai">Lào Cai</option>
                    <option value="Thái Nguyên">Thái Nguyên</option>
                    <option value="Phú Thọ">Phú Thọ</option>
                    <option value="Bắc Ninh">Bắc Ninh</option>
                    <option value="Hưng Yên">Hưng Yên</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Ninh Bình">Ninh Bình</option>
                    <option value="Quảng Trị">Quảng Trị</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Quảng Ngãi">Quảng Ngãi</option>
                    <option value="Gia Lai">Gia Lai</option>
                    <option value="Khánh Hòa">Khánh Hòa</option>
                    <option value="Lâm Đồng">Lâm Đồng</option>
                    <option value="Đắk Lắk">Đắk Lắk</option>
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Đồng Nai">Đồng Nai</option>
                    <option value="Tây Ninh">Tây Ninh</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                    <option value="Vĩnh Long">Vĩnh Long</option>
                    <option value="Đồng Tháp">Đồng Tháp</option>
                    <option value="Cà Mau">Cà Mau</option>
                    <option value="An Giang">An Giang</option>

                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Huế">Huế</option>
                    <option value="Lai Châu">Lai Châu</option>
                    <option value="Điện Biên">Điện Biên</option>
                    <option value="Sơn La">Sơn La</option>
                    <option value="Lạng Sơn">Lạng Sơn</option>
                    <option value="Quảng Ninh">Quảng Ninh</option>
                    <option value="Thanh Hóa">Thanh Hóa</option>
                    <option value="Nghệ An">Nghệ An</option>
                    <option value="Hà Tĩnh">Hà Tĩnh</option>
                    <option value="Cao Bằng">Cao Bằng</option>
                  </select>
                </div>

                {/* ===== Keyword ===== */}
                <input
                  className="form-input input-keysearch mr-10"
                  type="text"
                  placeholder="Your keyword..."
                  value={keyword} // LOCAL STATE
                  onChange={(e) => {
                    const v = e.target.value;
                    setKeyword(v); // giữ chữ NGAY

                    updateFilterDebounced({
                      ...filter,
                      title: v ? [v] : [],
                    });
                  }}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
