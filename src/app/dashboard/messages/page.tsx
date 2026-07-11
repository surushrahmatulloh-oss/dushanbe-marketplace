import { Suspense } from "react";
import MessagesPage from "./messages-client";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Бор мешавад...</p>}>
      <MessagesPage />
    </Suspense>
  );
}
