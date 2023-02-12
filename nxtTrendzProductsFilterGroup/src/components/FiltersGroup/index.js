import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {
    categoryOptions,
    ratingsList,
    activeCategoryId,
    changeCategory,
    onRatingChange,
    onSearchInputChange,
    onResetFilters,
  } = props

  const onchangeCategory = id => {
    changeCategory(id)
  }

  const ratingChange = ratingId => {
    onRatingChange(ratingId)
  }

  const addSearchInput = event => {
    if (event.key === 'Enter') {
      onSearchInputChange(event.target.value)
    }
  }

  const resetFilters = () => {
    onResetFilters()
  }

  return (
    <div className="filters-group-container">
      <div className="search-title-container">
        <input
          type="search"
          className="search-title-input"
          onKeyDown={addSearchInput}
        />
        <button className="search-button" type="button">
          <BsSearch className="search-icon" />
        </button>
      </div>
      <h1 className="category-heading">Category</h1>
      <ul className="category-list-container">
        {categoryOptions.map(category => {
          const onClickChangeCategory = () => {
            onchangeCategory(category.categoryId)
          }

          const activeCategoryClass =
            activeCategoryId === category.categoryId
              ? 'active-category'
              : 'category-btn'
          console.log(activeCategoryClass)

          return (
            <li key={category.categoryId}>
              <button
                type="button"
                onClick={onClickChangeCategory}
                className={activeCategoryClass}
              >
                <p className="category-text">{category.name}</p>
              </button>
            </li>
          )
        })}
      </ul>
      <p className="category-heading">Rating</p>
      <ul className="ratings-list-container">
        {ratingsList.map(rating => {
          const onClickRatingChange = () => {
            ratingChange(rating.ratingId)
          }
          return (
            <li key={rating.ratingId}>
              <button
                type="button"
                className="rating-btn"
                onClick={onClickRatingChange}
              >
                <img
                  src={rating.imageUrl}
                  alt={`rating ${rating.ratingId}`}
                  className="rating-image"
                />
                & up
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="clear-filters-btn"
        onClick={resetFilters}
      >
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
