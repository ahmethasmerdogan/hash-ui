import { useMemo, useState, type ReactNode, type ThHTMLAttributes } from "react";
import { cx } from "./cx.js";
import { IChevronDown } from "./icons.js";

/* ------------------------------------------------------------------ */
/* Table                                                               */
/*                                                                     */
/* UICean documented a data table and shipped no table: the demo on    */
/* the data page was hand-written markup, so anyone who liked it had   */
/* to copy the markup rather than the component.                       */
/*                                                                     */
/* Two layers, because the two jobs are different. The primitives are  */
/* thin wrappers that carry the house style and nothing else — use     */
/* them when the table is bespoke. `DataTable` sits on top for the     */
/* common case: columns in, rows out, sorting and selection handled.   */
/*                                                                     */
/* The wrapper scrolls, the header does not float, and there is no     */
/* virtualisation. A table that needs windowing needs a library, and    */
/* pretending otherwise is how a design system ends up owning one.     */
/* ------------------------------------------------------------------ */

export function Table({
  children,
  caption,
  minWidth = 520,
  className,
}: {
  children: ReactNode;
  /**
   * What the table holds. Rendered visually hidden — a sighted reader has
   * the surrounding heading, and a screen reader announces this when it
   * meets the table, which is the one place the context is missing.
   */
  caption?: ReactNode;
  /** below this the wrapper scrolls rather than the columns collapsing */
  minWidth?: number;
  className?: string;
}) {
  return (
    <div className={cx("scroll-thin w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-[13px]" style={{ minWidth }}>
        {caption && <caption className="sr-only">{caption}</caption>}
        {children}
      </table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-line">{children}</thead>;
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({
  children,
  selected,
  onClick,
  className,
}: {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <tr
      onClick={onClick}
      /* aria-selected belongs on a row only when the table actually has a
         selection model; on a plain row it announces a state that does not
         exist */
      aria-selected={selected}
      className={cx(
        "border-b border-line last:border-0",
        selected ? "bg-brand-soft/60 dark:bg-brand/12" : "hover:bg-inset/60",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Th({
  children,
  align = "left",
  className,
  ...rest
}: ThHTMLAttributes<HTMLTableCellElement> & {
  align?: "left" | "right" | "center";
}) {
  return (
    <th
      scope="col"
      className={cx(
        "px-3 py-2.5 text-[11.5px] font-semibold tracking-[0.04em] text-ink-3 uppercase",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  align = "left",
  colSpan,
  className,
}: {
  children: ReactNode;
  align?: "left" | "right" | "center";
  colSpan?: number;
  className?: string;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cx(
        "px-3 py-2.5 align-middle text-ink-2",
        align === "right" && "text-right",
        align === "center" && "text-center",
        className,
      )}
    >
      {children}
    </td>
  );
}

/* ------------------------------------------------------------------ */
/* DataTable                                                           */
/* ------------------------------------------------------------------ */

export type Column<Row> = {
  /** used as the sort key and the React key */
  id: string;
  header: ReactNode;
  /** what to draw in the cell */
  cell: (row: Row) => ReactNode;
  /** what to sort on. Omit to make the column unsortable. */
  sortBy?: (row: Row) => string | number;
  align?: "left" | "right" | "center";
  width?: number | string;
};

export function DataTable<Row>({
  rows,
  columns,
  rowKey,
  caption,
  empty = "Nothing to show",
  minWidth,
  className,
}: {
  rows: Row[];
  columns: Array<Column<Row>>;
  rowKey: (row: Row) => string;
  caption?: ReactNode;
  empty?: ReactNode;
  minWidth?: number;
  className?: string;
}) {
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.id === sort.id);
    if (!col?.sortBy) return rows;
    const dir = sort.dir === "asc" ? 1 : -1;
    /* a copy: sorting the caller's array in place is a bug that only shows
       up once their state is derived from it */
    return [...rows].sort((a, b) => {
      const x = col.sortBy!(a);
      const y = col.sortBy!(b);
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      
      return String(x).localeCompare(String(y)) * dir;
    });
  }, [rows, columns, sort]);

  const toggle = (id: string) =>
    setSort((s) =>
      s?.id === id ? (s.dir === "asc" ? { id, dir: "desc" } : null) : { id, dir: "asc" },
    );

  return (
    <Table caption={caption} minWidth={minWidth} className={className}>
      <THead>
        <tr>
          {columns.map((c) => {
            const active = sort?.id === c.id;
            return (
              <Th
                key={c.id}
                align={c.align}
                style={c.width ? { width: c.width } : undefined}
                /* the sort state belongs on the header cell, where a screen
                   reader looks for it, not only on the arrow */
                aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined}
              >
                {c.sortBy ? (
                  <button
                    type="button"
                    onClick={() => toggle(c.id)}
                    className={cx(
                      "inline-flex items-center gap-1 rounded-[6px] transition-colors hover:text-ink",
                      "outline-none focus-visible:ring-2 focus-visible:ring-brand/45",
                      active && "text-ink",
                      c.align === "right" && "flex-row-reverse",
                    )}
                  >
                    {c.header}
                    <IChevronDown
                      size={12}
                      aria-hidden
                      className={cx(
                        "transition-transform",
                        !active && "opacity-0 group-hover:opacity-40",
                        active && sort!.dir === "asc" && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  c.header
                )}
              </Th>
            );
          })}
        </tr>
      </THead>
      <TBody>
        {sorted.length === 0 ? (
          <tr>
            {/* colSpan, not a grid span: a td that does not cover the row
                leaves the empty message sitting under the first column */}
            <Td colSpan={columns.length} align="center" className="py-10 text-ink-3">
              {empty}
            </Td>
          </tr>
        ) : (
          sorted.map((row) => (
            <Tr key={rowKey(row)}>
              {columns.map((c) => (
                <Td key={c.id} align={c.align}>
                  {c.cell(row)}
                </Td>
              ))}
            </Tr>
          ))
        )}
      </TBody>
    </Table>
  );
}
