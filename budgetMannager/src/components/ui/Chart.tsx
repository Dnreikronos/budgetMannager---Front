import React from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Tooltip,
	Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

interface ChartProps {
	type: "line" | "bar" | "pie";
	data: any;
	options?: any;
	title?: string;
}

const Chart: React.FC<ChartProps> = ({ type, data, options, title }) => {
	const ChartComponent = type === "line" ? Line : type === "bar" ? Bar : Pie;

	const cardVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { 
			opacity: 1, 
			y: 0,
			transition: {
				duration: 0.6,
				ease: "easeOut"
			}
		}
	};

	const chartVariants = {
		hidden: { scale: 0.8, opacity: 0 },
		visible: { 
			scale: 1, 
			opacity: 1,
			transition: {
				delay: 0.2,
				duration: 0.5,
				ease: "easeOut"
			}
		}
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={cardVariants}
		>
			<Card className="hover:shadow-lg transition-shadow duration-300">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold">{title || "Chart"}</CardTitle>
				</CardHeader>
				<CardContent className="p-6">
					<motion.div
						variants={chartVariants}
						className="w-full h-full min-h-[300px] flex items-center justify-center"
					>
						<ChartComponent 
							data={data} 
							options={{
								responsive: true,
								maintainAspectRatio: false,
								plugins: {
									legend: {
										position: "bottom" as const,
										labels: {
											padding: 20,
											usePointStyle: true,
											pointStyle: "circle",
										},
									},
								},
								...options,
							}} 
						/>
					</motion.div>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default Chart;

