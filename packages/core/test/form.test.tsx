/**
 * Field, Toggle and DataTable carry claims that are invisible on screen:
 * that a hint is announced with its control, that an error replaces it and
 * marks the control invalid, that a toggle reports pressed rather than
 * checked, and that sorting does not mutate the caller's array. A screenshot
 * shows none of that, which is why these are tests and not a demo.
 */
import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Field, Textarea, Toggle, ToggleGroup, Separator, Spinner, Label } from "../src/Form.js";
import { DataTable, type Column } from "../src/Table.js";

describe("Field", () => {
  it("points the label at the control it labels", () => {
    render(
      <Field label="Email">{(p) => <input {...p} type="email" />}</Field>,
    );
    /* getByLabelText only finds it if htmlFor and id actually match */
    expect(screen.getByLabelText("Email").getAttribute("type")).toBe("email");
  });

  it("announces the hint with the control rather than beside it", () => {
    render(
      <Field label="Handle" hint="Letters and numbers only.">
        {(p) => <input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText("Handle");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(describedBy!)?.textContent).toContain(
      "Letters and numbers only.",
    );
  });

  it("replaces the hint with the error and marks the control invalid", () => {
    render(
      <Field label="Handle" hint="Letters and numbers only." error="Already taken.">
        {(p) => <input {...p} />}
      </Field>,
    );
    const input = screen.getByLabelText("Handle");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby")!;
    expect(document.getElementById(describedBy)?.textContent).toContain("Already taken.");
    /* the hint is gone, not merely hidden behind the error */
    expect(screen.queryByText("Letters and numbers only.")).toBeNull();
  });

  it("gives the error a live role, so it is heard after submit", () => {
    render(<Field label="X" error="Nope">{(p) => <input {...p} />}</Field>);
    expect(screen.getByRole("alert")?.textContent).toContain("Nope");
  });

  it("gives every field its own ids", () => {
    render(
      <>
        <Field label="One" hint="a">{(p) => <input {...p} />}</Field>
        <Field label="Two" hint="b">{(p) => <input {...p} />}</Field>
      </>,
    );
    const a = screen.getByLabelText("One").getAttribute("aria-describedby");
    const b = screen.getByLabelText("Two").getAttribute("aria-describedby");
    expect(a).not.toBe(b);
  });

  it("says 'required' out loud, not only with an asterisk", () => {
    render(<Label required>Name</Label>);
    expect(screen.getByText("(required)")).toBeTruthy();
  });
});

describe("Textarea", () => {
  it("stays a textarea and forwards its props", () => {
    render(<Textarea rows={7} placeholder="Say something" />);
    const el = screen.getByPlaceholderText("Say something");
    expect(el.tagName).toBe("TEXTAREA");
    expect(el.getAttribute("rows")).toBe("7");
  });
});

describe("Toggle", () => {
  it("reports pressed, which is not the same as checked", () => {
    render(<Toggle aria-label="Bold">B</Toggle>);
    const btn = screen.getByRole("button", { name: "Bold" });
    expect(btn.getAttribute("aria-pressed")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("true");
  });

  it("leaves a controlled toggle alone until the caller says otherwise", () => {
    render(<Toggle aria-label="Bold" pressed={false} onChange={() => {}}>B</Toggle>);
    const btn = screen.getByRole("button", { name: "Bold" });
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-pressed")).toBe("false");
  });
});

describe("ToggleGroup", () => {
  const items = [
    { value: "l", label: "Left" },
    { value: "c", label: "Centre" },
  ];

  it("names the group, so its buttons are not announced as unrelated", () => {
    render(<ToggleGroup items={items} label="Alignment" />);
    expect(screen.getByRole("group", { name: "Alignment" })).toBeTruthy();
  });

  it("keeps one pressed at a time by default", () => {
    render(<ToggleGroup items={items} label="Alignment" />);
    fireEvent.click(screen.getByRole("button", { name: "Left" }));
    fireEvent.click(screen.getByRole("button", { name: "Centre" }));
    expect(screen.getByRole("button", { name: "Left" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("button", { name: "Centre" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("keeps several pressed when multiple", () => {
    render(<ToggleGroup items={items} label="Alignment" multiple />);
    fireEvent.click(screen.getByRole("button", { name: "Left" }));
    fireEvent.click(screen.getByRole("button", { name: "Centre" }));
    expect(screen.getByRole("button", { name: "Left" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Centre" }).getAttribute("aria-pressed")).toBe("true");
  });
});

describe("Separator", () => {
  it("is a separator, and says which way it runs", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });
});

describe("Spinner", () => {
  it("says it is loading", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")?.textContent).toContain("Loading");
  });

  it("stays silent when the surrounding control already says so", () => {
    render(<Spinner label={null} />);
    expect(screen.queryByRole("status")).toBeNull();
  });
});

describe("DataTable", () => {
  type Row = { id: string; name: string; n: number };
  const rows: Row[] = [
    { id: "b", name: "Beta", n: 2 },
    { id: "a", name: "Alpha", n: 30 },
    { id: "c", name: "Gamma", n: 1 },
  ];
  const columns: Array<Column<Row>> = [
    { id: "name", header: "Name", cell: (r) => r.name, sortBy: (r) => r.name },
    { id: "n", header: "Count", cell: (r) => r.n, sortBy: (r) => r.n, align: "right" },
  ];

  const names = () =>
    screen.getAllByRole("row").slice(1).map((r) => r.querySelectorAll("td")[0].textContent);

  it("sorts ascending, then descending, then not at all", () => {
    render(<DataTable rows={rows} columns={columns} rowKey={(r) => r.id} />);
    const header = screen.getByRole("button", { name: /Name/ });
    expect(names()).toEqual(["Beta", "Alpha", "Gamma"]);
    fireEvent.click(header);
    expect(names()).toEqual(["Alpha", "Beta", "Gamma"]);
    fireEvent.click(header);
    expect(names()).toEqual(["Gamma", "Beta", "Alpha"]);
    fireEvent.click(header);
    expect(names()).toEqual(["Beta", "Alpha", "Gamma"]);
  });

  it("sorts numbers as numbers", () => {
    render(<DataTable rows={rows} columns={columns} rowKey={(r) => r.id} />);
    fireEvent.click(screen.getByRole("button", { name: /Count/ }));
    /* the string comparison this replaces puts 30 before 2 */
    expect(names()).toEqual(["Gamma", "Beta", "Alpha"]);
  });

  it("puts the sort state on the header cell", () => {
    render(<DataTable rows={rows} columns={columns} rowKey={(r) => r.id} />);
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    const th = screen.getAllByRole("columnheader")[0];
    expect(th.getAttribute("aria-sort")).toBe("ascending");
  });

  it("does not sort the caller's array in place", () => {
    const original = [...rows];
    render(<DataTable rows={rows} columns={columns} rowKey={(r) => r.id} />);
    fireEvent.click(screen.getByRole("button", { name: /Name/ }));
    expect(rows).toEqual(original);
  });

  it("spans the empty message across every column", () => {
    render(<DataTable rows={[]} columns={columns} rowKey={(r) => r.id} empty="No rows" />);
    const cell = screen.getByText("No rows");
    expect(cell.getAttribute("colspan")).toBe("2");
  });
});
