import { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button";

interface MediaPermissionsProps {
  onGranted: () => void;
}

type PermissionStep = "intro" | "requesting" | "denied" | "granted";

export function MediaPermissions({ onGranted }: MediaPermissionsProps) {
  const [step, setStep] = useState<PermissionStep>("intro");
  const [error, setError] = useState<string | null>(null);

  const requestPermissions = useCallback(async () => {
    setStep("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      stream.getTracks().forEach((t) => t.stop());
      setStep("granted");
      setTimeout(onGranted, 500);
    } catch (err) {
      setStep("denied");
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Permission denied. Please allow camera and microphone access in your browser settings, then reload."
          : "Could not access camera or microphone. Make sure they are connected and not in use by another app."
      );
    }
  }, [onGranted]);

  return (
    <Dialog.Root open>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-8 shadow-xl focus:outline-none">
          <Dialog.Title className="text-xl font-semibold text-foreground">
            {step === "intro" && "Camera & Microphone Access"}
            {step === "requesting" && "Requesting Access..."}
            {step === "denied" && "Access Required"}
            {step === "granted" && "All Set!"}
          </Dialog.Title>

          <div className="mt-4 space-y-4 text-sm text-muted-foreground">
            {step === "intro" && (
              <>
                <p>
                  Nore Sensei needs access to your camera and microphone to
                  analyze your singing technique in real-time.
                </p>
                <ul className="list-inside list-disc space-y-1">
                  <li>Camera: Posture, jaw opening, and breathing analysis</li>
                  <li>Microphone: Pitch, tone quality, and breath support</li>
                </ul>
                <p className="text-xs">
                  All processing happens locally in your browser. No audio or
                  video is recorded or sent to any server.
                </p>
                <Button onClick={requestPermissions} className="mt-4 w-full">
                  Allow Camera & Microphone
                </Button>
              </>
            )}

            {step === "requesting" && (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Waiting for browser permission prompt...</span>
              </div>
            )}

            {step === "denied" && (
              <>
                <p className="text-destructive">{error}</p>
                <Button onClick={requestPermissions} variant="outline" className="mt-4 w-full">
                  Try Again
                </Button>
              </>
            )}

            {step === "granted" && (
              <p className="text-emerald-600 font-medium">
                Camera and microphone access granted. Let's get started!
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
