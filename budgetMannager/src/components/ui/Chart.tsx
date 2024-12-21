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
	options?: any;
	title?: string;
};

const Chart: React.FC<ChartProps> = ({ type, data, options, title }) => {
  const ChartComponent = type === "line" ? Line : type === "bar" ? Bar : Pie;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Chart"}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartComponent data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default Chart;

