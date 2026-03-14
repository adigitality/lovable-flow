import { Task } from "@/hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  title: string;
  status: string;
  tasks: Task[];
  accentVar: string;
  onAddTask: (status: string) => void;
  onMoveTask: (id: string, status: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: Task) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  accentVar,
  onAddTask,
  onMoveTask,
  onDeleteTask,
  onEditTask,
}: KanbanColumnProps) {
  return (
    <div className="flex-1 min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: `hsl(var(${accentVar}))` }}
          />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
            {title}
          </h2>
          <span className={cn(
            "text-xs font-bold px-2 py-0.5 rounded-full",
            "bg-secondary text-secondary-foreground"
          )}>
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-lg hover:bg-accent"
          onClick={() => onAddTask(status)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMoveTask}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
