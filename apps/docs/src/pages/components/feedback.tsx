import { useState } from "react";
import { Section, Demo, DemoCol } from "@/components/Section";
import { ApiTable } from "@/components/Code";
import {
  Alert,
  Button,
  Card,
  Dropdown,
  EmptyState,
  Modal,
  ModalClose,
  Skeleton,
  Tooltip,
  useToast,
  ICheck,
  IFolder,
  IPencil,
  IPlus,
  ISettings,
  IShare,
  IStar,
  IUpload,
  IWarning,
  IX,
} from "hash-ui";

function ToastButtons() {
  const { push } = useToast();
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        variant="green"
        size="sm"
        onClick={() =>
          push({
            tone: "success",
            title: "Timesheet submitted",
            desc: "Sent to ONE Collective GmbH for approval.",
          })
        }
      >
        Success toast
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          push({
            tone: "info",
            title: "Sync started",
            desc: "Pulling 120 records from the CRM.",
          })
        }
      >
        Info toast
      </Button>
      <Button
        variant="white"
        shape="rect"
        size="sm"
        onClick={() =>
          push({
            tone: "warning",
            title: "Approaching prompt limit",
            desc: "156 of 324 prompts used this cycle.",
          })
        }
      >
        Warning toast
      </Button>
      <Button
        variant="danger"
        size="sm"
        onClick={() =>
          push({
            tone: "danger",
            title: "Deploy failed",
            desc: "Build step exited with code 1 — see logs.",
          })
        }
      >
        Danger toast
      </Button>
    </div>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  const { push } = useToast();
  return (
    <>
      <Button variant="dark" onClick={() => setOpen(true)}>
        Open dialog
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} label="Delete workspace" width="max-w-105">
        <Card floating className="relative rounded-[22px] p-6">
          <ModalClose onClose={() => setOpen(false)} />
          <span className="flex size-11 items-center justify-center rounded-[14px] border border-red-500/25 bg-red-500/10 text-red-500">
            <IWarning size={19} />
          </span>
          <h3 className="mt-4 text-[17px] font-bold text-ink">
            Delete this workspace?
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">
            “Business Partner CRM” and its 120 records will be permanently
            removed. This action cannot be undone.
          </p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-[12.5px] font-medium text-ink-2">
              Type <span className="font-mono font-semibold text-ink">delete</span> to confirm
            </span>
            <input
              placeholder="delete"
              className="h-10 w-full rounded-[10px] border border-line-strong bg-surface px-3.5 text-sm text-ink shadow-soft outline-none placeholder:text-ink-3 focus:border-red-500 focus:ring-[3px] focus:ring-red-500/15"
            />
          </label>
          <div className="mt-5 flex justify-end gap-2.5">
            <Button variant="white" shape="rect" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              shape="rect"
              onClick={() => {
                setOpen(false);
                push({ tone: "success", title: "Workspace deleted" });
              }}
            >
              Delete workspace
            </Button>
          </div>
        </Card>
      </Modal>
    </>
  );
}

