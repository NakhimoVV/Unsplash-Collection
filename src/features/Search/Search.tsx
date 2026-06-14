'use client'

import { FormEvent, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import IconSearch from '@/shared/assets/icons/Search.svg'

import styles from './Search.module.scss'

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

  const handleSearch = (event: FormEvent) => {
    event.preventDefault()

    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('query', term.trim())
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
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
