import { CustomLink, Modal, Sheet } from "@/components";
import { useAutoUpdate } from "@/hooks/useAutoUpdate";
import { useMenu } from "@/hooks/useMenu";

import { useCloudStore, useExtraStore } from "@/store";
import {
  Grid2x2,
  Package,
  PlusCircle,
  RefreshCw,
  ScrollText,
  ShieldUser,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import icon from "../assets/icon.png";
import { Menu } from "./menu";
import Notification from "./notification";
import { Toast } from "./toast";
import { Subtitle } from "./typography";

const Layout = ({ children }) => {
  const { status, progress, checkForUpdates, restartApp } = useAutoUpdate();

  useEffect(() => {
    (async () => {
      await window.context.reloadDatabase();
    })();

    useExtraStore.getState().fetchAll();
  }, []);

  let locked = false;

  const handleUpdate = () => {
    if (locked) return;
    locked = true;
    setTimeout(() => {
      locked = false;
    }, 1000);
    checkForUpdates();
  };

  return (
    <div className={`h-full`}>
      <Sidebar></Sidebar>
      <Main>{children}</Main>
      <Toast />
      <Modal></Modal>
      <Sheet></Sheet>
      {status && (
        <Notification>
          <div>
            {status.includes("Downloading") ? (
              <div className={`h-1 w-[150px] overflow-hidden rounded bg-blue-100`}>
                <div
                  className={`h-1 w-0 rounded bg-blue-500`}
                  style={{
                    width: `${progress?.percent.toFixed(2) || 0}%`
                  }}
                ></div>
              </div>
            ) : (
              <p>{status}</p>
            )}
          </div>

          {status.includes("New version available") && (
            <button className={`cursor-pointer text-blue-600`} onClick={handleUpdate}>
              Update now
            </button>
          )}

          {status.includes("Checking for update") && (
            <RefreshCw className={`mr-2 h-4 w-4 animate-spin text-blue-600`}></RefreshCw>
          )}

          {status.includes("Downloading") && (
            <p className={`text-blue-600`}>{progress?.percent.toFixed(1)}%</p>
          )}

          {status.includes("Update now") && (
            <button className={`cursor-pointer text-blue-600`} onClick={restartApp}>
              restart
            </button>
          )}
        </Notification>
      )}
    </div>
  );
};

const Sidebar = () => {
  const { isSyncOn, loading, verifyToken, loggedIn, turnOnSync } = useCloudStore();
  const menuHook = useMenu();
  const navigate = useNavigate();
  const [newId, setNewId] = useState("");

  useEffect(() => {
    if (isSyncOn) {
      verifyToken();
    }
  }, []);

  const handleLogin = () => {
    useCloudStore.getState().login();
  };

  function handleMenuClick(e: React.MouseEvent) {
    const id = v4();
    setNewId(id);
    menuHook.openMenu(id, e, { x: e.clientX, y: e.clientY });
  }

  return (
    <div
      className={`fixed top-0 left-0 z-10 flex h-full w-[200px] flex-col justify-between border-r bg-white`}
    >
      <div className={`p-4`}>
        <nav className={`mb-8 flex cursor-pointer gap-x-1`} onClick={() => navigate("/")}>
          <img src={icon} className={`h-[20px]`} alt="icon" /> Apex Trading
        </nav>

        <Subtitle className={`mb-3`}>Menu</Subtitle>

        <div className={`space-y-1`}>
          <CustomLink to={"/"}>
            <Grid2x2 size={16} />
          </CustomLink>
          <CustomLink to={"/product"}>
            <Package size={16} />
          </CustomLink>

          <CustomLink to={"/customer"}>
            <User size={16} />
          </CustomLink>
          <CustomLink to={"/supplier"}>
            <ShieldUser size={16} />
          </CustomLink>

          <CustomLink to={"/transaction"}>
            <ScrollText size={16} />
          </CustomLink>
        </div>

        <div className={`mt-4 flex w-full flex-col gap-y-2`}>
          <button
            className={`mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-blue-300 px-2 text-lg text-blue-600 outline-[4px] outline-blue-100`}
            onClick={handleMenuClick}
          >
            +
          </button>
          {menuHook.openMenuId === newId && (
            <Menu hook={menuHook}>
              <div className={`flex flex-col`} onClick={menuHook.closeMenu}>
                <button
                  className={`flex h-8 items-center justify-between rounded px-2 outline-none hover:bg-gray-100`}
                  onClick={() => navigate("/newsale")}
                >
                  create bill <PlusCircle className={`h-4 w-4 text-blue-600`}></PlusCircle>
                </button>
                <button
                  className={`flex h-8 items-center justify-between rounded px-2 outline-none hover:bg-gray-100`}
                  onClick={() => navigate("/newpurchase")}
                >
                  make purhase <PlusCircle className={`h-4 w-4 text-blue-600`}></PlusCircle>
                </button>
              </div>
            </Menu>
          )}
        </div>
      </div>
      <div className={`px-2`}>
        {loggedIn ? (
          <button
            className={`mb-2 flex h-8 w-full cursor-pointer items-center justify-center rounded border border-blue-400 text-blue-600 outline-none`}
            onClick={turnOnSync}
          >
            {loading ? <RefreshCw className={`h-4 w-4 animate-spin`}></RefreshCw> : "Backup"}
          </button>
        ) : (
          <button
            className={`mb-2 flex h-8 w-full cursor-pointer items-center justify-center rounded border border-blue-400 text-blue-600 outline-none`}
            onClick={handleLogin}
          >
            {loading ? <RefreshCw className={`h-4 w-4 animate-spin`}></RefreshCw> : "Login"}
          </button>
        )}
      </div>
    </div>
  );
};

const Main = ({ children }) => {
  return <div className={`ml-[200px] min-h-full flex-1 bg-gray-50/20 p-4`}>{children}</div>;
};
export default Layout;
