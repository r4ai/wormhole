import { Kbd } from "@/ui/kbd"
import { Skelton } from "@/ui/skeleton"
import { Skeleton } from "@/ui/skeleton/skeleton"
import { Image } from "@kobalte/core/image"
import { getActionFn } from "@wormhole/api/core"
import { type SearchQuery, search } from "@wormhole/api/db"
import type { Command } from "@wormhole/api/schema"
import { css, cx } from "@wormhole/styled-system/css"
import { hstack } from "@wormhole/styled-system/patterns"
import type { JsxStyleProps } from "@wormhole/styled-system/types"
import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-solid"
import {
  type Accessor,
  type Component,
  type ComponentProps,
  For,
  type JSX,
  type ParentComponent,
  Suspense,
  createEffect,
  createResource,
  mergeProps,
  splitProps,
} from "solid-js"
import { SearchProvider, useSearch } from "../contexts"

export type SearchProps = {
  searchRootProps?: SearchRootProps
  searchInputProps?: SearchInputProps
  searchResultsProps?: SearchResultsProps
  searchFooterProps?: SearchFooterProps
}

export const Search: Component<SearchProps> = (props) => {
  return (
    <SearchRoot {...props.searchRootProps}>
      <SearchInput {...props.searchInputProps} />
      <Suspense fallback={<LoadingSearchResults />}>
        <SearchResults {...props.searchResultsProps} />
      </Suspense>
      <SearchFooter {...props.searchFooterProps} />
    </SearchRoot>
  )
}

export type SearchRootProps = ComponentProps<"div"> & {
  css?: JsxStyleProps
  children?: JSX.Element
}

export const SearchRoot: Component<SearchRootProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "css"])
  return (
    <Suspense>
      <SearchProvider>
        <div
          class={cx(
            css(
              {
                height: "full",
                width: "full",
                minWidth: "breakpoint-sm",
                display: "flex",
                flexDirection: "column",
                borderWidth: 1,
                borderColor: "border",
                gap: 0,
                rounded: "xl",
                divideColor: "border",
                divideY: 1,
              },
              local.css,
            ),
            local.class,
          )}
          {...rest}
        >
          {props.children}
        </div>
      </SearchProvider>
    </Suspense>
  )
}

export type SearchInputProps = ComponentProps<"form"> & {
  css?: JsxStyleProps
  onQueryChange?: (query: string) => void
  exit?: () => void
}

export const SearchInput: Component<SearchInputProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "class",
    "css",
    "onQueryChange",
    "exit",
  ])
  const {
    query,
    setQuery,
    activeIndex,
    incrementActiveIndex,
    decrementActiveIndex,
    resultRefs,
  } = useSearch()

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        incrementActiveIndex()
        resultRefs().at(activeIndex())?.scrollIntoView({ block: "nearest" })
        break
      case "ArrowUp":
        e.preventDefault()
        decrementActiveIndex()
        resultRefs().at(activeIndex())?.scrollIntoView({ block: "nearest" })
        break
      case "Escape":
        local.exit?.()
        break
    }
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    resultRefs().at(activeIndex())?.click()
  }

  createEffect(() => local.onQueryChange?.(query()))

  return (
    <form
      class={cx(
        css(
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
            borderBottom: "border",
            padding: 4,
          },
          local.css,
        ),
        local.class,
      )}
      onSubmit={handleSubmit}
      {...rest}
    >
      <SearchIcon
        class={css({
          height: "5",
          width: "5",
        })}
      />
      <input
        tabIndex={0}
        type="text"
        class={css({
          width: "full",
          background: "transparent",
          outline: "none",
        })}
        placeholder="Search..."
        value={query()}
        onInput={(e) => setQuery(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
    </form>
  )
}

export type LoadingSearchResultsProps = ComponentProps<"ol"> & {
  css?: JsxStyleProps
}

export const LoadingSearchResults: Component<LoadingSearchResultsProps> = (
  props,
) => {
  const [local, rest] = splitProps(props, ["class", "css"])

  return (
    <ol class={cx(local.class, css({ padding: 2 }, local.css))} {...rest}>
      {Array.from({ length: 5 }, () => (
        <LoadingSearchResult />
      ))}
    </ol>
  )
}

const defaultQuery = { offset: 0, limit: 20 } satisfies Partial<SearchQuery>

export type SearchResultsProps = ComponentProps<"ol"> & {
  css?: JsxStyleProps
  search?: (query: SearchQuery) => Promise<Command[]>
  defaultQuery?: Partial<SearchQuery>
  searchResultProps?: (
    command: Command,
    index: Accessor<number>,
  ) => Partial<SearchResultProps>
}

export const SearchResults: Component<SearchResultsProps> = (props) => {
  const [local, rest] = splitProps(
    mergeProps({ search, defaultQuery }, props),
    ["class", "css", "defaultQuery", "search", "searchResultProps"],
  )
  const { query, setActiveIndex, setResultRefs, setResultRefAt } = useSearch()

  const [commands] = createResource(query, async (query) => {
    const commands = await local.search({
      ...defaultQuery,
      ...local.defaultQuery,
      query,
    })

    setResultRefs(Array.from({ length: commands.length }, () => undefined))
    setActiveIndex(0)

    return commands
  })

  return (
    <ol
      class={cx(
        css(
          {
            padding: 1,
            maxHeight: "calc(2.5rem * 12 + 1rem)",
            overflow: "auto",
          },
          local.css,
        ),
        local.class,
      )}
      {...rest}
    >
      {query().length === 0 ? (
        <FallbackNoQuery />
      ) : (
        <For each={commands()} fallback={<FallbackNoResults />}>
          {(command, index) => (
            <Suspense fallback={<LoadingSearchResult />}>
              <SearchResult
                index={index()}
                command={command}
                ref={setResultRefAt(index())}
                {...local.searchResultProps?.(command, index)}
              />
            </Suspense>
          )}
        </For>
      )}
    </ol>
  )
}

