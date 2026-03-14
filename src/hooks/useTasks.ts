import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: string;
  category: string | null;
  due_date: string | null;
  attachments_count: number;
  comments_count: number;
  position: number;
  created_at: string;
  updated_at: string;
  subtasks: Subtask[];
};

export type Subtask = {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

export function useTasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ["tasks", user?.id],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("*")
        .order("position", { ascending: true });
      if (error) throw error;

      const { data: subtasks, error: subError } = await supabase
        .from("subtasks")
        .select("*");
      if (subError) throw subError;

      return (tasks || []).map((t) => ({
        ...t,
        subtasks: (subtasks || []).filter((s) => s.task_id === t.id),
      })) as Task[];
    },
    enabled: !!user,
  });

  const createTask = useMutation({
    mutationFn: async (input: {
      title: string;
      description?: string;
      status?: string;
      category?: string;
      due_date?: string;
      subtasks?: string[];
    }) => {
      const { data: task, error } = await supabase
        .from("tasks")
        .insert({
          user_id: user!.id,
          title: input.title,
          description: input.description || null,
          status: input.status || "todo",
          category: input.category || null,
          due_date: input.due_date || null,
        })
        .select()
        .single();
      if (error) throw error;

      if (input.subtasks?.length) {
        const { error: subError } = await supabase.from("subtasks").insert(
          input.subtasks.map((title) => ({ task_id: task.id, title }))
        );
        if (subError) throw subError;
      }
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      description: string;
      status: string;
      category: string;
      due_date: string;
    }>) => {
      const { error } = await supabase.from("tasks").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSubtask = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase.from("subtasks").update({ completed }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return { tasksQuery, createTask, updateTask, deleteTask, toggleSubtask };
}
