import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;

  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
  className?: String;
}

function ColumnContainer({
  column,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
  className,
}: Props) {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
      bg-gray-50
      opacity-40
      border-2
      border-pink-500
      w-[150px]
      h-[250px]
      max-h-[250px]
      flex
      flex-col
      "
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 w-[150px] h-[250px] max-h-[250px] border-[2px] border-gray-500 flex flex-col ${className}`}
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-white
      text-md
      h-[30px]
      cursor-grab
      rounded-b-none
      p-3
      font-bold
      border-columnBackgroundColor
      border-solid
      border
      text-black
      flex
      items-center
      justify-center
      "
      >
        <div className="flex gap-2   text-center justify-center">
          {!editMode && column.title}
          {editMode && <p className="w-full text-center">{column.title}</p>}
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-2 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer */}
      {/* <button
        className="flex gap-2 items-center border-columnBackgroundColor  border px-4 border-x-columnBackgroundColor  text-rose-500"
        onClick={() => {
          createTask(column.id);
        }}
      >
        <PlusIcon />
        Add task
      </button> */}
    </div>
  );
}

export default ColumnContainer;
