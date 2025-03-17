import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="relative container h-full mx-auto   bg-neutral-100 shadow-xl shadow-neutral-300">
      <div className="h-[100px] bg-primary" />
      <div className=" px-4  h-full ">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
