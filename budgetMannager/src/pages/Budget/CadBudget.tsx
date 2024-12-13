import { useState } from "react";
import Sidebar from "../../components/ui/sidebar.tsx";



const CadBudget = () => {
	const [value, setValue] = useState<number | string>("");
	const [currency, setCurrency] = useState<string>("");
	const [start, setStart] = useState<string>("");
	const [end, setEnd] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	return (
		<>
			<Sidebar />
		</>
	);
};

export default CadBudget;
