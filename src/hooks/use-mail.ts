import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mailApi } from "@/lib/mail/api";
import { MailFilters, MailItem } from "@/lib/mail/types";
import { toast } from "sonner";

export function useMails(filters: MailFilters) {
  return useInfiniteQuery({
    queryKey: ["mails", filters],
    queryFn: ({ pageParam = 0 }) => mailApi.getMails(filters, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useMailAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mailId, action, metadata }: { mailId: string; action: string; metadata?: unknown }) => 
      mailApi.performAction(mailId, action, metadata),
    onMutate: async ({ mailId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["mails"] });
      const previousMails = queryClient.getQueriesData({ queryKey: ["mails"] });

      // Optimistically update the cache based on the action
      queryClient.setQueriesData({ queryKey: ["mails"] }, (old: unknown) => {
        if (!old) return old;
        return {
          ...old,
          pages: (old as { pages: any[] }).pages.map((page: any) => ({
            ...page,
            data: page.data.map((mail: MailItem) => {
              if (mail.id === mailId) {
                if (action === "read") return { ...mail, unread: false };
                if (action === "unread") return { ...mail, unread: true };
                if (action === "star") return { ...mail, starred: !mail.starred };
                return mail;
              }
              return mail;
            }).filter((mail: MailItem) => {
              if (mail.id === mailId && ["quarantine", "archive", "trash", "release"].includes(action)) {
                return false;
              }
              return true;
            }),
          })),
        };
      });

      return { previousMails };
    },
    onError: (err, variables, context: unknown) => {
      toast.error(`Action failed: ${err.message}`);
      if ((context as any)?.previousMails) {
        (context as { previousMails: [unknown[], unknown][] }).previousMails.forEach(([queryKey, data]: [unknown[], unknown]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSuccess: (data, variables) => {
      toast.success(data.message);
      // Invalidate so we get the real fresh state, which removes moved items
      if (["quarantine", "archive", "trash", "release"].includes(variables.action)) {
        queryClient.invalidateQueries({ queryKey: ["mails"] });
      }
    },
  });
}
