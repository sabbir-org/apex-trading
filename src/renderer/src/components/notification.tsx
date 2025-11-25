import { useNotifyStore } from "@/store/ui/notifyStore";
import style from "./css/toast.module.css";

const Notification = () => {
  const { action, notifyId, content, isAnimating, close } = useNotifyStore();

  if (!notifyId && !isAnimating) return null;
  return (
    <div
      className={`fixed bottom-4 left-1/2 z-10 flex min-h-12 w-[300px] -translate-x-1/2 items-center justify-between rounded border bg-white pr-2 pl-4 shadow ${notifyId && style.show_toast}`}
    >
      <p className={``}>{content}</p>

      {action && (
        <button
          className={`h-8 w-[100px] cursor-pointer rounded border border-blue-400 text-blue-600`}
          onClick={action.handler}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Notification;
