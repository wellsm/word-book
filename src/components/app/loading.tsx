import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type LoadingProps = {
  millisecondsToShow?: number;
};

export function Loading({ millisecondsToShow = 300 }: LoadingProps) {
  const [shouldShow, setShouldShow] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldShow(true);
    }, millisecondsToShow);

    return () => clearTimeout(timer);
  }, [millisecondsToShow]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center pb-24">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
