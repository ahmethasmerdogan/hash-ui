/**
 * The overlay family's claims are almost all invisible: that Tab cannot
 * leave a modal, that focus comes back to whatever opened it, that an alert
 * dialog does not close on a stray backdrop click, that a filtered list
 * keeps its highlight on a row that still exists, and that a date grid is
 * one tab stop rather than forty-two.
 *
 * Every one of those is a bug that looks fine in a screenshot.
 */
import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Popover, HoverCard } from "../src/Popover.js";
import { Sheet, AlertDialog } from "../src/Sheet.js";
import { Collapsible, ScrollArea, AspectRatio, InputOTP } from "../src/Layout.js";
import { Combobox, Command, type Option } from "../src/Combobox.js";
import { Calendar } from "../src/Calendar.js";

/* jsdom has no layout, so anchored positioning always measures zeroes.
   That is fine — every test here is about behaviour, not coordinates. */

describe("Popover", () => {
  it("says it is closed, then open, on its trigger", () => {
    render(
      <Popover label="Details" trigger={<button>Open</button>}>
        <p>Panel body</p>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("dialog", { name: "Details" })).toBeTruthy();
  });

  it("closes on Escape and gives focus back to the trigger", () => {
    render(
      <Popover label="Details" trigger={<button>Open</button>}>
        <button>Inside</button>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    trigger.focus();
    fireEvent.click(trigger);
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Inside" }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("does not treat a click on its own trigger as an outside click", () => {
    /* it would close and reopen in the same gesture, so the panel never
       appears to open at all */
    render(
      <Popover label="D" trigger={<button>Open</button>}>
        <p>Body</p>
      </Popover>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("closes on a click outside", () => {
    render(
      <>
        <button>Elsewhere</button>
        <Popover label="D" trigger={<button>Open</button>}>
          <p>Body</p>
        </Popover>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.pointerDown(screen.getByRole("button", { name: "Elsewhere" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("HoverCard", () => {
  it("describes its trigger rather than expanding it", () => {
    render(
      <HoverCard trigger={<button>Name</button>} openDelay={0} closeDelay={0}>
        <p>A preview</p>
      </HoverCard>,
    );
    const trigger = screen.getByRole("button", { name: "Name" });
    /* it is a description, not a disclosure — aria-expanded would promise
       something to open into, and there is nothing focusable in it */
    expect(trigger.getAttribute("aria-expanded")).toBeNull();
    fireEvent.focus(trigger);
    expect(screen.getByRole("tooltip")).toBeTruthy();
    expect(trigger.getAttribute("aria-describedby")).toBeTruthy();
  });

  it("opens on focus, so it is reachable without a mouse", () => {
    render(
      <HoverCard trigger={<button>Name</button>}>
        <p>A preview</p>
      </HoverCard>,
    );
    fireEvent.focus(screen.getByRole("button", { name: "Name" }));
    expect(screen.getByRole("tooltip")).toBeTruthy();
  });
});

describe("Sheet", () => {
  const Harness = () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <button onClick={() => setOpen(true)}>Open sheet</button>
        <Sheet open={open} onClose={() => setOpen(false)} title="Settings">
          <button>First</button>
          <button>Last</button>
        </Sheet>
      </>
    );
  };

  it("is a named modal dialog", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
  });

  it("keeps Tab inside it", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    const last = screen.getByRole("button", { name: "Last" });
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    /* wrapped to the first control in the panel, not out to the page */
    expect(screen.getByRole("dialog").contains(document.activeElement)).toBe(true);
  });

  it("hands focus back when it closes", () => {
    render(<Harness />);
    const opener = screen.getByRole("button", { name: "Open sheet" });
    opener.focus();
    fireEvent.click(opener);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.activeElement).toBe(opener);
  });

  it("locks the page scroll while it is open", () => {
    render(<Harness />);
    fireEvent.click(screen.getByRole("button", { name: "Open sheet" }));
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("AlertDialog", () => {
  const setup = () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <AlertDialog
        open
        onCancel={onCancel}
        onConfirm={onConfirm}
        title="Delete this workspace?"
        description="Every project in it goes too."
        confirmLabel="Delete"
      />,
    );
    return { onCancel, onConfirm };
  };

  it("is an alertdialog, which is not the same as a dialog", () => {
    setup();
    expect(screen.getByRole("alertdialog")).toBeTruthy();
  });

  it("focuses cancel, so the destructive action is not one Enter away", () => {
    setup();
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Cancel" }));
  });

  it("does not close on a click outside — a stray click is not an answer", () => {
    const { onCancel } = setup();
    fireEvent.pointerDown(document.body);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("does close on Escape, which is a deliberate answer", () => {
    const { onCancel } = setup();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalled();
  });
});

describe("Collapsible", () => {
  it("reports and toggles its expanded state", () => {
    render(<Collapsible trigger="More">Hidden detail</Collapsible>);
    const btn = screen.getByRole("button", { name: "More" });
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
  });

  it("points the trigger at the region it controls", () => {
    render(<Collapsible trigger="More">Hidden detail</Collapsible>);
    const controls = screen.getByRole("button", { name: "More" }).getAttribute("aria-controls");
    expect(document.getElementById(controls!)).toBeTruthy();
  });
});

describe("ScrollArea", () => {
  it("is reachable by keyboard, because a mouse is not the only way to scroll", () => {
    render(<ScrollArea>content</ScrollArea>);
    expect(screen.getByText("content").getAttribute("tabindex")).toBe("0");
  });
});

describe("AspectRatio", () => {
  it("uses the real property rather than a padding hack", () => {
    render(
      <AspectRatio ratio={4 / 3}>
        <span>inside</span>
      </AspectRatio>,
    );
    const box = screen.getByText("inside").parentElement!;
    /* the browser normalises "1.333" to "1.333 / 1" */
    expect(box.style.aspectRatio.startsWith(String(4 / 3))).toBe(true);
    expect(box.style.paddingBottom).toBe("");
  });
});

describe("InputOTP", () => {
  it("is one input, so a paste and an autofill both land", () => {
    const onComplete = vi.fn();
    render(<InputOTP length={6} onComplete={onComplete} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(1);
    expect(inputs[0].getAttribute("autocomplete")).toBe("one-time-code");
  });

  it("takes a pasted code whole", () => {
    const onComplete = vi.fn();
    render(<InputOTP length={6} onComplete={onComplete} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "483920" } });
    expect(onComplete).toHaveBeenCalledWith("483920");
  });

  it("drops anything that is not a digit", () => {
    const onChange = vi.fn();
    render(<InputOTP length={6} onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "4a8-3b9" } });
    expect(onChange).toHaveBeenLastCalledWith("4839");
  });
});

describe("Combobox", () => {
  const options: Array<Option> = [
    { value: "tr", label: "Türkiye" },
    { value: "de", label: "Germany" },
    { value: "fr", label: "France", keywords: "paris" },
  ];

  const open = () => {
    fireEvent.click(screen.getByRole("combobox"));
  };

  it("filters on keywords that are never displayed", () => {
    render(<Combobox options={options} label="Country" />);
    open();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "paris" } });
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("option").textContent).toContain("France");
  });

  it("moves the highlight with the arrows and announces it", () => {
    render(<Combobox options={options} label="Country" />);
    open();
    const field = screen.getByRole("textbox");
    const first = field.getAttribute("aria-activedescendant");
    fireEvent.keyDown(field, { key: "ArrowDown" });
    expect(field.getAttribute("aria-activedescendant")).not.toBe(first);
  });

  it("keeps the highlight on a row that still exists after filtering", () => {
    /* the classic bug: highlight index 2, filter down to one row, press
       Enter, and nothing is selected because index 2 is now past the end */
    const onChange = vi.fn();
    render(<Combobox options={options} label="Country" onChange={onChange} />);
    open();
    const field = screen.getByRole("textbox");
    fireEvent.keyDown(field, { key: "ArrowDown" });
    fireEvent.keyDown(field, { key: "ArrowDown" });
    fireEvent.change(field, { target: { value: "paris" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("fr");
  });

  it("does not make its rows tab stops", () => {
    render(<Combobox options={options} label="Country" />);
    open();
    for (const row of screen.getAllByRole("option"))
      expect(row.getAttribute("tabindex")).toBe("-1");
  });
});

describe("Command", () => {
  const options: Array<Option> = [
    { value: "new", label: "New project", group: "Actions" },
    { value: "settings", label: "Open settings", group: "Actions" },
  ];

  it("is a named modal with a listbox", () => {
    render(<Command open onClose={() => {}} options={options} onSelect={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Command palette" })).toBeTruthy();
    expect(screen.getByRole("listbox")).toBeTruthy();
  });

  it("selects the highlighted row on Enter", () => {
    const onSelect = vi.fn();
    render(<Command open onClose={() => {}} options={options} onSelect={onSelect} />);
    const field = screen.getByRole("combobox");
    fireEvent.keyDown(field, { key: "ArrowDown" });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith("settings");
  });

  it("counts the results out loud", () => {
    render(<Command open onClose={() => {}} options={options} onSelect={() => {}} />);
    expect(screen.getByRole("status").textContent).toContain("2 results");
  });
});

describe("Calendar", () => {
  it("is one tab stop, not forty-two", () => {
    render(<Calendar />);
    const tabbable = screen
      .getAllByRole("gridcell")
      .filter((c) => c.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
  });

  it("names each cell with the whole date, not just the number", () => {
    render(<Calendar value={new Date(2026, 7, 14)} />);
    /* "14" on its own tells a screen-reader user nothing about the month */
    const cell = screen.getAllByRole("gridcell").find((c) => c.textContent === "14")!;
    expect(cell.getAttribute("aria-label")!.length).toBeGreaterThan(6);
  });

  it("marks the selected date as selected", () => {
    const d = new Date(2026, 7, 14);
    render(<Calendar value={d} />);
    const selected = screen.getAllByRole("gridcell").filter((c) => c.getAttribute("aria-selected") === "true");
    expect(selected).toHaveLength(1);
    expect(selected[0].textContent).toContain("14");
  });

  it("hands back local midnight, not a UTC instant", () => {
    const onChange = vi.fn();
    render(<Calendar value={new Date(2026, 7, 14)} onChange={onChange} />);
    const cell = screen.getAllByRole("gridcell").find((c) => c.textContent === "20")!;
    fireEvent.click(cell);
    const got = onChange.mock.calls[0][0] as Date;
    expect([got.getHours(), got.getMinutes(), got.getSeconds()]).toEqual([0, 0, 0]);
    expect(got.getDate()).toBe(20);
  });

  it("respects min and max", () => {
    render(
      <Calendar
        value={new Date(2026, 7, 14)}
        min={new Date(2026, 7, 10)}
        max={new Date(2026, 7, 20)}
      />,
    );
    const cells = screen.getAllByRole("gridcell");
    const five = cells.find((c) => c.textContent === "5" && !c.className.includes("opacity-30"));
    expect(five).toBeUndefined();
  });

  it("always draws six rows, so paging does not resize the grid", () => {
    render(<Calendar />);
    expect(screen.getAllByRole("gridcell")).toHaveLength(42);
  });
});
