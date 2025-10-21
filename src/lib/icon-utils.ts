import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

export function getIconComponent(iconName: string): LucideIcon {
  const iconMap: Record<string, LucideIcon> = {
    Shield: LucideIcons.Shield,
    Book: LucideIcons.Book,
    FileText: LucideIcons.FileText,
    Settings: LucideIcons.Settings,
    Users: LucideIcons.Users,
    AlertTriangle: LucideIcons.AlertTriangle,
    Search: LucideIcons.Search,
    Archive: LucideIcons.Archive,
    FileArchive: LucideIcons.FileArchive,
    Lock: LucideIcons.Lock,
    Database: LucideIcons.Database,
    Code: LucideIcons.Code,
    Zap: LucideIcons.Zap,
    Star: LucideIcons.Star,
    Heart: LucideIcons.Heart,
    MessageSquare: LucideIcons.MessageSquare,
    Bell: LucideIcons.Bell,
    CheckCircle: LucideIcons.CheckCircle,
    XCircle: LucideIcons.XCircle,
    Info: LucideIcons.Info,
    HelpCircle: LucideIcons.HelpCircle,
    Folder: LucideIcons.Folder,
    File: LucideIcons.File,
    Tag: LucideIcons.Tag,
    Hash: LucideIcons.Hash,
    AtSign: LucideIcons.AtSign,
    Mail: LucideIcons.Mail,
    Link: LucideIcons.Link,
    Wrench: LucideIcons.Wrench,
    Tool: LucideIcons.Wrench,
    Activity: LucideIcons.Activity,
    BarChart: LucideIcons.BarChart,
  };

  return iconMap[iconName] || LucideIcons.FileText;
}

export function formatCategoryName(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
