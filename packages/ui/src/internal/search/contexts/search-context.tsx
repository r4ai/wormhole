import {
  type Accessor,
  type Component,
  type JSX,
  type Setter,
  createContext,
  createSignal,
  useContext,
} from "solid-js"

export type SearchContext = {
  query: Accessor<string>
  setQuery: Setter<string>
  resultRefs: Accessor<(HTMLButtonElement | undefined)[]>
  setResultRefs: Setter<(HTMLButtonElement | undefined)[]>
  setResultRefAt: (index: number) => (el: HTMLButtonElement) => void
  activeIndex: Accessor<number>
  setActiveIndex: Setter<number>
  incrementActiveIndex: () => void
  decrementActiveIndex: () => void
}

export const SearchContext = createContext<SearchContext | undefined>(undefined)

export type SearchProviderProps = {
  children: JSX.Element
}

export const SearchProvider: Component<SearchProviderProps> = (props) => {
  const [query, setQuery] = createSignal("")
  const [resultRefs, setResultRefs] = createSignal<
    (HTMLButtonElement | undefined)[]
  >([])
  const [activeIndex, setActiveIndex] = createSignal(0)

  const incrementActiveIndex = () =>
    setActiveIndex((index) =>
      Math.max(Math.min(index + 1, resultRefs().length - 1), 0),
    )
  const decrementActiveIndex = () =>
    setActiveIndex((index) => Math.max(index - 1, 0))

  const setResultRefAt = (index: number) => (el: HTMLButtonElement) => {
    setResultRefs((refs) => {
      refs[index] = el
      return refs
    })
  }

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        resultRefs,
        setResultRefs,
        setResultRefAt,
        activeIndex,
        setActiveIndex,
        incrementActiveIndex,
        decrementActiveIndex,
      }}
    >
      {props.children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const searchContext = useContext(SearchContext)
  if (searchContext === undefined) {
    throw new Error(
      `${useSearch.name} must be used within a ${SearchProvider.name}`,
    )
  }
  return searchContext
}
