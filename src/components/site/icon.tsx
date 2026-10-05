import {
  Check,
  Factory,
  Layers,
  Mail,
  MessageSquare,
  Palette,
  PenTool,
  Shirt,
  Sparkles,
  Tag,
  Target,
  Truck,
  Upload,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/content/schema";

const icons = {
  target: Target,
  palette: Palette,
  layers: Layers,
  tag: Tag,
  zap: Zap,
  truck: Truck,
  upload: Upload,
  mail: Mail,
  message: MessageSquare,
  factory: Factory,
  check: Check,
  pen: PenTool,
  shirt: Shirt,
  sparkles: Sparkles,
} satisfies Record<IconName, unknown>;

export function Icon({ name, ...props }: LucideProps & { name: IconName }) {
  const Component = icons[name];
  return <Component aria-hidden {...props} />;
}
