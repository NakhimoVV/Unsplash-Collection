import styles from './SearchForm.module.scss'

type SearchFormProps = {
  placeholder?: string
}

const SearchForm = (props: SearchFormProps) => {
  const { placeholder } = props
  const labelId = 'search'

  return (
    <div className={styles.searchForm}>
      <label className="visually-hidden" htmlFor={labelId}>
        Search
      </label>
      <input
        className={styles.input}
        type="search"
        id={labelId}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchForm
