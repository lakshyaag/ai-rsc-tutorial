"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import type { ChartConfig } from "@/components/ui/chart";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { formatPrice } from "@/lib/format-price";

interface PriceChartData {
	time: number;
	priceUsd: string;
}

const chartConfig = {
	priceUsd: {
		label: "Price",
		color: "text-blue-500",
	},
} satisfies ChartConfig;

export function PriceChart({
	symbol,
	chartData,
}: { symbol: string; chartData: PriceChartData[] }) {
	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<CardTitle>Daily price chart</CardTitle>
					<CardDescription>Symbol: {symbol}</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<ChartContainer
					config={chartConfig}
					className="aspect-auto h-[250px] w-full"
				>
					<LineChart
						accessibilityLayer
						data={chartData}
						margin={{
							left: 12,
							right: 12,
						}}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="time"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={(value) => {
								const date = new Date(value);
								return date.toLocaleDateString("en-US", {
									day: "numeric",
									month: "short",
									year: "numeric",
								});
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									hideLabel
									formatter={(value, name) => (
										<div className="flex min-w-[130px] items-center text-xs text-muted-foreground">
											{chartConfig[name as keyof typeof chartConfig]?.label ||
												name}
											<div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
												{formatPrice(Number(value))}
											</div>
										</div>
									)}
								/>
							}
						/>
						<Line
							dataKey="priceUsd"
							type="monotone"
							strokeWidth={2}
							dot={false}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
