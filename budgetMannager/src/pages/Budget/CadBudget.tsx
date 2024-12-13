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

	}
	}
	return (
		<>
			<Sidebar />
		</>
	);
};

export default CadBudget;
