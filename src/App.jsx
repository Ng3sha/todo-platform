
import { useState, useEffect } from 'react';
import Button from './components/Button';

export default function App() {
   const categories = [
    "Work",
    "Personal",
    "Study",
    "Others",
  ];

  // Load tasks from LocalStorage
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  // Add or Update Task
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    if (editingId !== null) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingId
            ? {
                ...task,
                text: trimmedInput,
                category: category,
              }
            : task
        )
      );

      setEditingId(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        text: trimmedInput,
        category: category,
        completed: false,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
    }

    setInput("");
    setCategory("Personal");
  };

  // Delete Task
  const deleteTask = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setInput("");
      setCategory("Personal");
    }
  };

  // Edit Task
  const editTask = (task) => {
    setInput(task.text);
    setCategory(task.category || "Personal");
    setEditingId(task.id);
  };

  // Mark Task as Completed
  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Cancel Editing
  const cancelEdit = () => {
    setInput("");
    setCategory("Personal");
    setEditingId(null);
  };

  // Filter Tasks by Status and Category
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      filter === "All" ||
      (filter === "Completed" && task.completed) ||
      (filter === "Pending" && !task.completed);

    const matchesCategory =
      categoryFilter === "All" ||
      (task.category || "Personal") === categoryFilter;

    return matchesStatus && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Todo List
          </h1>

          <p className="text-gray-500 mt-2">
            Organize your tasks and stay productive.
          </p>
        </header>

        {/* Task Statistics */}
        <section className="grid grid-cols-3 gap-3 mb-8">

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Total Tasks
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-2">
              {totalTasks}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Completed
            </p>

            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {completedTasks}
            </h2>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-2">
              {pendingTasks}
            </h2>
          </div>

        </section>

        {/* Add Task Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">

          <form onSubmit={handleSubmit}>

            <label className="block text-sm font-medium text-gray-700 mb-3">
              {editingId !== null ? "Edit Task" : "Add a New Task"}
            </label>

            {/* Input and Category Dropdown */}
            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 min-w-0 border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full sm:w-36 border border-gray-200 rounded-lg px-3 py-3 bg-white text-sm text-gray-700 outline-none focus:border-gray-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <Button
                type="submit"
                disabled={!input.trim()}
              >
                {editingId !== null ? "Update" : "Add Task"}
              </Button>

              {editingId !== null && (
                <Button onClick={cancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </section>

        {/* Tasks Section */}
        <section className="bg-white border border-gray-200 rounded-xl p-5">

          {/* Task Heading */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Your Tasks List
            </h2>
          </div>

          <div className='flex justify-between'>
            {/* Status Filters */}
            <div className=" mb-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                FILTER BY STATUS
              </p>
              <div className='flex  flex-wrap gap-2'>
                {["All", "Completed", "Pending"].map((item) => (
                  <Button
                    key={item}
                    onClick={() => setFilter(item)}
                    className=''
                  >
                    <span
                      className={
                        filter === item
                          ? "font-semibold"
                          : ""
                      }
                    >
                      {item}
                    </span>
                  </Button>
                ))}
              </div>

            </div>

            {/* Category Filters */}
            <div className="mb-5">

              <p className="text-xs font-medium text-gray-500 mb-2">
                FILTER BY CATEGORY
              </p>

              <div className="flex flex-wrap gap-2">

                {["All", ...categories].map((item) => (
                  <Button
                    key={item}
                    onClick={() => setCategoryFilter(item)}
                  >
                    <span
                      className={
                        categoryFilter === item
                          ? "font-semibold "
                          : ""
                      }
                    >
                      {item}
                    </span>
                  </Button>
                ))}

              </div>
            </div>
          </div>
                
          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <hr className='text-gray-200'/>
              <p className="text-sm text-gray-400">
                {tasks.length === 0
                  ? "No tasks yet. Add your first task!"
                  : "No tasks found in this category."}
              </p>
            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {filteredTasks.map((task) => (

                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
                >

                  {/* Task Information */}
                  <div className="flex items-start gap-3 min-w-0">

                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="w-4 h-4 mt-1 accent-gray-900 cursor-pointer shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm wrap-break-word ${
                          task.completed
                            ? "bold text-green-700"
                            : "text-gray-700"
                        }`}
                      >
                        {task.text}
                      </p>
                      <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1">
                        {task.category || "Personal"}
                      </span>
                    </div>
                  </div>

                  {/* Task Actions */}
                  <div className="flex gap-2 sm:shrink-0">

                    <Button onClick={() => editTask(task)} className='hover:bg-gray-700'>
                      Edit
                    </Button>

                    <Button onClick={() => deleteTask(task.id)} className='hover:bg-red-700'>
                      Delete
                    </Button>
                  </div>
                </div>

              ))}
            </div>

          )}

        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-8">
          Stay organized. One task at a time.
        </footer>

      </div>
    </main>
  );
}
