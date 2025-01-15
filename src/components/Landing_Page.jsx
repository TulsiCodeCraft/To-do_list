import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { addTask, deleteTask, updateTask, toggleComplete, toggleImportant } from '../store/taskSlice';
import { fetchWeather } from '../store/weatherSlice';
import { Bell, RotateCcw, CalendarIcon, Menu, Search, LayoutGrid, Moon, Sun, Star, Trash2, Edit2, X, Plus, ClipboardList, Users, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ProgressCircle from './ProgressCircle';

const LandingPage = () => {
  const dispatch = useDispatch();
  const history = useNavigate();
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const tasks = useSelector(state => state.tasks.tasks);
  const weather = useSelector(state => state.weather);
  const [newTask, setNewTask] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [city, setCity] = useState('London');
  const [showCalendar, setShowCalendar] = useState(false);
  const [taskDueDate, setTaskDueDate] = useState(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);


  // Modify the handleStartEdit function
  const handleStartEdit = (e, task) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  // Modify the handleSaveEdit function
  const handleSaveEdit = (e, taskId) => {
    e.stopPropagation();
    if (editingText.trim()) {
      handleUpdateTask({ ...tasks.find(task => task.id === taskId), text: editingText.trim() });
      setEditingTaskId(null);
      setEditingText('');
    }
  };

  // Add a handle cancel edit function
  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingTaskId(null);
    setEditingText('');
  };

  // Handle keyboard events for the edit input
  const handleEditKeyPress = (e, taskId) => {
    if (e.key === 'Enter') {
      handleSaveEdit(e, taskId);
    } else if (e.key === 'Escape') {
      handleCancelEdit(e);
    }
  };

  useEffect(() => {
    dispatch(fetchWeather(city));
  }, [dispatch, city]);

  // Split tasks into pending and completed
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasksCount = completedTasks.length;

  const completionPercentage = totalTasks ? (completedTasksCount / totalTasks) * 100 : 0;



  const getStrokeColor = () => {
    // Always return light green for background circle
    if (!completionPercentage) return '#4ADE80';

    // For progress circle, transition from light to dark green based on completion
    const lightGreen = '#4ADE80';
    const darkGreen = '#22C55E';

    if (completionPercentage === 0) return lightGreen;
    if (completionPercentage === 100) return darkGreen;
    return darkGreen; // Use dark green for any progress
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(addTask({
        id: Date.now(),
        text: newTask.trim(),
        completed: false,
        important: false,
        notes: '',
        dueDate: null
      }));
      setNewTask('');
    }
  };

  const handleUpdateTask = (updatedTask) => {
    dispatch(updateTask(updatedTask));
  };

  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
    setShowTaskDetail(false);
  };

  const handleToggleComplete = (taskId) => {
    dispatch(toggleComplete(taskId));
  };

  const handleToggleImportant = (taskId) => {
    dispatch(toggleImportant(taskId));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setTaskDueDate(task.dueDate);
    setTaskNotes(task.notes || '');
    setShowTaskDetail(true);
  };



  // Handle search icon click
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => document.getElementById('searchInput')?.focus(), 100);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter and sort tasks based on search query
  const filterAndSortTasks = (tasksList) => {
    if (!searchQuery.trim()) return tasksList;

    return tasksList
      .filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        // Prioritize exact matches
        const aExactMatch = a.text.toLowerCase() === searchQuery.toLowerCase();
        const bExactMatch = b.text.toLowerCase() === searchQuery.toLowerCase();
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        // Then prioritize starts with
        const aStartsWith = a.text.toLowerCase().startsWith(searchQuery.toLowerCase());
        const bStartsWith = b.text.toLowerCase().startsWith(searchQuery.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Then prioritize important tasks
        if (a.important && !b.important) return -1;
        if (!a.important && b.important) return 1;

        return 0;
      });
  };


  


  const TaskDetailPanel = () => (
    <div className={`fixed top-0 right-0 h-full w-full md:w-1/3 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-lg transform transition-transform duration-300 ${showTaskDetail ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="p-6 h-full overflow-y-auto">
        <button
          onClick={() => setShowTaskDetail(false)}
          className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <X className="w-5 h-5" />
        </button>

        {selectedTask && (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={selectedTask.completed}
                  onChange={() => handleToggleComplete(selectedTask.id)}
                  className="w-5 h-5 border-2 border-green-500 rounded checked:bg-green-500"
                />
                <h2 className="text-xl font-semibold">{selectedTask.text}</h2>
              </div>

              <div className="space-y-3">
                <button className={`w-full text-left px-4 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center gap-2`}>
                  <Plus className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  Add Step
                </button>

                <button className={`w-full text-left px-4 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center gap-2`}>
                  <Bell className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  Set Reminder
                </button>

                <button
                  className={`w-full text-left px-4 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} flex items-center gap-2`}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                  {taskDueDate ? new Date(taskDueDate).toLocaleDateString() : 'Add Due Date'}
                </button>

                {showCalendar && (
                  <div className={`p-3 border rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg`}>
                    <DatePicker
                      selected={taskDueDate}
                      onChange={(date) => {
                        setTaskDueDate(date);
                        handleUpdateTask({ ...selectedTask, dueDate: date });
                        setShowCalendar(false);
                      }}
                      inline
                      className={isDarkMode ? 'dark-theme' : ''}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <textarea
                placeholder="Add Notes"
                value={taskNotes}
                onChange={(e) => {
                  setTaskNotes(e.target.value);
                  handleUpdateTask({ ...selectedTask, notes: e.target.value });
                }}
                className={`w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-white placeholder-gray-500'
                  }`}
              />
            </div>

            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Created Today
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Menu className="w-6 h-6" />
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white font-bold">Do</span>
              </div>
              <span className="ml-2 font-bold text-green-500">It</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`${isSearchOpen ? 'w-64' : 'w-0'} transition-all duration-300 p-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
                />
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className={`p-2 rounded-full ${isSearchOpen ? 'bg-green-500 text-white' : ''}`}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <LayoutGrid className="w-5 h-5" />
            <button onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => dispatch(logout())}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => history.push('/register')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 p-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-6">
          {/* Profile Block */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3">
                <img src={user.avatar || 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png'} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <span className="font-medium">Hey, {user.username}</span>
            </div>

            <nav className="space-y-2">
              <button className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <ClipboardList className="w-5 h-5" />
                <span>All Tasks ({totalTasks})</span>
              </button>
              <button className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${isDarkMode ? 'bg-gray-700' : 'bg-green-50 text-green-700'}`}>
                <Calendar className="w-5 h-5" />
                <span>Today ({pendingTasks.length})</span>
              </button>
              <button className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <Star className="w-5 h-5" />
                <span>Important ({tasks.filter(t => t.important).length})</span>
              </button>
              <button className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <CalendarIcon className="w-5 h-5" />
                <span>Planned</span>
              </button>
              <button className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                <Users className="w-5 h-5" />
                <span>Assigned to me</span>
              </button>
            </nav>
          </div>

          {/* Add List Block */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <button className="w-full flex items-center space-x-2 text-green-500 hover:text-green-600">
              <Plus className="w-5 h-5" />
              <span>Add List</span>
            </button>
          </div>

          {/* Progress Circle Block */}
          <ProgressCircle tasks={tasks} isDarkMode={isDarkMode} />

          {/* Weather Block */}
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-sm`}>
            <h3 className="text-lg font-semibold mb-4">Weather</h3>
            {weather.loading && <p>Loading weather data...</p>}
            {weather.error && <p className="text-red-500">Error: {weather.error}</p>}
            {weather.data && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{Math.round(weather.data.main.temp)}°C</p>
                    <p>{weather.data.name}</p>
                  </div>
                  <img
                    src={`http://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                    alt={weather.data.weather[0].description}
                    className="w-16 h-16"
                  />
                </div>
                <p className="mt-2">{weather.data.weather[0].description}</p>
              </div>
            )}
            <div className="relative">
              <input
                type="text"
                placeholder="Change city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-2 pr-10 border-2 border-green-500 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm mb-6`}>
          <div className="flex items-center space-x-4 mb-4">
              <Bell className="w-5 h-5" />
              <RotateCcw className="w-5 h-5" />
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add A Task"
                className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <button
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                onClick={handleAddTask}
              >
                ADD TASK
              </button>
            </div>
          </div>

          <div className={`p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm`}>
          {searchQuery && (
              <div className="mb-4 text-sm text-gray-500">
                Found {pendingTasks.length + completedTasks.length} tasks matching "{searchQuery}"
              </div>
            )}
            {/* Pending Tasks */}

            <div className="space-y-4 mb-8">
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } cursor-pointer`}
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task.id);
                      }}
                      className="w-5 h-5 border-2 border-green-500 rounded checked:bg-green-500"
                    />
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => handleEditKeyPress(e, task.id)}
                        onBlur={(e) => handleSaveEdit(e, task.id)}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 bg-transparent border-b-2 border-green-500 focus:outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}
                        autoFocus
                      />
                    ) : (
                      <span className="flex-1">{task.text}</span>
                    )}
                    {task.dueDate && (
                      <span className="text-sm text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleImportant(task.id);
                      }}
                      className={`p-2 ${task.important ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    >
                      <Star className="w-5 h-5" fill={task.important ? "currentColor" : "none"} />
                    </button>
                    {editingTaskId === task.id ? (
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleStartEdit(e, task)}
                        className="p-2 text-gray-400 hover:text-blue-500"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Completed</h3>
                <div className="space-y-4">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                        } opacity-50 cursor-pointer`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(task.id);
                          }}
                          className="w-5 h-5 border-2 border-green-500 rounded checked:bg-green-500"
                        />
                        <span className="line-through">{task.text}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTask(task.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Detail Panel */}
      <TaskDetailPanel />
    </div>
  );
};

export default LandingPage;

