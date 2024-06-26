import { useState, useEffect } from "react";
import "./ProductModal.css";
import {
	fetchRandomUserData,
	generateRandomRating,
} from "../../Utils/RandomReviews";
import { Link, useParams } from "react-router-dom";
import { faqData } from "../../Data";
import PropTypes from "prop-types";
import ProductDetails from "../../Components/ProductDetails/ProductDetails";
import ReviewsContainer from "../../Components/ReviewsContainer/ReviewsContainer";
import ProductFaq from "../../Components/ProductFaq/ProductFaq";

const ProductModal = ({ products, cartItems, userData }) => {
	const id = useParams().id;

	const [currentImage, setCurrentImage] = useState(0);
	const [activePane, setActivePane] = useState("Product Information");
	const [productReviews, setProductReviews] = useState([]);
	const [adding, setAdding] = useState(false);
	const [added, setAdded] = useState(false);
	const [error, setError] = useState(null);

	const product = products.find((product) => product?._id === id);
	const tags = product?.tags?.[0]?.split(",") || [];

	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const randomUsers = await fetchRandomUserData(
					Math.floor(Math.random() * 500) + 1
				);
				const reviews = randomUsers.map((randomUser, index) => ({
					id: index + 1,
					name: `${randomUser.name.first} ${randomUser.name.last}`,
					date: "Date", // You might want to update this with actual dates
					rating: generateRandomRating(), // Generate a random rating
					review: "Product Review", // You might want to update this with actual reviews
					image: randomUser.picture.large,
					active: true,
				}));
				setProductReviews(reviews);
			} catch (error) {
				console.error("Error fetching reviews:", error);
			}
		};

		fetchReviews();
	}, []);

	const handleActivePaneChange = (pane) => {
		setActivePane(pane);
	};

	// calculate average rating  based on the number of reviews

	const calculateAverageRating = (reviews) => {
		let sum = 0;
		reviews.forEach((review) => {
			sum += review.rating;
		});
		return Math.round(sum / reviews.length);
	};
	const averageRating = calculateAverageRating(productReviews);

	const panes = [
		{
			id: 1,
			title: "Product Information",
			content: (
				<ProductDetails
					product={product}
					tags={tags}
					adding={adding}
					added={added}
					error={error}
					cartItems={cartItems}
					id={id}
					userData={userData}
				/>
			),
		},
		{
			id: 2,
			title: "Reviews",
			content: (
				<ReviewsContainer
					productReviews={productReviews}
					averageRating={averageRating}
					setAdding={setAdding}
					setAdded={setAdded}
					setError={setError}
				/>
			),
		},
		{
			id: 3,
			title: "Others",
			content: (
				<div className="Others">
					<div className="OthersItem">
						<h3>Description</h3>
						<p>{product?.productDescription}</p>
					</div>
					<div className="OthersItem">
						<h3>Usage Instructions</h3>
						<p>{product?.instructions}</p>
					</div>
				</div>
			),
		},
		{
			id: 4,
			title: "FAQs",
			content: (
				<ProductFaq
					faqData={faqData}
					productCategory={product?.productCategory}
				/>
			),
		},
	];

	return (
		<div className="ProductModal">
			<div className="ProductTop">
				<div className="ProductLeft">
					<div className="ProductImages">
						<img
							src={product?.images[currentImage]}
							alt={product?.productName}
						/>
					</div>
					<div className="ImagePreview">
						{product?.images.map((image, index) => (
							<img
								key={index}
								src={image}
								alt={product.productName}
								onClick={() => setCurrentImage(index)}
								className={index === currentImage ? "Active" : ""}
							/>
						))}
					</div>
				</div>
				<div className="ProductRight">
					<div className="ProductNav">
						{panes.map((pane, index) => (
							<div
								className={
									pane.title === activePane
										? "ProductNavItem Active"
										: "ProductNavItem"
								}
								onClick={() => handleActivePaneChange(pane.title)}
								key={index}
							>
								<span>{pane.title}</span>
							</div>
						))}
					</div>
					{panes.map((pane) =>
						pane.title === activePane ? (
							<div key={pane.id}>{pane.content}</div>
						) : null
					)}
				</div>
			</div>
			<div className="ProductBottom">
				<h3>You may also like</h3>
				<div className="ProductBottomContainer">
					{products.map((product, index) => (
						<Link
							to={`/product/${product?._id}`}
							className="ProductCard"
							key={index}
						>
							<div className="ProductCardImage">
								<img src={product?.images[0]} alt={product?.productName} />
							</div>
							<div className="ProductCardDetails">
								<h3>{product?.productName}</h3>
								<p>KES {product?.price}</p>
								<small>{product?.productCategory}</small>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default ProductModal;

// validate props
ProductModal.propTypes = {
	products: PropTypes.array.isRequired,
	cartItems: PropTypes.array.isRequired,
	userData: PropTypes.object.isRequired,
};
