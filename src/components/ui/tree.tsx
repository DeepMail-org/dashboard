"use client"

import * as React from "react"
import { ItemInstance } from "@headless-tree/core"
import { ChevronDownIcon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

interface TreeContextValue<T = unknown> {
  indent: number
  currentItem?: ItemInstance<T>
  tree?: unknown
}

const TreeContext = React.createContext<TreeContextValue>({
  indent: 20,
  currentItem: undefined,
  tree: undefined,
})

function useTreeContext<T = unknown>() {
  return React.useContext(TreeContext) as TreeContextValue<T>
}

interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  indent?: number
  tree?: unknown
}

function Tree({ indent = 20, tree, className, ...props }: TreeProps) {
  const containerProps =
    tree && typeof (tree as Record<string, unknown>).getContainerProps === "function"
      ? ((tree as Record<string, unknown>).getContainerProps as () => Record<string, unknown>)()
      : {}
  const mergedProps = { ...props, ...containerProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    "--tree-indent": `${indent}px`,
  } as React.CSSProperties

  return (
    <TreeContext.Provider value={{ indent, tree }}>
      <div
        data-slot="tree"
        style={mergedStyle}
        className={cn("flex flex-col", className)}
        {...otherProps}
      />
    </TreeContext.Provider>
  )
}

interface TreeItemProps<T = unknown>
  extends React.HTMLAttributes<HTMLButtonElement> {
  item: ItemInstance<T>
  indent?: number
  asChild?: boolean
}

function TreeItem<T = unknown>({
  item,
  className,
  asChild,
  children,
  ...props
}: Omit<TreeItemProps<T>, "indent">) {
  const { indent } = useTreeContext<T>()

  const itemProps = typeof item.getProps === "function" ? item.getProps() : {}
  const mergedProps = { ...props, ...itemProps }

  // Extract style from mergedProps to merge with our custom styles
  const { style: propStyle, ...otherProps } = mergedProps

  // Merge styles
  const mergedStyle = {
    ...propStyle,
    "--tree-padding": `${item.getItemMeta().level * indent}px`,
  } as React.CSSProperties

  const treeClassName = cn(
    "z-10 ps-(--tree-padding) outline-hidden select-none not-last:pb-0.5 focus:z-20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )

  const treeDataAttrs = {
    "data-slot": "tree-item" as const,
    "data-focus": typeof item.isFocused === "function" ? item.isFocused() || false : undefined,
    "data-folder": typeof item.isFolder === "function" ? item.isFolder() || false : undefined,
    "data-selected": typeof item.isSelected === "function" ? item.isSelected() || false : undefined,
    "data-drag-target": typeof item.isDragTarget === "function" ? item.isDragTarget() || false : undefined,
    "data-search-match": typeof item.isMatchingSearch === "function" ? item.isMatchingSearch() || false : undefined,
    "aria-expanded": item.isExpanded(),
  }

  return (
    <TreeContext.Provider value={{ indent, currentItem: item as ItemInstance<unknown> }}>
      {asChild ? (
        <Slot.Root
          style={mergedStyle as any}
          className={treeClassName}
          {...treeDataAttrs}
          {...(otherProps as React.HTMLAttributes<HTMLElement>)}
        >
          {children}
        </Slot.Root>
      ) : (
        <button
          data-slot="tree-item"
          style={mergedStyle as any}
          className={treeClassName}
          data-focus={
            typeof item.isFocused === "function"
              ? item.isFocused() || false
              : undefined
          }
          data-folder={
            typeof item.isFolder === "function"
              ? item.isFolder() || false
              : undefined
          }
          data-selected={
            typeof item.isSelected === "function"
              ? item.isSelected() || false
              : undefined
          }
          data-drag-target={
            typeof item.isDragTarget === "function"
              ? item.isDragTarget() || false
              : undefined
          }
          data-search-match={
            typeof item.isMatchingSearch === "function"
              ? item.isMatchingSearch() || false
              : undefined
          }
          aria-expanded={item.isExpanded()}
          {...otherProps}
        >
          {children}
        </button>
      )}
    </TreeContext.Provider>
  )
}

interface TreeItemLabelProps<T = unknown>
  extends React.HTMLAttributes<HTMLSpanElement> {
  item?: ItemInstance<T>
}

function TreeItemLabel<T = unknown>({
  item: propItem,
  children,
  className,
  ...props
}: TreeItemLabelProps<T>) {
  const { currentItem } = useTreeContext<T>()
  const item = propItem || currentItem

  if (!item) {
    console.warn("TreeItemLabel: No item provided via props or context")
    return null
  }

  return (
    <span
      data-slot="tree-item-label"
      className={cn(
        "in-focus-visible:ring-ring/50 bg-background hover:bg-accent in-data-[selected=true]:bg-accent in-data-[selected=true]:text-accent-foreground in-data-[drag-target=true]:bg-accent flex items-center gap-1 rounded-sm px-2 py-1.5 text-sm transition-colors not-in-data-[folder=true]:ps-7 in-focus-visible:ring-[3px] in-data-[search-match=true]:bg-blue-50! [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {item.isFolder() && (
        <ChevronDownIcon className="tree-item-chevron text-muted-foreground size-4 in-aria-[expanded=false]:-rotate-90" />
      )}
      {children ||
        (typeof item.getItemName === "function" ? item.getItemName() : null)}
    </span>
  )
}

export { Tree, TreeItem, TreeItemLabel }
