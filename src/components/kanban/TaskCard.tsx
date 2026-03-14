import { Task } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Paperclip,
  MessageSquare,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Edit,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  design: "bg-[hsl(var(--category-design))] text-white",
  data: "bg-[hsl(var(--category-data))] text-white",
  media: "bg-[hsl(var(--category-media))] text-white",
  dev: "bg-[hsl(var(--category-dev))] text-white",
  other: "bg-[hsl(var(--category-other))] text-white",
};

interface TaskCardProps {
  task: Task;
  onMove: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onMove, onDelete, onEdit }: TaskCardProps) {
  const completedSubs = task.subtasks.filter((s) => s.completed).length;
  const totalSubs = task.subtasks.length;
  const progress = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;
  const categoryKey = (task.category || "other").toLowerCase();
  const colorClass = categoryColors[categoryKey] || categoryColors.other;

  const formatDate = (d: string | null) => {
    if (!d) return null;
    const date = new Date(d);
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { label, overdue: diff < 0, soon: diff >= 0 && diff <= 2 };
  };

  const due = formatDate(task.due_date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group rounded-xl bg-card p-4 shadow-card hover:shadow-card-hover transition-shadow cursor-pointer border border-border/50"
      onClick={() => onEdit(task)}
    >
      <div className="flex items-start justify-between mb-3">
        {task.category && (
          <Badge className={cn("text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 border-0", colorClass)}>
            {task.category}
          </Badge>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity -mt-1 -mr-1"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="mr-2 h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onMove(task.id, task.status === "todo" ? "in_progress" : "todo")
              }
            >
              {task.status === "todo" ? (
                <>
                  <ArrowRight className="mr-2 h-3.5 w-3.5" /> Move to In Progress
                </>
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-3.5 w-3.5" /> Move to To-Do
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <h3 className="font-semibold text-card-foreground mb-2 leading-snug">{task.title}</h3>

      {totalSubs > 0 && (
        <div className="mb-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Subtasks</span>
            <span className="font-medium">
              {completedSubs}/{totalSubs}
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
        <div className="flex items-center gap-3">
          {task.attachments_count > 0 && (
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {task.attachments_count}
            </span>
          )}
          {task.comments_count > 0 && (
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {task.comments_count}
            </span>
          )}
        </div>
        {due && (
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              due.overdue && "text-destructive",
              due.soon && "text-[hsl(var(--kanban-progress))]"
            )}
          >
            <Calendar className="h-3 w-3" />
            {due.label}
          </span>
        )}
      </div>
    </motion.div>
  );
}
