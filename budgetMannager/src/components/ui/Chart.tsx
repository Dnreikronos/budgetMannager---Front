import { Line, Bar, Pie } from "react-chartjs-2";
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

type ChartProps = {
	type: "line" | "bar" | "pie";
	data: any;
	option?: any;
	title?: string;
};


