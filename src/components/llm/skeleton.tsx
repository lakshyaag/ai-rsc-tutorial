import {
	Card,
	CardHeader,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PriceCardSkeleton() {
	return (
		<Card className="text-center">
			<CardHeader className="flex flex-col items-center justify-center pb-2">
				<Skeleton className="h-6 w-24" />
			</CardHeader>
			<CardContent className="flex flex-col items-center space-y-2">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-5 w-28" />
			</CardContent>
			<CardFooter className="text-xs flex items-center justify-center">
				<Skeleton className="h-4 w-40" />
			</CardFooter>
		</Card>
	);
}

export function PriceChartSkeleton() {
	return (
		<Card>
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
					<Skeleton className="h-6 w-40" />
					<Skeleton className="h-4 w-32" />
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<Skeleton className="h-[250px] w-full" />
			</CardContent>
		</Card>
	);
}
