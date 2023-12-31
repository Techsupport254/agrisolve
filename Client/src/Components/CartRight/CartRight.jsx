import React, { useState } from "react";
import "./CartRight.css";
import { cartData } from "../../Data";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Info from "../Info/Info";
import Pay from "../Pay/Pay";
import Payment from "../Payment/Payment";

const steps = ["Payment and Delivery Methods", "Fill Information", "Payment"];

const Cart = () => {
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState({});
	const [cartItems, setCartItems] = useState(
		cartData.map((item) => ({ ...item, quantity: item.quantity || 1 }))
	);

	const handleIncreaseQuantity = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
			)
		);
	};

	const handleDecreaseQuantity = (itemId) => {
		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId && item.quantity > 1
					? { ...item, quantity: item.quantity - 1 }
					: item
			)
		);
	};

	const handleRemoveItem = (itemId) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
	};

	const totalPrice = cartItems.reduce(
		(acc, item) => acc + item.price * item.quantity,
		0
	);

	const totalSteps = () => {
		return steps.length;
	};

	const isLastStep = () => {
		return activeStep === totalSteps() - 1;
	};

	const handleNext = () => {
		if (activeStep === 0) {
			// Save the chosen details to local storage from Info component
			const paymentMethod = localStorage.getItem("paymentMethod");
			const deliveryMethod = localStorage.getItem("deliveryMethod");

			// You can perform validation or further processing here if needed
			console.log("Payment Method:", paymentMethod);
			console.log("Delivery Method:", deliveryMethod);
		}

		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
		setCompleted({});
	};

	const handleComplete = () => {
		setCompleted((prevCompleted) => ({ ...prevCompleted, [activeStep]: true }));
		handleNext();
	};

	const renderStepContent = () => {
		switch (activeStep) {
			case 0:
				return <Info handleNext={handleNext} />;
			case 1:
				return (
					<Payment
						handleNext={handleNext}
						handleBack={handleBack}
						paymentMethod={localStorage.getItem("paymentMethod")}
						deliveryMethod={localStorage.getItem("deliveryMethod")}
					/>
				);
			case 2:
				return (
					<Pay
						handleNext={handleNext}
						handleBack={handleBack}
						paymentMethod={localStorage.getItem("paymentMethod")}
						deliveryMethod={localStorage.getItem("deliveryMethod")}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<div className="RightCart">
			<Box sx={{ width: "100%", backgroundColor: "#f9f9f9", padding: "20px" }}>
				<Stepper
					linear
					activeStep={activeStep}
					sx={{ backgroundColor: "transparent" }}
				>
					{steps.map((label, index) => (
						<Step key={label}>
							<StepButton
								color="primary"
								onClick={() => setActiveStep(index)}
								completed={completed[index]}
							></StepButton>
						</Step>
					))}
				</Stepper>
				<div>
					{activeStep === steps.length ? (
						<React.Fragment>
							<Typography sx={{ mt: 2, mb: 1 }}>
								Order placed successfully!
							</Typography>
							<Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
								<Box sx={{ flex: "1 1 auto" }} />
								<Button variant="contained" onClick={handleReset}>
									<i className="fas fa-download"></i>
									Receipt
								</Button>
							</Box>
						</React.Fragment>
					) : (
						<React.Fragment>
							<Typography sx={{ mt: 2, mb: 0.5, py: 0.5 }}>
								{steps[activeStep]}
							</Typography>
							{renderStepContent()}
							<Box
								sx={{ display: "flex", flexDirection: "row", pt: 2 }}
								hidden={activeStep === 3 ? true : false}
							>
								<Button
									variant="outlined"
									color="primary"
									disabled={activeStep === 0}
									onClick={handleBack}
									sx={{ mr: 1 }}
								>
									Back
								</Button>
								<Box sx={{ flex: "1 1 auto" }} />
								<Button variant="contained" onClick={handleNext} sx={{ mr: 1 }}>
									{isLastStep() ? "Finish" : "Next"}
								</Button>
							</Box>
						</React.Fragment>
					)}
				</div>
			</Box>
		</div>
	);
};

export default Cart;
