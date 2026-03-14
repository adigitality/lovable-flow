import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/kanban/AppSidebar";
import { KanbanColumn } from "@/components/kanban/KanbanColumn";
import { TaskDialog } from "@/components/kanban/TaskDialog";
import { AIChatPanel } from "@/components/kanban/AIChatPanel";
import { useTasks, Task } from "@/hooks/useTasks";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Board() {
  const { tasksQuery, createTask, updateTask, deleteTask, toggleSubtask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState("todo");
  const [chatOpen, setChatOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const tasks = tasksQuery.data || [];
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress");

  const handleAddTask = (status: string) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleSave = (data: any) => {
    if (editingTask) {
      updateTask.mutate({ id: editingTask.id, ...data });
    } else {
      createTask.mutate(data);
    }
  };

  const handleMove = (id: string, status: string) => {
    updateTask.mutate({ id, status });
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTask.mutate(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div>
                <h1 className="text-lg font-bold leading-tight">Kanban Board</h1>
                <p className="text-xs text-muted-foreground">
                  {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>
            <Button
              variant={chatOpen ? "default" : "outline"}
              size="sm"
              className="gap-2"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Button>
          </header>

          <div className="flex flex-1 overflow-hidden">
            {/* Board */}
            <main className="flex-1 p-6 overflow-auto">
              {tasksQuery.isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex gap-6 max-w-4xl">
                  <KanbanColumn
                    title="To-Do"
                    status="todo"
                    tasks={todoTasks}
                    accentVar="--kanban-todo"
                    onAddTask={handleAddTask}
                    onMoveTask={handleMove}
                    onDeleteTask={(id) => setDeleteId(id)}
                    onEditTask={handleEditTask}
                  />
                  <KanbanColumn
                    title="In Progress"
                    status="in_progress"
                    tasks={inProgressTasks}
                    accentVar="--kanban-progress"
                    onAddTask={handleAddTask}
                    onMoveTask={handleMove}
                    onDeleteTask={(id) => setDeleteId(id)}
                    onEditTask={handleEditTask}
                  />
                </div>
              )}
            </main>

            {/* AI Chat */}
            <AIChatPanel
              open={chatOpen}
              onClose={() => setChatOpen(false)}
              tasks={tasks}
              onCreateTask={(data) => createTask.mutate(data)}
            />
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onSave={handleSave}
        onToggleSubtask={(id, completed) => toggleSubtask.mutate({ id, completed })}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All subtasks will also be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
