import { Link } from "react-router-dom";
import { Button, EmptyState, IArrowRight, ICompass } from "uicean";

export default function NotFound() {
  return (
    <div className="py-20">
      <EmptyState
        className="mx-auto max-w-md bg-surface/60"
        icon={<ICompass />}
        title="404 — nothing documented here"
        titleAs="h1"
        desc="That page moved when the docs were split component-by-component. Press ⌘K to search, or start from the beginning."
        action={
          <Link to="/docs">
            <Button variant="dark" size="sm" iconRight={<IArrowRight size={14} />}>
              Go to the docs
            </Button>
          </Link>
        }
      />
    </div>
  );
}
