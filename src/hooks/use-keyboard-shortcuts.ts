import { useEffect, useMemo } from "react";
import { useMailStore } from "@/stores/mail-store";
import { useMails, useMailAction } from "@/hooks/use-mail";

export function useKeyboardShortcuts() {
  const filters = useMailStore((s) => s.filters);
  const selectedMailId = useMailStore((s) => s.selectedMailId);
  const setSelectedMailId = useMailStore((s) => s.setSelectedMailId);
  
  const { data } = useMails(filters);
  const actionMutation = useMailAction();

  const allMails = useMemo(() => data ? data.pages.flatMap((d) => d.data) : [], [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      if (!selectedMailId || allMails.length === 0) return;

      const currentIndex = allMails.findIndex((m) => m.id === selectedMailId);

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          if (currentIndex < allMails.length - 1) {
            setSelectedMailId(allMails[currentIndex + 1].id);
          }
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          if (currentIndex > 0) {
            setSelectedMailId(allMails[currentIndex - 1].id);
          }
          break;
        case "e":
          e.preventDefault();
          actionMutation.mutate({ mailId: selectedMailId, action: "archive" });
          if (currentIndex < allMails.length - 1) setSelectedMailId(allMails[currentIndex + 1].id);
          else if (currentIndex > 0) setSelectedMailId(allMails[currentIndex - 1].id);
          break;
        case "q":
          e.preventDefault();
          actionMutation.mutate({ mailId: selectedMailId, action: "quarantine" });
          if (currentIndex < allMails.length - 1) setSelectedMailId(allMails[currentIndex + 1].id);
          else if (currentIndex > 0) setSelectedMailId(allMails[currentIndex - 1].id);
          break;
        case "Delete":
        case "Backspace":
        case "#":
          e.preventDefault();
          actionMutation.mutate({ mailId: selectedMailId, action: "trash" });
          if (currentIndex < allMails.length - 1) setSelectedMailId(allMails[currentIndex + 1].id);
          else if (currentIndex > 0) setSelectedMailId(allMails[currentIndex - 1].id);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allMails, selectedMailId, setSelectedMailId, actionMutation]);
}
