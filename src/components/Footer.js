"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-top shadow-sm mt-5">
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand Section */}
          <div className="col-12 col-md-6 col-lg-3">
            <h3 className="h5 fw-bold text-primary mb-3">TravelGo</h3>
            <p className="text-secondary small">Tu aventura comienza aquí. Explora el mundo con nosotros.</p>
          </div>

          {/* Company Links */}
          <div className="col-6 col-md-6 col-lg-3">
            <h4 className="h6 fw-semibold text-dark mb-3">Empresa</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/sobre-nosotros" className="text-secondary text-decoration-none small hover-primary">
                  Sobre nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/blog" className="text-secondary text-decoration-none small hover-primary">
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/contacto" className="text-secondary text-decoration-none small hover-primary">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-6 col-md-6 col-lg-3">
            <h4 className="h6 fw-semibold text-dark mb-3">Soporte</h4>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link href="/faq" className="text-secondary text-decoration-none small hover-primary">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/terminos" className="text-secondary text-decoration-none small hover-primary">
                  Términos de Servicio
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/privacidad" className="text-secondary text-decoration-none small hover-primary">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-12 col-md-6 col-lg-3">
            <h4 className="h6 fw-semibold text-dark mb-3">Síguenos</h4>
            <div className="d-flex gap-3">
              <a href="#" className="text-secondary hover-primary" aria-label="Facebook">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a href="#" className="text-secondary hover-primary" aria-label="Instagram">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808a6.78 6.78 0 01-.465 2.427 4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153 6.78 6.78 0 01-2.427.465c-1.024.048-1.378.06-3.808.06s-2.784-.012-3.808-.06a6.78 6.78 0 01-2.427-.465 4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772 6.78 6.78 0 01-.465-2.427c-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808a6.78 6.78 0 01.465-2.427 4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525a6.78 6.78 0 012.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7.177a4.823 4.823 0 100 9.646 4.823 4.823 0 000-9.646zm0 7.857a3.033 3.033 0 110-6.066 3.033 3.033 0 010 6.066zm6.536-7.857a1.14 1.14 0 100-2.28 1.14 1.14 0 000 2.28z" />
                </svg>
              </a>
              <a href="#" className="text-secondary hover-primary" aria-label="Twitter">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-top mt-4 pt-4 text-center">
          <p className="text-secondary small mb-0">© {new Date().getFullYear()} TravelGo. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
