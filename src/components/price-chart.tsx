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

interface PriceChartData {
	time: number;
	priceUsd: number;
}

const chartConfig = {
	views: {
		label: "Price",
	},
	priceUsd: {
		label: "Price",
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
					<CardTitle>Price Chart</CardTitle>
					<CardDescription>{symbol}</CardDescription>
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
								return date.toLocaleTimeString("en-US", {
									hour: "numeric",
									day: "numeric",
									month: "short",
								});
							}}
						/>
						<ChartTooltip
							content={
								<ChartTooltipContent
									className="w-[150px]"
									nameKey="priceUsd"
									labelFormatter={(value) => {
										const date = new Date(value);
										return date.toLocaleTimeString("en-US", {
											hour: "numeric",
											day: "numeric",
											month: "short",
										});
									}}
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
