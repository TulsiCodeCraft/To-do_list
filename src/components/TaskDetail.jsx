import { useState } from 'react';
import { X, Plus, Bell, CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function TaskDetail({ task, onClose, onUpdate }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [notes, setNotes] = useState(task.notes || '');

  const handleDateSelect = (date) => {
    setDueDate(date);
    setShowCalendar(false);
    onUpdate({ ...task, dueDate: date });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onUpdate({ ...task, completed: !task.completed })}
              className="w-5 h-5 border-2 border-green-500 rounded checked:bg-green-500"
            />
            <h2 className="text-xl font-semibold">{task.text}</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Plus className="w-4 h-4 text-gray-500" />
              Add Step
            </button>
            
            <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Bell className="w-4 h-4 text-gray-500" />
              Set Reminder
            </button>
            
            <button 
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              {dueDate ? dueDate.toLocaleDateString() : 'Add Due Date'}
            </button>

            {showCalendar && (
              <div className="p-3 border rounded-lg bg-white shadow-lg">
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => handleDateSelect(date)}
                  inline
                />
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Add Notes"
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              onUpdate({ ...task, notes: e.target.value });
            }}
            className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="text-sm text-gray-500">
          Created Today
        </div>
      </div>
    </div>
  );
}

