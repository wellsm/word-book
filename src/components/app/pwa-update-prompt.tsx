import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SECONDS = 1000;
const MINUTES = SECONDS * 60;
const UPDATE_CHECK_INTERVAL_MS = MINUTES * 60; // 1 hour

export function PWAUpdatePrompt() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        setRegistration(reg);

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setShowUpdatePrompt(true);
              }
            });
          }
        });

        const intervalId = setInterval(() => {
          reg.update();
        }, UPDATE_CHECK_INTERVAL_MS);

        return () => {
          clearInterval(intervalId);
        };
      }
      return;
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    } else {
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setShowUpdatePrompt(false);
    sessionStorage.setItem("pwa-update-dismissed", "true");
  };

  if (!showUpdatePrompt || sessionStorage.getItem("pwa-update-dismissed")) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-20 left-4 z-50 md:right-4 md:left-auto md:w-80">
      <Card className="border-orange-200 bg-orange-50 shadow-lg dark:border-orange-800 dark:bg-orange-950">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                Update Available
              </h3>
              <p className="mt-1 text-orange-700 text-sm leading-relaxed dark:text-orange-200">
                A new version of Word Book is ready. Refresh to get the latest
                features and improvements.
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  className="h-8 bg-orange-600 px-3 py-1 text-white hover:bg-orange-700"
                  onClick={handleUpdate}
                  size="lg"
                >
                  Update Now
                </Button>
                <Button
                  className="h-8 px-3 py-1 text-orange-700 hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-orange-900"
                  onClick={handleDismiss}
                  size="lg"
                  variant="ghost"
                >
                  Later
                </Button>
              </div>
            </div>

            <Button
              className="absolute top-3 right-3 h-6 w-6 flex-shrink-0 p-1 text-orange-700 hover:bg-orange-100 dark:text-orange-200 dark:hover:bg-orange-900"
              onClick={handleDismiss}
              variant="ghost"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
