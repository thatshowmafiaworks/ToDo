"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  LogOut,
  CheckCircle2,
  Circle,
  Calendar,
  User,
  Zap,
  Target,
  Clock,
} from "lucide-react"

interface Todo {
  id: number
  title: string
  description: string
  createdDate: string
  updatedDate: string
  status: "todo" | "in-progress" | "resolved"
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "resolved">("all")
  const [sortBy, setSortBy] = useState<"created" | "updated" | "status">("created")

  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    status: "todo" as const,
  })

  // Load sample data
  useEffect(() => {
    const sampleTodos: Todo[] = [
      {
        id: 1,
        title: "Complete project proposal",
        description: "Write and submit the Q1 project proposal for the new client",
        status: "in-progress",
        createdDate: "2024-01-10T10:00:00Z",
        updatedDate: "2024-01-12T14:30:00Z",
      },
      {
        id: 2,
        title: "Review team performance",
        description: "Conduct quarterly performance reviews for team members",
        status: "resolved",
        createdDate: "2024-01-08T09:00:00Z",
        updatedDate: "2024-01-11T16:45:00Z",
      },
      {
        id: 3,
        title: "Update documentation",
        description: "Update API documentation with latest changes",
        status: "todo",
        createdDate: "2024-01-09T11:15:00Z",
        updatedDate: "2024-01-09T11:15:00Z",
      },
    ]
    setTodos(sampleTodos)
  }, [])

  const handleCreateTodo = () => {
    if (!newTodo.title.trim()) return

    const now = new Date().toISOString()
    const todo: Todo = {
      id: Date.now(),
      title: newTodo.title,
      description: newTodo.description,
      status: newTodo.status,
      createdDate: now,
      updatedDate: now,
    }

    setTodos((prev) => [todo, ...prev])
    setNewTodo({ title: "", description: "", status: "todo" })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTodo = () => {
    if (!editingTodo) return

    const updatedTodo = {
      ...editingTodo,
      updatedDate: new Date().toISOString(),
    }

    setTodos((prev) => prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    setEditingTodo(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const handleStatusChange = (id: number, newStatus: "todo" | "in-progress" | "resolved") => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, status: newStatus, updatedDate: new Date().toISOString() } : todo,
      ),
    )
  }

  const handleLogout = () => {
    window.location.href = "/login"
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true
    return todo.status === filter
  })

  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "updated") {
      return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
    }
    if (sortBy === "status") {
      const statusOrder = { todo: 1, "in-progress": 2, resolved: 3 }
      return statusOrder[a.status] - statusOrder[b.status]
    }
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg"
      case "in-progress":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 shadow-lg"
      case "resolved":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white border-0 shadow-lg"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4" />
      case "in-progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-2 rounded-xl mr-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">ToDo List</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-white/80 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                <User className="h-4 w-4" />
                <span>John Doe</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/80">Total Tasks</p>
                  <p className="text-3xl font-bold text-white">{todos.length}</p>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/80">Todo</p>
                  <p className="text-3xl font-bold text-white">{todos.filter((t) => t.status === "todo").length}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl shadow-lg">
                  <Circle className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/80">In Progress</p>
                  <p className="text-3xl font-bold text-white">
                    {todos.filter((t) => t.status === "in-progress").length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/80">Resolved</p>
                  <p className="text-3xl font-bold text-white">{todos.filter((t) => t.status === "resolved").length}</p>
                </div>
                <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-3 rounded-xl shadow-lg">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
              <SelectTrigger className="w-[140px] bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-sm">
                <SelectItem value="all" className="text-white hover:bg-gray-800">
                  All Tasks
                </SelectItem>
                <SelectItem value="todo" className="text-white hover:bg-gray-800">
                  Todo
                </SelectItem>
                <SelectItem value="in-progress" className="text-white hover:bg-gray-800">
                  In Progress
                </SelectItem>
                <SelectItem value="resolved" className="text-white hover:bg-gray-800">
                  Resolved
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[140px] bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-sm">
                <SelectItem value="created" className="text-white hover:bg-gray-800">
                  Created Date
                </SelectItem>
                <SelectItem value="updated" className="text-white hover:bg-gray-800">
                  Updated Date
                </SelectItem>
                <SelectItem value="status" className="text-white hover:bg-gray-800">
                  Status
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Task</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Add a new task to your todo list. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter task title"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter task description"
                    rows={3}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-white">
                      Status
                    </Label>
                    <Select
                      value={newTodo.status}
                      onValueChange={(value: any) => setNewTodo((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger className="bg-gray-800/90 border-gray-600 text-white hover:bg-gray-700 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/95 border-gray-600 backdrop-blur-sm">
                        <SelectItem value="todo" className="text-white hover:bg-gray-700">
                          Todo
                        </SelectItem>
                        <SelectItem value="in-progress" className="text-white hover:bg-gray-700">
                          In Progress
                        </SelectItem>
                        <SelectItem value="resolved" className="text-white hover:bg-gray-700">
                          Resolved
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleCreateTodo}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Todo List */}
        <div className="space-y-4">
          {sortedTodos.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-12 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle2 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
                <p className="text-white/70 mb-4">
                  {filter === "all"
                    ? "Get started by creating your first task."
                    : `No ${filter.replace("-", " ")} tasks found.`}
                </p>
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            sortedTodos.map((todo) => (
              <Card
                key={todo.id}
                className={`bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
                  todo.status === "resolved" ? "opacity-75" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold ${
                          todo.status === "resolved" ? "line-through text-white/60" : "text-white"
                        }`}
                      >
                        {todo.title}
                      </h3>
                      {todo.description && (
                        <p className={`mt-2 text-sm ${todo.status === "resolved" ? "text-white/50" : "text-white/80"}`}>
                          {todo.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-4">
                        <Badge className={`${getStatusColor(todo.status)} px-3 py-1 flex items-center gap-2`}>
                          {getStatusIcon(todo.status)}
                          {todo.status === "in-progress"
                            ? "In Progress"
                            : todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                        </Badge>
                        <div className="flex items-center text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                          <Calendar className="h-4 w-4 mr-1" />
                          Created: {new Date(todo.createdDate).toLocaleDateString()}
                        </div>
                        {todo.updatedDate !== todo.createdDate && (
                          <div className="flex items-center text-sm text-white/60 bg-white/10 px-3 py-1 rounded-full">
                            <Calendar className="h-4 w-4 mr-1" />
                            Updated: {new Date(todo.updatedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select value={todo.status} onValueChange={(value: any) => handleStatusChange(todo.id, value)}>
                        <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white backdrop-blur-sm hover:bg-white/30 transition-colors">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900/95 border-gray-700 backdrop-blur-sm">
                          <SelectItem value="todo" className="text-white hover:bg-gray-800">
                            Todo
                          </SelectItem>
                          <SelectItem value="in-progress" className="text-white hover:bg-gray-800">
                            In Progress
                          </SelectItem>
                          <SelectItem value="resolved" className="text-white hover:bg-gray-800">
                            Resolved
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingTodo(todo)
                              setIsEditDialogOpen(true)
                            }}
                            className="text-white hover:bg-gray-800"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="text-red-400 hover:bg-gray-800"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Task</DialogTitle>
            <DialogDescription className="text-gray-300">
              Make changes to your task. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {editingTodo && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-white">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={editingTodo.title}
                  onChange={(e) => setEditingTodo((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingTodo.description}
                  onChange={(e) => setEditingTodo((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  rows={3}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-white">
                    Status
                  </Label>
                  <Select
                    value={editingTodo.status}
                    onValueChange={(value: any) => setEditingTodo((prev) => (prev ? { ...prev, status: value } : null))}
                  >
                    <SelectTrigger className="bg-gray-800/90 border-gray-600 text-white hover:bg-gray-700 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800/95 border-gray-600 backdrop-blur-sm">
                      <SelectItem value="todo" className="text-white hover:bg-gray-700">
                        Todo
                      </SelectItem>
                      <SelectItem value="in-progress" className="text-white hover:bg-gray-700">
                        In Progress
                      </SelectItem>
                      <SelectItem value="resolved" className="text-white hover:bg-gray-700">
                        Resolved
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateTodo}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
