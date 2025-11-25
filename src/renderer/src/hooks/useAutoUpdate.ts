import { useNotifyStore } from "@/store/ui/notifyStore";
import { useEffect, useState } from "react";

interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

export const useAutoUpdate = () => {
  const [status, setStatus] = useState<string>("");
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const { notify } = useNotifyStore();

  useEffect(() => {
    (async () => {
      const res = await window.context.hasNewUpdate();
      if (res.success) {
        setStatus(res.message);
        notify("update");
      }
    })();

    window.context.onUpdateStatus((_event, message: string) => setStatus(message));
    window.context.onDownloadProgress((_event, progressObj: DownloadProgress) =>
      setProgress(progressObj)
    );
  }, []);

  const checkForUpdates = () => {
    window.context.checkForUpdates();
  };

  const restartApp = () => {
    window.context.restartApp();
  };

  return { status, progress, checkForUpdates, restartApp };
};
