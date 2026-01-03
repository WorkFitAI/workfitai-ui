import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer mt-20">
      <div className="container">
        <div className="box-footer">
          <div className="row">
            <div className="col-md-6 col-sm-12 mb-25 text-center text-md-start">
              <p className="font-sm color-text-paragraph-2">
                © {new Date().getFullYear()} -{" "}
                <Link
                  className="color-brand-2"
                  href="/"
                  target="_blank"
                >
                  WorkfitAI{" "}
                </Link>
                Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
