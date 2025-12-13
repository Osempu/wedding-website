import { Outlet } from "react-router";
import AppNavbar from "./navbar";

function LayoutComponent() {
  return (
    <>
      <AppNavbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default LayoutComponent;
