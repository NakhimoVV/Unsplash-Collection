'use client'

import styles from './Search.module.scss'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type SearchProps = {
  placeholder?: string
}

const Search = (props: SearchProps) => {
  const { placeholder } = props
  const labelId = 'search'
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleSearch(term: string) {
    console.log('TERM: ', term)
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }

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
        onChange={(event) => {
          handleSearch(event.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
    </div>
  )
}

export default Search
