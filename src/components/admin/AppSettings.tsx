import { useCallback, useEffect, useState } from "react";
import { Download, Bell, BellOff, Check, Share, Plus, Smartphone } from "lucide-react";
import {
  canInstall,
  isIos,
  isStandalone,
  notificationState,
  onInstallAvailabilityChange,
  promptInstall,
  registerServiceWorker,
  requestNotificationPermission,
  type NotificationState,
} from "@/lib/pwa";
import { pushConfigured, registerForPush } from "@/lib/push";
import { useAuth } from "@/context/AuthContext";

/**
 * Install and notification controls for the admin.
 *
 * Rendered in the sidebar footer. Both rows hide themselves once there is
 * nothing left to offer, so a practice that has already installed the app and
 * allowed notifications sees no permanent clutter.
 */
export function AppSettings({ compact = false }: { compact?: boolean }) {
  const { user } = useAuth();
  const [installable, setInstallable] = useState(canInstall());
  const [installed, setInstalled] = useState(isStandalone());
  const [perm, setPerm] = useState<NotificationState>("default");
  const [busy, setBusy] = useState(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    setPerm(notificationState());
    setInstalled(isStandalone());
    return onInstallAvailabilityChange(setInstallable);
  }, []);

  const enableNotifications = useCallback(async () => {
    setBusy(true);
    try {
      // The worker must exist before a notification can be shown through it.
      await registerServiceWorker();
      const result = await requestNotificationPermission();
      setPerm(result);
      if (result === "granted" && user?.uid && pushConfigured()) {
        // Best-effort: a failure here only means server-sent push won't reach
        // this device. Notifications raised by the open panel still work.
        await registerForPush(user.uid);
      }
    } finally {
      setBusy(false);
    }
  }, [user?.uid]);

  const install = useCallback(async () => {
    if (isIos()) {
      setShowIosHelp((v) => !v);
      return;
    }
    const outcome = await promptInstall();
    if (outcome === "accepted") setInstalled(true);
  }, []);

  // iOS has no install prompt API; Safari requires the share-sheet route, so
  // offer instructions there instead of a button that cannot work.
  const showInstall = !installed && (installable || isIos());
  const showNotify = perm !== "granted" && perm !== "unsupported";

  if (!showInstall && !showNotify) return null;

  return (
    <div className={`af-appsettings ${compact ? "af-appsettings--compact" : ""}`}>
      {showInstall && (
        <button className="af-appsettings-row" onClick={install} type="button">
          <span className="af-appsettings-icon">
            {isIos() ? <Share size={16} /> : <Download size={16} />}
          </span>
          <span className="af-appsettings-label">
            {isIos() ? "Add to Home Screen" : "Install as app"}
          </span>
        </button>
      )}

      {showIosHelp && (
        <p className="af-appsettings-help">
          Tap <Share size={13} style={{ verticalAlign: "-2px" }} /> Share, then{" "}
          <Plus size={13} style={{ verticalAlign: "-2px" }} /> Add to Home Screen.
        </p>
      )}

      {showNotify && (
        <button
          className="af-appsettings-row"
          onClick={enableNotifications}
          disabled={busy || perm === "denied"}
          type="button"
        >
          <span className="af-appsettings-icon">
            {perm === "denied" ? <BellOff size={16} /> : <Bell size={16} />}
          </span>
          <span className="af-appsettings-label">
            {perm === "denied" ? "Notifications blocked" : busy ? "Asking…" : "Turn on alerts"}
          </span>
        </button>
      )}

      {perm === "denied" && (
        <p className="af-appsettings-help">
          Allow notifications for this site in your browser settings, then reload.
        </p>
      )}

      {installed && perm === "granted" && (
        <p className="af-appsettings-help af-appsettings-help--ok">
          <Check size={13} style={{ verticalAlign: "-2px" }} /> Installed, alerts on
        </p>
      )}
    </div>
  );
}

/** Standalone banner for the dashboard, shown only when nothing is set up yet. */
export function InstallBanner() {
  const [installable, setInstallable] = useState(canInstall());
  const [installed, setInstalled] = useState(isStandalone());
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    try {
      setDismissed(localStorage.getItem("gr_install_dismissed") === "1");
    } catch {
      /* private mode */
    }
    return onInstallAvailabilityChange(setInstallable);
  }, []);

  if (installed || dismissed || (!installable && !isIos())) return null;

  return (
    <div className="af-install-banner">
      <span className="af-install-banner-icon">
        <Smartphone size={18} />
      </span>
      <div className="af-install-banner-copy">
        <p className="af-install-banner-title">Install GoRebalance Admin</p>
        <p className="af-install-banner-body">
          Keep it on your home screen or desktop and get alerts for new assessments.
        </p>
      </div>
      <div className="af-install-banner-actions">
        <button
          type="button"
          className="af-install-banner-cta"
          onClick={() => {
            void promptInstall();
          }}
        >
          Install
        </button>
        <button
          type="button"
          className="af-install-banner-dismiss"
          onClick={() => {
            setDismissed(true);
            try {
              localStorage.setItem("gr_install_dismissed", "1");
            } catch {
              /* private mode */
            }
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}
