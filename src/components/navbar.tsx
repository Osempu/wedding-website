import { useLocation } from "react-router";

function AppNavbar() {
  const location = useLocation();

  const navStyling =
    location.pathname == "/"
      ? "bg-transparent absolute top-0 left-0 z-20 w-full px-20 items-center mt-8 grid grid-cols-3 text-white font-semibold"
      : "bg-[#FEF3C6] backdrop-blur-md w-full px-20 py-4 items-center mt-0 grid grid-cols-3 text-[#040404] font-semibold";

  return (
    <>
      <nav className={navStyling}>
        <ul className="flex flex-row gap-5 ">
          <li>
            <a href="/">Inicio</a>
          </li>
          <li>
            <a href="/album">Album</a>
          </li>
        </ul>
        <div className="justify-self-center text-center">
          <div className="justify-self-center text-center">Oscar & Yolanda</div>
        </div>
        <div className="outline p-2 rounded-sm border-1 justify-self-end w-max">
          <a href="/rsvp">Confirma Asistencia</a>
        </div>
      </nav>
    </>
  );
}

export default AppNavbar;
