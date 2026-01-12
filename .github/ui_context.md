# UI Development Guidelines & Context

This project uses [shadcn/ui](https://ui.shadcn.com/) for its component library, styled with Tailwind CSS.

## Adding New Components

To add a new shadcn component, use the CLI. Do not manually copy-paste code unless necessary, as the CLI handles dependencies and configuration updates.

```bash
npx shadcn@latest add [component-name]
```

**Example:**
```bash
npx shadcn@latest add tooltip
npx shadcn@latest add button
npx shadcn@latest add dialog
```

## structure & Paths

- **Components Directory**: `src/components/ui/`
- **Utils**: `src/lib/utils.ts` (contains the `cn` helper)
- **Global CSS**: `src/index.css`

## Best Practices

### Imports
Use the path alias `@` to import components.

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
```

### Styling
- Use **Tailwind CSS** classes for styling.
- Use the `cn()` utility function used for merging Tailwind classes conditionally.

```tsx
import { cn } from "@/lib/utils"

function MyComponent({ className, ...props }) {
  return (
    <div className={cn("bg-zinc-950 text-white p-4", className)} {...props}>
      {/* content */}
    </div>
  )
}
```

### Icons
Use `lucide-react` for icons.

```tsx
import { Check, X } from "lucide-react"
```

## Configuration (`components.json`)

Current configuration for this project:
- **Style**: `default`
- **Base Color**: `zinc`
- **CSS Variables**: `false`
- **React Server Components (RSC)**: `false`

## Common Patterns

### Tooltips
When using tooltips, remember they often require a `TooltipProvider` at the root or wrapping the component.

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function MyTooltip() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>
          <p>Tooltip content</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
```
