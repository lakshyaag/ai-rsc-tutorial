"use server";

import { z } from "zod";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import type { ReactNode } from "react";
import type { CoreMessage, ToolInvocation } from "ai";
import { BotCard, BotMessage } from "@/components/llm/message";
import { openai } from "@ai-sdk/openai";
import { Loader2 } from "lucide-react";

// system-message
const content = `\
You are a crypto bot and you can help users get the prices of cryptocurrencies.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of BTC = 69000]" means that the interface of the cryptocurrency price of BTC is shown to the user.

If the user wants the price, call \`get_crypto_price\` to show the price.
If the user wants the market cap or other stats of a given cryptocurrency, call \`get_crypto_stats\` to show the stats.
If the user wants a stock price, it is an impossible task, so you should respond that you are a demo and cannot do that.
If the user wants to do anything else, it is an impossible task, so you should respond that you are a demo and cannot do that.

Besides getting prices of cryptocurrencies, you can also chat with users.
`;

export const sendMessages = async (
	message: string,
): Promise<{
	id: number;
	role: "human" | "assistant";
	display: ReactNode;
}> => {
	const history = getMutableAIState<typeof AI>();

	history.update([
		...history.get(),
		{
			role: "human",
			content: message,
		},
	]);

	const reply = await streamUI({
		model: openai("gpt-4o-mini"),
		messages: [
			{
				role: "system",
				content,
				toolInvocations: [],
			},
			...history.get(),
		] as CoreMessage[],

		initial: (
			<BotMessage className="items-center flex shrink-0 select-none justify-center">
				<Loader2 className="animate-spin w-5 stroke-zinc-900" />
			</BotMessage>
		),
		text: ({ content, done }) => {
			if (done) {
				history.update([
					...history.get(),
					{
						role: "assistant",
						content,
					},
				]);
			}

			return <BotMessage>{content}</BotMessage>;
		},
		temperature: 0,
		tools: {
			get_crypto_price: {
				description: "Get the current price of a cryptocurrency",
				parameters: z.object({
					symbol: z
						.string()
						.describe(
							"The symbol of the cryptocurrency. For example, BTC/ETH/SOL",
						),
				}),
				generate: async function* ({ symbol }: { symbol: string }) {
					yield <BotCard>Loading...</BotCard>;
					return null;
				},
			},
			get_crypto_stats: {
				description: "Get the market stats of a cryptocurrency",
				parameters: z.object({
					slug: z
						.string()
						.describe(
							"The name of the cryptocurrency in lowercase. For example, bitcoin/ethereum/solana",
						),
				}),
			},
		},
	});

	return {
		id: Date.now(),
		role: "assistant",
		display: reply.value,
	};
};

export type AIState = Array<{
	id?: "number";
	name?: "get_crypto_price" | "get_crypto_stats";
	role: "human" | "assistant" | "system";
	content: string;
}>;

export type UIState = Array<{
	id?: number;
	role: "human" | "assistant";
	display: ReactNode;
	toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
	initialAIState: [] as AIState,
	initialUIState: [] as UIState,
	actions: { sendMessages },
});
