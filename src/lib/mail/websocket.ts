import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { mailApi } from "./api";
import { DEMO_MAILS } from "./mock-data";

export function useMockWebSocket() {
	const queryClient = useQueryClient();

	useEffect(() => {
		// Simulate a new threat email arriving every 45 seconds
		const interval = setInterval(() => {
			const template =
				DEMO_MAILS[Math.floor(Math.random() * DEMO_MAILS.length)];
			const newMail = {
				...template,
				id: `ws-${Date.now()}`,
				timestamp: Date.now(),
				time: "Just now",
				unread: true,
				subject: `[NEW THREAT] ${template.subject}`,
			};

			mailApi.simulateNewEmail(newMail);

			// Invalidate the query to fetch the new email
			queryClient.invalidateQueries({ queryKey: ["mails"] });
		}, 45000);

		return () => clearInterval(interval);
	}, [queryClient]);
}
