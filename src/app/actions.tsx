"use server";

import { z } from "zod";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import type { ReactNode } from "react";
import type { CoreMessage, ToolInvocation } from "ai";
import { BotCard, BotMessage } from "@/components/llm/message";
import { openai } from "@ai-sdk/openai";
import { Loader2 } from "lucide-react";
import { sleep } from "@/lib/utils";
import { PriceCard } from "@/components/price-card";
import { PriceChart } from "@/components/price-chart";

// system-message
const content = `\
You are a crypto bot and you can help users get the prices of cryptocurrencies.

Messages inside [] means that it's a UI element or a user event. For example:
- "[Price of BTC = 69000]" means that the interface of the cryptocurrency price of BTC is shown to the user.

If the user wants the last price, call \`get_crypto_price\` to show the price.
If the user wants the history of price for cryptocurrency, call \`get_crypto_chart\` to show the chart.

If the user wants a stock price, it is an impossible task, so you should respond that you are a demo and cannot do that.
If the user wants to do anything else, it is an impossible task, so you should respond that you are a demo and cannot do that.

Besides getting prices of cryptocurrencies, you can also chat with users.
`;

export async function sendMessages(message: string): Promise<{
	id: number;
	role: "user" | "assistant";
	display: ReactNode;
}> {
	const history = getMutableAIState<typeof AI>();

	history.update([
		...history.get(),
		{
			role: "user",
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
				history.done([
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
					console.log({ symbol });
					yield <BotCard>Loading...</BotCard>;

					const params = new URLSearchParams({
						baseSymbol: symbol,
						quoteSymbol: "USDT",
					});

					const stats = await (
						await fetch(
							`https://api.coincap.io/v2/markets?${params.toString()}`,
						)
					).json();

					const lastPrice = Number(stats.data[0].priceQuote);
					const vol24Hr = Number(stats.data[0].volumeUsd24Hr);
					const updated = new Date(stats.data[0].updated);

					await sleep(1000);

					history.done([
						...history.get(),
						{
							role: "assistant",
							name: "get_crypto_price",
							content: `[Price of ${symbol} = ${lastPrice}]`,
						},
					]);

					return (
						<BotCard>
							<PriceCard
								symbol={symbol}
								price={lastPrice}
								volume={vol24Hr}
								updated={updated}
							/>
						</BotCard>
					);
				},
			},
			get_crypto_chart: {
				description: "Get the historical price of a cryptocurrency",
				parameters: z.object({
					slug: z
						.string()
						.describe(
							"The name of the cryptocurrency in lowercase. For example, bitcoin/ethereum/solana",
						),
				}),

				generate: async function* ({ slug }: { slug: string }) {
					console.log({ slug });
					yield <BotCard>Loading...</BotCard>;

					const params = new URLSearchParams({
						interval: "h1",
					});

					const stats = await (
						await fetch(
							`https://api.coincap.io/v2/assets/${slug}/history?${params.toString()}`,
						)
					).json();

					console.log(stats);

					await sleep(1000);

					history.done([
						...history.get(),
						{
							role: "assistant",
							name: "get_crypto_chart",
							content: `[Chart data of ${slug}]`,
						},
					]);

					return (
						<BotCard>
							<PriceChart symbol={slug} chartData={stats.data} />
						</BotCard>
					);
				},
			},
		},
	});

	return {
		id: Date.now(),
		role: "assistant",
		display: reply.value,
	};
}

export type AIState = Array<{
	id?: "number";
	name?: "get_crypto_price" | "get_crypto_chart";
	role: "user" | "assistant" | "system";
	content: string;
}>;

export type UIState = Array<{
	id?: number;
	role: "user" | "assistant";
	display: ReactNode;
	toolInvocations?: ToolInvocation[];
}>;

export const AI = createAI({
	initialAIState: [] as AIState,
	initialUIState: [] as UIState,
	actions: { sendMessages },
});
