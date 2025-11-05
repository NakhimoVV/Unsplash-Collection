'use client'

import styles from './Search.module.scss'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState, useEffect } from 'react'
import IconSearch from '@/shared/assets/icons/Search.svg'

type SearchProps = {
  placeholder?: string
}

const Search = (props: SearchProps) => {
  const { placeholder } = props
  const labelId = 'search'
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [term, setTerm] = useState<string>(searchParams.get('query') || '')

  // Синхронизируем term с URL параметрами при изменении
  useEffect(() => {
    const queryFromUrl = searchParams.get('query') || ''
    setTerm(queryFromUrl)
  }, [searchParams])

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()

    if (term.trim()) {
      // Редирект на страницу /search с query параметром
      replace(`/search?query=${encodeURIComponent(term.trim())}`)
    } else {
      // Если пустой поиск, убираем query параметр или редиректим на главную
      if (pathname === '/search') {
        replace('/search')
      } else {
        replace('/')
      }
    }
  }

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <label className="visually-hidden" htmlFor={labelId}>
        Search
      </label>
      <input
        className={styles.input}
        type="search"
        id={labelId}
        placeholder={placeholder}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      <button className={styles.button} type="submit">
        <IconSearch width={24} height={24} />
      </button>
    </form>
  )
}

export default Search
