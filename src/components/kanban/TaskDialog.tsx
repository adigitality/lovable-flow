import { useState, useEffect } from "react";
import { Task } from "@/hooks/useTasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  defaultStatus?: string;
  onSave: (data: {
    title: string;
    description?: string;
    status: string;
    category?: string;
    due_date?: string;
    subtasks?: string[];
  }) => void;
  onToggleSubtask?: (id: string, completed: boolean) => void;
}

const categories = ["Design", "Data", "Media", "Dev", "Other"];

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultStatus = "todo",
  onSave,
  onToggleSubtask,
}: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(defaultStatus);
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [newSubtasks, setNewSubtasks] = useState<string[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setStatus(task.status);
      setCategory(task.category || "");
      setDueDate(task.due_date || "");
      setNewSubtasks([]);
    } else {
      setTitle("");
      setDescription("");
      setStatus(defaultStatus);
      setCategory("");
      setDueDate("");
      setNewSubtasks([]);
    }
  }, [task, defaultStatus, open]);

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      setNewSubtasks([...newSubtasks, subtaskInput.trim()]);
      setSubtaskInput("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      category: category || undefined,
      due_date: dueDate || undefined,
      subtasks: newSubtasks.length > 0 ? newSubtasks : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="due">Due Date</Label>
              <Input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Existing subtasks */}
          {task && task.subtasks.length > 0 && (
            <div className="space-y-2">
              <Label>Subtasks</Label>
              {task.subtasks.map((sub) => (
                <div key={sub.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={sub.completed}
                    onCheckedChange={(checked) =>
                      onToggleSubtask?.(sub.id, checked as boolean)
                    }
                  />
                  <span className={sub.completed ? "line-through text-muted-foreground" : ""}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* New subtasks */}
          <div className="space-y-2">
            <Label>{task ? "Add Subtasks" : "Subtasks"}</Label>
            {newSubtasks.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="flex-1">• {s}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setNewSubtasks(newSubtasks.filter((_, j) => j !== i))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              <Input
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                placeholder="Add a subtask..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSubtask())}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSubtask}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{task ? "Save Changes" : "Create Task"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
