import { useState } from "react";
import Sidebar from "../../components/ui/sidebar.tsx";
import { useNavigate } from "react-router-dom";



const CadBudget = () => {
	const [value, setValue] = useState<number | string>("");
	const [currency, setCurrency] = useState<string>("");
	const [start, setStart] = useState<string>("");
	const [end, setEnd] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const budgetData = {
			value: Number(value),
			currency,
			start,
			end,
		};

		try {
			const response = await fetch("http://localhost:9090/CreateBudget", {
				method: "POST",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(budgetData),
			});

		}
	}
}


return (
	<>
		<Sidebar />
	</>
);
};

export default CadBudget;
