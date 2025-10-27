import styles from './SearchForm.module.scss'

type SearchFormProps = {}

const SearchForm = (props: SearchFormProps) => {
  const {} = props

  return (
    <form className={styles.searchForm}>
      Field
      {/*<Field*/}
      {/*  className="search-form__field"*/}
      {/*  type="search"*/}
      {/*  label="Search"*/}
      {/*  isLabelHidden*/}
      {/*  placeholder="Введите название товара"*/}
      {/*  inputMode="search"*/}
      {/*/>*/}
      {/*<Button*/}
      {/*  className="search-form__button"*/}
      {/*  type="submit"*/}
      {/*  label="Поиск товара"*/}
      {/*  isLabelHidden*/}
      {/*  iconName="search"*/}
      {/*  mode={ButtonMode.RIGHT_ROUND}*/}
      {/*/>*/}
    </form>
  )
}

export default SearchForm
