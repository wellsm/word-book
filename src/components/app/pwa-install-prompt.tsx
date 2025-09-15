import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Constants
const INSTALL_PROMPT_DELAY_MS = 3000;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface ExtendedNavigator extends Navigator {
  standalone?: boolean;
}

export function PWAInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isInWebAppiOS =
      (window.navigator as ExtendedNavigator).standalone === true;

    if (isStandalone || isInWebAppiOS) {
      setIsInstalled(true);
      return;
    }

    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setInstallPromptEvent(e as BeforeInstallPromptEvent);

      // Show install prompt after a delay (better UX)
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, INSTALL_PROMPT_DELAY_MS);
    };

    // Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setInstallPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }

    try {
      // Show the install prompt
      await installPromptEvent.prompt();

      // Wait for the user to respond to the prompt
      await installPromptEvent.userChoice;

      // Hide the install prompt regardless of outcome
      setShowInstallPrompt(false);
      setInstallPromptEvent(null);
    } catch {
      // Ignore errors silently in production
      setShowInstallPrompt(false);
      setInstallPromptEvent(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Remember user's choice for this session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Don't show if already installed or user dismissed this session
  if (isInstalled || !installPromptEvent || !showInstallPrompt) {
    return null;
  }

  // Check if user already dismissed this session
  if (sessionStorage.getItem("pwa-install-dismissed")) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-20 left-4 z-50 md:right-4 md:left-auto md:w-80">
      <Card className="border-primary/20 bg-background/95 shadow-lg backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                Install Word Book
              </h3>
              <p className="mt-1 text-muted-foreground text-sm leading-relaxed">
                Add to your home screen for quick access and offline use
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  className="h-8 px-3 py-1"
                  onClick={handleInstallClick}
                  size="lg"
                >
                  Install
                </Button>
                <Button
                  className="h-8 px-3 py-1"
                  onClick={handleDismiss}
                  size="lg"
                  variant="ghost"
                >
                  Not now
                </Button>
              </div>
            </div>

            <Button
              className="absolute top-3 right-3 h-6 w-6 flex-shrink-0 p-1"
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
