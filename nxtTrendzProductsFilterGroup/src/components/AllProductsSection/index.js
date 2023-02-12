import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const statusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],

    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeRatingId: '',
    searchInput: '',
    status: statusConstants.initial,
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      status: statusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategoryId,
      activeRatingId,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchInput}&rating=${activeRatingId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,

        status: statusConstants.success,
      })
    } else {
      this.setState({
        status: statusConstants.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  changeCategory = id => {
    this.setState({activeCategoryId: id}, this.getProducts)
  }

  onRatingChange = ratingId => {
    this.setState({activeRatingId: ratingId}, this.getProducts)
  }

  onSearchInputChange = searchText => {
    this.setState({searchInput: searchText}, this.getProducts)
  }

  onResetFilters = () => {
    this.setState(
      {
        activeOptionId: sortbyOptions[0].optionId,
        activeCategoryId: '',
        activeRatingId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    // TODO: Add No Products View
    return (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We are having some trouble processing your request. Please try again
      </p>
    </div>
  )

  renderNoProductsView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
        alt="no products"
        className="no-products-image"
      />
      <h1 className="failure-heading">No Products Found</h1>
      <p className="failure-para">
        We could not find any products. Try other filters.
      </p>
    </div>
  )

  render() {
    const {activeCategoryId, status, productsList} = this.state
    console.log(activeCategoryId)

    let content
    switch (status) {
      case statusConstants.inProgress:
        content = this.renderLoader()
        break
      case statusConstants.success:
        content =
          productsList.length === 0
            ? this.renderNoProductsView()
            : this.renderProductsList()
        break
      case statusConstants.failure:
        content = this.renderFailureView()
        break
      default:
        content = null
        break
    }

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          changeCategory={this.changeCategory}
          activeCategoryId={activeCategoryId}
          onRatingChange={this.onRatingChange}
          onSearchInputChange={this.onSearchInputChange}
          onResetFilters={this.onResetFilters}
        />

        {content}
      </div>
    )
  }
}

export default AllProductsSection
