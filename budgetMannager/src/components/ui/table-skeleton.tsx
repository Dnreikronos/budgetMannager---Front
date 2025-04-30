import React from "react";
import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
	return (
		<div className="w-full space-y-4">
			<div className="flex gap-4 mb-6">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={`header-${i}`} className="h-8 flex-1" />
				))}
			</div>

			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={`row-${rowIndex}`} className="flex gap-4">
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton
							key={`cell-${rowIndex}-${colIndex}`}
							className="h-12 flex-1"
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default TableSkeleton;
