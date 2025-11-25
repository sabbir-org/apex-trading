import { useNotifyStore } from "@/store/ui/notifyStore";
import style from "./css/toast.module.css";

const Notification = ({ children }) => {
  const { notifyId } = useNotifyStore();

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-10 flex min-h-12 w-[300px] -translate-x-1/2 items-center justify-between rounded border bg-white px-4 shadow ${notifyId && style.show_toast}`}
    >
      {children}
    </div>
  );
};

export default Notification;
