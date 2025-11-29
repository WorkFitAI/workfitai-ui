"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import useHasHydrated from "@/util/useHasHydrated";

export default function UnauthorizedPage() {
  const router = useRouter();
  const hasHydrated = useHasHydrated();
  const user = useAppSelector(selectAuthUser);
  const displayUser = hasHydrated ? user : null;

  return (
    <section className="pt-100 login-register">
      <div className="container">
        <div className="row login-register-cover">
          <div className="col-lg-6 col-md-8 col-sm-12 mx-auto">
            <div className="text-center">
              <div className="mb-40">
                <h2 className="color-brand-1 mb-10">403 - Access Denied</h2>
                <p className="font-md color-text-paragraph-2">
                  {displayUser
                    ? `Sorry ${
                        displayUser.username || "user"
                      }, you don't have permission to access this resource.`
                    : "You don't have permission to access this resource."}
                </p>
                {displayUser?.role && (
                  <p className="font-sm color-text-paragraph mt-10">
                    Your current role: <strong>{displayUser.role}</strong>
                  </p>
                )}
              </div>

              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button
                  onClick={() => router.back()}
                  className="btn btn-default hover-up"
                >
                  Go Back
                </button>
                <Link href="/" className="btn btn-border hover-up">
                  Go to Home
                </Link>
                {!displayUser && (
                  <Link href="/signin" className="btn btn-brand-1 hover-up">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
