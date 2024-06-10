import { createContext, useState, useEffect } from "react";
import axios from "axios";

const ApiContext = createContext();

const ApiProvider = ({ children }) => {
	const [userData, setUserData] = useState(null);
	const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [token, setToken] = useState("");
	const [paymentData, setPaymentData] = useState(null);
	const [isPaymentDataLoaded, setIsPaymentDataLoaded] = useState(false);
	const [shippingData, setShippingData] = useState(null);
	const [isShippingDataLoaded, setIsShippingDataLoaded] = useState(false);
	const [products, setProducts] = useState([]);
	const [events, setEvents] = useState([]);
	const [pendingOrders, setPendingOrders] = useState([]);
	const [cartItems, setCartItems] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			const user = JSON.parse(localStorage.getItem("agrisolveData"));
			if (user) {
				setUserData(user);
				setToken(user.token);

				try {
					const response = await axios.get(
						`http://localhost:8000/auth/user/${user?.email}`,
						{
							headers: {
								"x-auth-token": user.token,
							},
						}
					);

					setUserData(response.data);

					if (response.data.loginStatus === "loggedIn") {
						setIsLoggedIn(true);
					}
				} catch (err) {
					console.log(err);
				}
			}

			setIsUserDataLoaded(true);
		};

		fetchUserData();
	}, []);

	useEffect(() => {
		const fetchPaymentData = async () => {
			const paymentData = JSON.parse(localStorage.getItem("selectedAccount"));
			if (paymentData) {
				setPaymentData(paymentData);
			}

			setIsPaymentDataLoaded(true);
		};

		fetchPaymentData();
	}, []);

	useEffect(() => {
		const fetchShippingData = async () => {
			const shippingData = JSON.parse(localStorage.getItem("selectedLocation"));
			if (shippingData) {
				setShippingData(shippingData);
			}

			setIsShippingDataLoaded(true);
		};

		fetchShippingData();
	}, []);

	useEffect(() => {
		const fetchEvents = async () => {
			try {
				const response = await axios.get("https://agrisolve.vercel.app/news");
				const filteredEvents = response.data.filter(
					(event) => event.event === "true"
				);
				setEvents(filteredEvents);
			} catch (err) {
				console.log(err);
			}
		};

		fetchEvents();
	}, []);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get("http://localhost:8000/products");
				const filteredProducts = response.data.filter(
					(product) => product.productStatus !== "Draft"
				);
				setProducts(filteredProducts);
			} catch (err) {
				console.log(err);
			}
		};

		fetchProducts();
	}, []);


	useEffect(() => {
		if (userData?.id) {
			fetchCartItems(userData?.id);
			fetchOrders(userData?.id);
		}
	}, [userData]);

	const handleLogout = async () => {
		try {
			if (userData) {
				await axios.patch(
					`http://localhost:8000/auth/user/${userData?.email}`,
					{
						isRemember: false,
						loginStatus: "loggedOut",
						token: "",
						lastLogin: new Date(),
					},
					{
						headers: {
							"x-auth-token": userData?.token,
						},
					}
				);

				setUserData(null);
				setIsLoggedIn(false);

				localStorage.removeItem("agrisolveData");

				window.location.replace("/");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogin = async (data) => {
		localStorage.setItem("agrisolveData", JSON.stringify(data));
		setUserData(data);
		setToken(data.token);
		setIsLoggedIn(true);
	};

	const fetchCartItems = async (userId) => {
		try {
			const response = await axios.get(`http://localhost:8000/cart/${userId}`);
			if (response.data) {
				const cartItems = response.data.products;
				if (cartItems) {
					setCartItems(cartItems);
				}
			}
		} catch (error) {
			console.error("Error fetching cart items:", error);
		}
	};

	const fetchOrders = async (userId) => {
		try {
			const response = await axios.get(`http://localhost:8000/order/${userId}`);
			setPendingOrders(response.data);
		} catch (error) {
			console.error("Error fetching orders:", error);
		}
	};

	return (
		<ApiContext.Provider
			value={{
				userData,
				isUserDataLoaded,
				isLoggedIn,
				token,
				paymentData,
				isPaymentDataLoaded,
				shippingData,
				isShippingDataLoaded,
				products,
				events,
				pendingOrders,
				cartItems,
				handleLogin,
				handleLogout,
				fetchCartItems,
				fetchOrders,
			}}
		>
			{children}
		</ApiContext.Provider>
	);
};

export { ApiProvider, ApiContext };