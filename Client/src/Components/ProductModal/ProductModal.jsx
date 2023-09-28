import React from "react";
import "./ProductModal.css";
import { Modal } from "antd";

const ProductModal = ({ isOpen, selectedProduct, onClose, onContentClick }) => {
	const [loading, setLoading] = React.useState(false);
	const [added, setAdded] = React.useState(false);
	const [success, setSuccess] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [selectedPreview, setSelectedPreview] = React.useState(0);

	if (!isOpen) {
		return null;
	}
	console.log(selectedProduct);

	const handleModalContentClick = (event) => {
		event.stopPropagation();
		onContentClick();
	};

	const handleAddToCart = async () => {
		setLoading(true);

		try {
			// Simulate API request delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Add to cart local storage
			const cart = JSON.parse(localStorage.getItem("cart")) || [];
			const product = {
				id: selectedProduct?._id,
				name: selectedProduct?.productName,
				price: selectedProduct?.price,
				image: selectedProduct?.images[0],
				quantity: 1,
			};

			const existingProductIndex = cart.findIndex(
				(item) => item.id === product.id
			);

			if (existingProductIndex !== -1) {
				cart[existingProductIndex].quantity += 1;
			} else {
				cart.push(product);
			}

			localStorage.setItem("cart", JSON.stringify(cart));

			// Show success message
			setLoading(false);
			setAdded(true);
			setSuccess(true);
			setTimeout(() => {
				setAdded(false);
				setSuccess(false);
				onClose();
			}, 2000);
		} catch (error) {
			console.log("Error adding to cart:", error);
			setLoading(false);
			setAdded(true);
			setError(true);
			setTimeout(() => {
				setAdded(false);
				setError(false);
			}, 2000);
		}
	};

	// check if product is in cart
	const isInCart = () => {
		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		const existingProductIndex = cart.findIndex(
			(item) => item.id === selectedProduct.id
		);

		return existingProductIndex !== -1;
	};

	const handlePreviewClick = (index) => {
		setSelectedPreview(index);
	};

	return (
		<div className="Modal" onClick={onClose}>
			<Modal
				open={isOpen}
				onCancel={onClose}
				footer={null}
				width={1000}
				centered
				wrapClassName="ModalWrapper"
			>
				{/* Modal Content */}
				<div className="ModalContent" onClick={handleModalContentClick}>
					<div className="ModalLeft">
						<img
							src={
								selectedProduct?.images[selectedPreview] ||
								selectedProduct?.images[0]
							}
							alt={selectedProduct?.productName}
						/>
						<div className="ImagePreview">
							{selectedProduct.images.map((image, index) => (
								<img
									onClick={() => handlePreviewClick(index)}
									key={index}
									src={image}
									alt={selectedProduct?.productName}
								/>
							))}
						</div>
					</div>
					<div className="ModalRight">
						<h3>
							{selectedProduct?.productName},{selectedProduct?.brandName}
							{selectedProduct?.labels.map((label, index) => (
								<small key={index}>[{label}]</small>
							))}
						</h3>
						<p>
							Price: KSh.
							{selectedProduct?.price
								.toString()
								.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
						</p>
						<p>Stock: {selectedProduct?.stock} Items</p>
						<div className="Desc">
							<p>{selectedProduct?.productDescription}</p>
						</div>
						{added && success && (
							<div
								className="Success"
								style={{
									color: "green",
									border: "2px solid green",
									padding: 5,
									borderRadius: 5,
								}}
							>
								<i className="fas fa-check"></i> Added to cart successfully!
							</div>
						)}
						{added && error && (
							<div className="Error">
								<i className="fas fa-times"></i> Error adding to cart!
							</div>
						)}

						<div className="ProductButtons">
							{isInCart() ? (
								<button className="ProductButton" disabled>
									<>
										<i className="fas fa-check"></i> In Cart
									</>
								</button>
							) : (
								<button className="ProductButton" onClick={handleAddToCart}>
									{loading ? (
										<>
											<i className="fas fa-spinner fa-spin"></i> Adding to Cart
										</>
									) : (
										<>
											Add to Cart <i className="fas fa-shopping-cart"></i>
										</>
									)}
								</button>
							)}

							<button className="ProductButton" disabled={isInCart()}>
								{isInCart() ? (
									<>
										Proceed to Checkout
										<i className="fas fa-arrow-right"></i>
									</>
								) : (
									<>
										Buy Now <i className="fas fa-arrow-right"></i>
									</>
								)}
							</button>
						</div>
						<div className="MoreDetails">
							<h4>More Details</h4>
							<div className="Usage">
								<h5>Usage Instructions</h5>
								<p>{selectedProduct?.instructions}</p>
							</div>
							<div className="Tags">
								<i className="fas fa-tag"></i>
								{selectedProduct?.tags.map((tag, index) => (
									<div key={index}>
										<span>{tag}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ProductModal;