const FallbackNoQuery: Component<Partial<LoadingPresenterProps>> = (props) => (
  <LoadingPresenter {...props}>Type to search...</LoadingPresenter>
)

const FallbackNoResults: Component<Partial<LoadingPresenterProps>> = (
  props,
) => <LoadingPresenter {...props}>No results found</LoadingPresenter>

const LoadingSearchResult: Component<Partial<SearchResultPresenterProps>> = (
  props,
) => (
  <SearchResultPresenter
    icon=""
    title={<Skelton class="h-4 w-2/3" />}
    kind="Command"
    action={() => {}}
    {...props}
  />
)

type SearchResultProps = ComponentProps<"button"> & {
  css?: JsxStyleProps
  index: number
  command: Command
  getActionFn?: typeof getActionFn
  afterAction?: (command: Command, index: number) => void
  beforeAction?: (command: Command, index: number) => void
}

const SearchResult: Component<SearchResultProps> = (props) => {
  const [local, rest] = splitProps(mergeProps({ getActionFn }, props), [
    "class",
    "css",
    "index",
    "command",
    "getActionFn",
    "afterAction",
    "beforeAction",
  ])
  const { activeIndex, setActiveIndex } = useSearch()
  const [actionFn] = createResource(local.command, async (command) => {
    const fn = await local.getActionFn(command.pluginId, command.action)
    return fn
  })

  return (
    <SearchResultPresenter
      class={cx(
        css(
          {
            background:
              activeIndex() === local.index ? "background.muted" : "none",
          },
          local.css,
        ),
        local.class,
      )}
      kind={local.command.kind ?? "command"}
      icon={local.command.icon}
      title={local.command.name}
      action={() => {
        local.beforeAction?.(local.command, local.index)
        const action = actionFn() ?? (() => {})
        action()
        local.afterAction?.(local.command, local.index)
      }}
      onFocus={() => setActiveIndex(local.index)}
      onMouseEnter={() => setActiveIndex(local.index)}
      {...rest}
    />
  )
}

type SearchResultPresenterProps = Omit<
  ComponentProps<"button">,
  "href" | "title"
> & {
  css?: JsxStyleProps
  action: () => void
  kind: string
  icon: string
  title: JSX.Element
}

const SearchResultPresenter: Component<SearchResultPresenterProps> = (
  props,
) => {
  const [local, rest] = splitProps(props, [
    "class",
    "css",
    "action",
    "kind",
    "icon",
    "title",
  ])

  return (
    <li>
      <button
        type="button"
        onClick={() => local.action()}
        class={cx(
          css(
            {
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 2,
              outline: "none",
              height: "2.5rem",
              width: "full",
              rounded: "md",
              scrollMarginY: 1,
            },
            local.css,
          ),
          local.class,
        )}
        {...rest}
      >
        <div class={hstack()}>
          <Image class={css({ padding: 0 })}>
            <Image.Img
              src={local.icon}
              class={css({ height: "6", width: "6" })}
            />
            <Image.Fallback>
              <Skeleton css={{ height: "6", width: "6", rounded: "full" }} />
            </Image.Fallback>
          </Image>
          <div class={css({ color: "foreground", fontWeight: "bold" })}>
            {local.title}
          </div>
        </div>
        <div class={css({ color: "foreground.muted" })}>{local.kind}</div>
      </button>
    </li>
  )
}

export type SearchFooterProps = ComponentProps<"div"> & {
  css?: JsxStyleProps
}

export const SearchFooter: Component<SearchFooterProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "css"])

  return (
    <div
      class={cx(
        css(
          {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingX: 4,
            paddingY: 3,
          },
          local.css,
        ),
        local.class,
      )}
      {...rest}
    >
      <ul
        class={css({
          display: "flex",
          flexDirection: "row",
          gap: 4,
          fontSize: "sm",
          color: "foreground.muted",
          alignItems: "center",
        })}
      >
        <li
          class={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1",
          })}
        >
          <Kbd css={{ fontSize: "xs", paddingX: "1" }}>Enter</Kbd>
          <span>to select</span>
        </li>
        <li
          class={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1",
          })}
        >
          <Kbd css={{ fontSize: "xs", paddingX: "0.5" }}>
            <ArrowUpIcon class={css({ height: 3, width: 3 })} />
          </Kbd>
          <Kbd css={{ fontSize: "xs", paddingX: "0.5" }}>
            <ArrowDownIcon class={css({ height: 3, width: 3 })} />
          </Kbd>
          <span>to navigate</span>
        </li>
        <li
          class={css({
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "1",
          })}
        >
          <Kbd css={{ fontSize: "xs", paddingX: "1" }}>Esc</Kbd>
          <span>to close</span>
        </li>
      </ul>
      <div
        class={css({
          fontSize: "sm",
          color: "foreground.muted",
        })}
      >
        Search by Wormhole
      </div>
    </div>
  )
}

type LoadingPresenterProps = ComponentProps<"div"> & {
  css?: JsxStyleProps
}

const LoadingPresenter: ParentComponent<LoadingPresenterProps> = (props) => {
  const [local, rest] = splitProps(props, ["class", "css"])

  return (
    <div
      class={cx(
        css(
          {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          },
          local.css,
        ),
        local.class,
      )}
      {...rest}
    >
      <p
        class={css({
          marginY: 8,
          color: "foreground.muted",
        })}
      >
        {props.children}
      </p>
    </div>
  )
}
