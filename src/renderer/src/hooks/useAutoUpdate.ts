import { useNotifyStore } from "@/store/ui/notifyStore";
import { useEffect, useState } from "react";

interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

export const useAutoUpdate = () => {
  const [hasNewUpdate, setHasNewUpdate] = useState(false);
  const [status, setStatus] = useState<string>("Idle");
  const [progress, setProgress] = useState<DownloadProgress | null>(null);

  const { notify, updateNotify } = useNotifyStore();

  useEffect(() => {
    (async () => {
      const res = await window.context.hasNewUpdate();
      if (res.success) {
        setHasNewUpdate(true);
        notify("update", res.message, {
          label: "update now",
          handler: checkForUpdates
        });
      }
    })();

    window.context.onUpdateStatus((_event, message: string) => setStatus(message));
    window.context.onDownloadProgress((_event, progressObj: DownloadProgress) =>
      setProgress(progressObj)
    );
  }, []);

  const checkForUpdates = () => {
    window.context.checkForUpdates();
    if (progress) {
      updateNotify("Downloading update...", progress.percent.toFixed(2), () => {});
    }

    if (status.includes("Update downloaded")) {
      updateNotify("Want to update now?", "restart", restartApp);
    }
  };

  const restartApp = () => {
    window.context.restartApp();
  };

  return { hasNewUpdate, status, progress, checkForUpdates, restartApp };
};
