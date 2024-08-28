import {
	Card,
	CardContent,
	CardTitle,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
interface PriceProps {
	symbol: string;
	price: number;
	volume: number;
	updated?: Date;
}

export function PriceCard({ symbol, price, volume, updated }: PriceProps) {
	return (
		<Card className="text-center">
			<CardHeader className="flex flex-col items-center justify-center pb-2">
				<CardTitle className="text-lg font-medium">{symbol}</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col items-center space-y-2">
				<div className="text-xl font-bold">Price: {formatPrice(price)}</div>
				<div className="text-md">24h volume: {formatPrice(volume)}</div>
			</CardContent>
			{updated && (
				<CardFooter className="text-xs flex items-center justify-center">
					<CalendarIcon className="w-4 h-4 mr-1" />
					Last updated: {updated.toLocaleString()}
				</CardFooter>
			)}
		</Card>
	);
}
