export function Footer() {
  return (
    <section className="flex flex-row justify-around p-20 bg-amber-600 text-white text-xl underline">
      <div className="flex flex-col gap-5">
        <a href="#">Inicio</a>
        <a href="#">Donde será?</a>
        <a href="#">Codigo De Vestimenta?</a>
        <a href="#">Programa</a>
      </div>
      <div className="flex flex-col gap-5">
        <a href="#">Album</a>
        <a href="#">Confirmar Asistencia</a>
        <a href="#">Mesa De Regalos</a>
      </div>
      <div className="flex flex-col gap-5">
        <a href="#" className="flex gap-3 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-instagram-icon lucide-instagram"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
          <span className="mb-1">Instagram</span>
        </a>
        <a href="#">Web</a>
        <a href="#">yolandayoscar@mail.com</a>
      </div>
    </section>
  );
}
