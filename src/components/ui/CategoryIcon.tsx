import * as Icons from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: string;
}

export function CategoryIcon({ name, ...props }: IconProps) {
  const Comp = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!Comp) return <Icons.MoreHorizontal {...props} />;
  return <Comp {...props} />;
}
