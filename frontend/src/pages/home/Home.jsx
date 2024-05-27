import Nav from "../../components/navbar/Nav";
import Footer from "../../components/Footer/Footer";
import Hero from "../../components/Hero/Hero";
import Categories from "../../components/Categories/Categories";
import Reviews from "../Reviews/Reviews";
import AboutUs from "../AboutUs/AboutUs";

const Home = () => {
	return (
		<div>
			<Nav />
			<Hero />
			<br />
			<Categories />
			
			<br />
			<AboutUs />
			<br />
			<Reviews />
			<br /><br />
			<Footer />
		</div>
	);
};
export default Home;
