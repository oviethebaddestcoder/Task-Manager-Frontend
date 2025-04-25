import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/layouts/inputs/SelectDropdown";
import SelectUsers from "../../components/layouts/inputs/SelectUsers";
import TodoListInput from "../../components/layouts/inputs/TodoListInput";
import AddAttachmentsInput from "../../components/layouts/inputs/AddAttachmentsInput";
import moment from "moment";

const CreateTask = () => {
  const location = useLocation();
  const { taskId } = location.state || {};
  const navigate = useNavigate();

  const [currentTask, setCurrentTask] = useState(null);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: "",
    assignedTo: [],
    todoChecklist: [],
    attachments: [],
  });

  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [error, setError] = useState("");

  const handleValueChange = (key, value) => {
    setTaskData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const clearData = () => {
    setTaskData({
      title: "",
      description: "",
      priority: "Low",
      dueDate: "",
      assignedTo: [],
      todoChecklist: [],
      attachments: [],
    });
  };

  const createTask = async () => {
    setLoading(true);
    try {
      const todoList = taskData.todoChecklist.map((item) => ({
        text: item,
        completed: false,
      }));
      const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK, {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        todoChecklist: todoList,
      });
      if (response.data) {
        toast.success("🎉 Task created successfully!");
        clearData();
        navigate("/admin/tasks");
      }
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err?.response?.data?.message || "Failed to create task.");
      toast.error(err?.response?.data?.message || "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.put(
        API_PATHS.TASKS.UPDATE_TASK(taskId),
        taskData
      );
      if (response.data) {
        toast.success("✅ Task updated successfully");
        clearData();
        navigate("/admin/tasks");
      }
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err?.response?.data?.message || "Failed to update task.");
      toast.error(err?.response?.data?.message || "Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    try {
      const response = await axiosInstance.delete(
        API_PATHS.TASKS.DELETE_TASK(taskId)
      );
      if (response.data) {
        toast.success("🎉 Task deleted successfully!");
        navigate("/admin/tasks");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task.");
    }
  };

  const handleSubmit = async () => {
    setError("");
    if (!taskData.title) {
      setError("Task title is required.");
      return;
    }
    if (!taskData.description) {
      setError("Task description is required.");
      return;
    }
    if (!taskData.priority) {
      setError("Task priority is required.");
      return;
    }
    if (!taskData.dueDate) {
      setError("Task due date is required.");
      return;
    }
    if (taskData.assignedTo.length === 0) {
      setError("At least one user must be assigned to the task.");
      return;
    }
    if (taskData.todoChecklist.length === 0) {
      setError("At least one checklist item is required.");
      return;
    }
    if (taskData.attachments.length === 0) {
      setError("At least one attachment is required.");
      return;
    }
    if (taskData.attachments.length > 5) {
      setError("You can only attach up to 5 files.");
      return;
    }
    if (taskData.todoChecklist.length > 10) {
      setError("You can only add up to 10 checklist items.");
      return;
    }
    if (taskData.assignedTo.length > 5) {
      setError("You can only assign the task to up to 5 users.");
      return;
    }
    if (taskData.title.length > 100) {
      setError("Task title cannot exceed 100 characters.");
      return;
    }
    if (taskData.description.length > 500) {
      setError("Task description cannot exceed 500 characters.");
      return;
    }
    if (taskData.todoChecklist.some((item) => item.length > 100)) {
      setError("Each checklist item cannot exceed 100 characters.");
      return;
    }
    if (taskData.attachments.some((item) => item.length > 200)) {
      setError("Each attachment link cannot exceed 200 characters.");
      return;
    }
    if (taskId) {
      await updateTask();
    } else {
      await createTask();
    }
  };

  useEffect(() => {
    if (taskId) {
      getTaskDetailsByID();
    }
    return () => {};
  }, [taskId]);

  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_TASK_BY_ID(taskId)
      );

      if (response.data) {
        const taskInfo = response.data;
        setCurrentTask(taskInfo);

        setTaskData((prevState) => ({
          title: taskInfo.title,
          description: taskInfo.description,
          priority: taskInfo.priority,
          dueDate: taskInfo.dueDate
            ? moment(taskInfo.dueDate).format("YYYY-MM-DD")
            : null,
          assignedTo: taskInfo?.assignedTo?.map((item) => item?._id) || [],
          todoChecklist:
            taskInfo?.todoChecklist?.map((item) => item?._text) || [],
          attachments: taskInfo?.attachments || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching task details:", error);
      setError("Failed to fetch task details.");
    }
  };

  return (
    <DashboardLayout activeMenu="Create Task">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="form-card col-span-3 space-y-5">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">
                {taskId ? "Update Task" : "Create Task"}
              </h2>
              {taskId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" />
                  Delete
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Task Title
              </label>
              <input
                placeholder="Create App UI"
                className="form-input"
                value={taskData.title}
                onChange={({ target }) =>
                  handleValueChange("title", target.value)
                }
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                Description
              </label>
              <textarea
                placeholder="Describe task"
                className="form-input"
                rows={4}
                value={taskData.description}
                onChange={({ target }) =>
                  handleValueChange("description", target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-600">
                  Priority
                </label>
                <SelectDropdown
                  options={PRIORITY_DATA}
                  value={taskData.priority}
                  onChange={(value) => handleValueChange("priority", value)}
                  placeholder="Select Priority"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Due Date
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={taskData.dueDate}
                  onChange={({ target }) =>
                    handleValueChange("dueDate", target.value)
                  }
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600">
                  Assign To
                </label>
                <SelectUsers
                  selectedUsers={taskData.assignedTo}
                  setSelectedUsers={(value) =>
                    handleValueChange("assignedTo", value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600">
                TODO Checklist
              </label>
              <div className="mt-2">
                <TodoListInput
                  todoList={taskData.todoChecklist}
                  setTodoList={(value) =>
                    handleValueChange("todoChecklist", value)
                  }
                />
              </div>

              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600">
                  Attachments
                </label>
                <AddAttachmentsInput
                  attachments={taskData.attachments}
                  setAttachments={(value) =>
                    handleValueChange("attachments", value)
                  }
                />
              </div>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

              <div className="flex justify-end mt-5">
                <button
                  className="add-btn"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading
                    ? "Processing..."
                    : taskId
                    ? "Update Task"
                    : "Create Task"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {openDeleteAlert && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-4">Delete Task</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this task? This action cannot be
              undone.
            </p>
            <div className="flex justify-between">
              <button
                className="bg-rose-500 text-white px-4 py-2 rounded-md hover:bg-rose-600"
                onClick={deleteTask}
              >
                Yes, Delete
              </button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setOpenDeleteAlert(false)}
              >
                No, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CreateTask;
