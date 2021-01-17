import React from "react";
import "./Filter.styles.css";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import filter from "./assets/filter.png";
export default class Filter extends React.Component {
	constructor() {
		super();
		this.state = {
			value: 3,
			type: [],
			minPrice: 0,
			maxPrice: 0,
			maxLimit: 0,
			minLimit: 0,
			loading: true,
		};
	}

	componentDidMount() {
		this.setState({
			minPrice: this.props.min,
			maxPrice: this.props.max,
			minLimit: this.props.min,
			maxLimit: this.props.max,
			loading: false,
		});
	}

	handleSlider = (value) => {
		this.setState(
			{
				value,
			},
			() => {
				this.props.handleMonths(value);
			}
		);
	};

	handleRange = (e) => {
		if (e[0] !== e[1]) {
			this.setState(
				{
					minPrice: e[0],
					maxPrice: e[1],
				},
				() => {
					this.props.handleRentRange(e[0], e[1]);
				}
			);
		}
	};
	render() {
		const marks = {
			3: (
				<div className='sliderLabel'>
					<div className='indicator'></div>
					{this.state.value !== 3 ? <p>3</p> : <p className='active'>3</p>}
				</div>
			),
			6: (
				<div className='sliderLabel'>
					<div className='indicator'></div>
					{this.state.value !== 6 ? <p>6</p> : <p className='active'>6</p>}
				</div>
			),
			9: (
				<div className='sliderLabel'>
					<div className='indicator'></div>
					{this.state.value !== 9 ? <p>9</p> : <p className='active'>9</p>}
				</div>
			),
			12: (
				<div className='sliderLabel'>
					<div className='indicator'></div>
					{this.state.value !== 12 ? <p>12</p> : <p className='active'>12</p>}
				</div>
			),
		};

		const price = {
			[this.state.minLimit]: (
				<div className='sliderLabel'>
					<div className='indicator'></div>
					<p>{this.state.minLimit}</p>
				</div>
			),
			[this.state.maxLimit]: (
				<div className='sliderLabel'>
					<div className='indicator'></div>
					<p>{this.state.maxLimit}</p>
				</div>
			),
		};
		return (
			<div className='filter-container'>
				<div className='filter-header'>
					<div className='left'>
						<div className='filter'>
							<img src={filter} alt='filter-logo' />
							<p>Filters</p>
						</div>
						<div className='filter-inPhone' onClick={this.handleShowFilter}>
							<img src={filter} alt='filter-logo' />
							<p>Filter</p>
						</div>
					</div>

					{/* Tags */}
					<div className='right'>
						<div className='reset'>
							<button onClick={this.props.handleReset}>Reset</button>
						</div>
					</div>
				</div>

				<div className='avail'>
					<h1>SORT BY</h1>
					<div onClick={() => this.props.handleSort("Relevance")} className='category'>
						{this.props.sortType === "Relevance" ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
						<p>RELEVANCE</p>
					</div>
					<div onClick={() => this.props.handleSort("lth")} className='category'>
						{this.props.sortType === "lth" ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
						<p>PRICE-LOW TO HIGH</p>
					</div>
					<div onClick={() => this.props.handleSort("htl")} className='category'>
						{this.props.sortType === "htl" ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
						<p>PRICE-HIGH TO LOW</p>
					</div>
				</div>
				<div className='avail'>
					<h1>CATEGORIES</h1>
					<div onClick={() => this.props.handleCategory("All")} className='category'>
						{this.props.category === "All" ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
						<p>All</p>
					</div>
					{this.props.categories.map((category, index) => {
						return (
							<div onClick={() => this.props.handleCategory(category)} className='category'>
								{this.props.category.name && category.name.toLowerCase() === this.props.category.name.toLowerCase() ? (
									<i className='fas fa-check-square'></i>
								) : (
									<div className='uncheck'></div>
								)}
								<p>{category.name}</p>
							</div>
						);
					})}
				</div>

				{this.props.category.name && this.props.category.subcategories ? (
					<div className='cat'>
						<h1>SUB-CATEGORIES</h1>
						<div onClick={() => this.props.handleSubCategory("All")} className='category'>
							{this.props.subcategory === "All" ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
							<p>All</p>
						</div>
						{this.props.category.name &&
							this.props.category.subcategories.map((sub, index) => {
								return (
									<div onClick={() => this.props.handleSubCategory(sub)} className='category'>
										{this.props.subcategory.name && sub.name.toLowerCase() === this.props.subcategory.name.toLowerCase() ? (
											<i className='fas fa-check-square'></i>
										) : (
											<div className='uncheck'></div>
										)}
										<p>{sub.name}</p>
									</div>
								);
							})}
					</div>
				) : null}

				<div className='price'>
					<h1>PRICE RANGE</h1>
					<p>
						&#8377;{this.state.minPrice} - &#8377;{this.state.maxPrice}
					</p>
					<div className='slider'>
						<Range
							marks={price}
							allowCross={false}
							value={[this.props.min, this.props.max]}
							step={50}
							min={this.state.minLimit}
							max={this.state.maxLimit}
							onChange={(e) => this.handleRange(e)}
						/>
					</div>
				</div>

				{this.props.colors.length > 0 ? (
					<div className='colors'>
						<h1>Colors</h1>
						<div onClick={() => this.props.handleColorFilter("All")} className='colorCheck'>
							{this.props.presentColor === "All" ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
							<p>All</p>
						</div>
						{this.props.colors.map((color, index) => {
							return (
								<div key={index} onClick={() => this.props.handleColorFilter(color)}>
									<div className='colorCheck'>
										{color.toLowerCase() === this.props.presentColor.toLowerCase() ? <i className='fas fa-check-square'></i> : <div className='uncheck'></div>}
										<p style={{ textTransform: "capitalize" }}>{color}</p>
									</div>
								</div>
							);
						})}
					</div>
				) : null}

				<div className='avail'>
					<h1>AVAILABILITY</h1>
					<div className='category' onClick={this.props.handleProductOutStock}>
						{this.props.outStock ? <i class='fas fa-check-square'></i> : <div className='uncheck'></div>}
						<p>Out of Stock</p>
					</div>
				</div>
			</div>
		);
	}
}