export default function FeedbackSection() {
  const [alerts, setAlerts] = useState({ warn: true });
  return (
    <Section
      id="feedback"
      registry={["feedback", "overlay"]}
      source="Feedback.tsx"
      eyebrow="Components"
      title="Feedback & status"
      desc="Inline alerts, a live toast queue, tooltips, a real modal with focus handling, dropdown menus, shimmer skeletons and empty states — the layer every professional library needs."
    >
      <Demo label="Alerts" imports={["Alert"]} refName="hashui original" contentClassName="!items-stretch">
        <div className="flex w-full max-w-xl flex-col gap-3">
          <Alert tone="info" title="A new version of HashUI is available">
            v0.2 adds the feedback layer and the input collection.
          </Alert>
          <Alert tone="success" title="Payment received — order #4821 confirmed" />
          {alerts.warn && (
            <Alert
              tone="warning"
              title="Approaching prompt limit"
              onClose={() => setAlerts({ warn: false })}
              action={
                <Button variant="white" shape="rect" size="sm">
                  Upgrade plan
                </Button>
              }
            >
              156 of 324 prompts used. Upgrade to keep tracking.
            </Alert>
          )}
          <Alert tone="danger" title="Deploy failed on 5315ffa">
            Build step exited with code 1 — inspect the warnings in Logs.
          </Alert>
        </div>
      </Demo>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Toast queue (live)" imports={["ToastProvider","useToast"]} refName="hashui original">
          <ToastButtons />
        </Demo>

        <Demo label="Tooltip & dropdown" imports={["Tooltip","Dropdown"]} refName="hashui original" contentClassName="py-12">
          <div className="flex items-center gap-6">
            <Tooltip label="Add to favorites">
              <Button variant="outline" size="sm" className="!w-9 !px-0" aria-label="Star">
                <IStar size={15} />
              </Button>
            </Tooltip>
            <Tooltip label="Share with your team">
              <Button variant="outline" size="sm" className="!w-9 !px-0" aria-label="Share">
                <IShare size={15} />
              </Button>
            </Tooltip>
            <Dropdown
              label="Actions"
              icon={<IPencil size={14} className="text-ink-3" />}
              entries={[
                { type: "label", label: "WORKSPACE" },
                { label: "Rename", icon: <IPencil /> },
                { label: "Duplicate", icon: <IPlus /> },
                { label: "Export data", icon: <IUpload /> },
                { type: "divider" },
                { label: "Settings", icon: <ISettings /> },
                { type: "divider" },
                { label: "Delete workspace", icon: <IX />, danger: true },
              ]}
            />
          </div>
        </Demo>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Dialog (live)" imports={["Modal","ModalClose"]} refName="hashui original" contentClassName="py-12">
          <ModalDemo />
        </Demo>

        <Demo label="Button states" refName="hashui original">
          <DemoCol>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button variant="green" loading>
                Calculating…
              </Button>
              <Button variant="primary" loading>
                Saving
              </Button>
              <Button variant="dark" disabled iconLeft={<ICheck size={15} />}>
                Suggest more
              </Button>
              <Button variant="outline" disabled>
                Manage credits
              </Button>
            </div>
            <span className="text-[12px] text-ink-3">
              loading &amp; disabled states, any variant
            </span>
          </DemoCol>
        </Demo>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Demo label="Skeleton" imports={["Skeleton"]} refName="hashui original" contentClassName="py-10">
          <Card className="w-full max-w-sm rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 !rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
            <Skeleton className="mt-4 h-28 w-full !rounded-xl" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <div className="mt-4 flex gap-2.5">
              <Skeleton className="h-9 w-28 !rounded-[10px]" />
              <Skeleton className="h-9 w-20 !rounded-[10px]" />
            </div>
          </Card>
        </Demo>

        <Demo label="Empty state" imports={["EmptyState"]} refName="hashui original" contentClassName="py-10">
          <EmptyState
            className="max-w-sm bg-surface/60"
            icon={<IFolder />}
            title="No documents yet"
            desc="Upload your first workpaper to start the audit trail."
            action={
              <Button variant="dark" size="sm" iconLeft={<IPlus size={14} />}>
                Add document
              </Button>
            }
          />
        </Demo>
      </div>

      <ApiTable
        component="Modal"
        rows={[
          {
            prop: "open",
            type: "boolean",
            desc: "Controls visibility; rendered into a body portal.",
          },
          {
            prop: "onClose",
            type: "() => void",
            desc: "Fires on Esc, backdrop click or ModalClose.",
          },
          {
            prop: "width",
            type: "string",
            def: '"max-w-lg"',
            desc: "Tailwind max-width class for the panel.",
          },
          {
            prop: "label",
            type: "string",
            desc: "Accessible dialog name (aria-label).",
          },
        ]}
      />
    </Section>
  );
}
