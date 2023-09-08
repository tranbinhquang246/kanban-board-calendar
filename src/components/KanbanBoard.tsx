import PlusIcon from "../icons/PlusIcon";
import { useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  format,
  startOfWeek,
  addDays,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isSameDay,
  subMonths,
  addMonths,
} from "date-fns";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { createArrayOfObjects, flattenArray } from "../components/utils/index";

const defaultTasks: Task[] = [
  {
    id: "1",
    columnId: "2023/09/06",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "2023/09/06",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "2023/09/07",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "2023/09/08",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "2023/10/10",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "2023/09/03",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "2023/09/05",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "2023/09/20",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "2023/09/16",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "2023/09/22",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "2023/10/11",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "2023/11/04",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "2023/11/05",
    content: "Design and implement responsive UI",
  },
];

function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [activeDate, setActiveDate] = useState(new Date());

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  const generateDatesForCurrentWeek = (date: any) => {
    let currentDate = date;
    const week = [];
    for (let day = 0; day < 7; day++) {
      week.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }
    return week;
  };

  const getDates = () => {
    const startOfTheSelectedMonth = startOfMonth(activeDate);
    const endOfTheSelectedMonth = endOfMonth(activeDate);
    const startDate = startOfWeek(startOfTheSelectedMonth);
    const endDate = endOfWeek(endOfTheSelectedMonth);

    let currentDate = startDate;

    const allWeeks = [];

    while (currentDate <= endDate) {
      allWeeks.push(generateDatesForCurrentWeek(currentDate));
      currentDate = addDays(currentDate, 7);
    }

    return allWeeks;
  };

  useEffect(() => {
    console.log(getDates());
    setColumns(createArrayOfObjects(flattenArray(getDates())));
  }, [activeDate]);

  return (
    <div
      className="
        m-auto
        
        min-h-screen
        w-full
        items-center
        overflow-x-auto
        overflow-y-hidden
        px-[40px]
        bg-white
    "
    >
      <div className="flex text-black px-10 pt-20">
        <div className="flex text-black w-1/2  gap-4">
          <button className="border border-solid border-black w-40 rounded-xl bg-gray-300">
            CREATE
          </button>
          <button className="border-[2px] border-solid border-black w-40 rounded-xl">
            UPDATE
          </button>
        </div>
        <div>
          <h3 className="text-2xl mb-2">CALENDAR</h3>
        </div>
      </div>
      <div className="flex flex-col  items-center h-[80vh] mx-4 mb-10 border border-solid border-black overflow-x-auto py-5">
        <div>
          <div className="text-black">
            <p className="text-center ml-24 text-lg">
              {format(activeDate, "yyyy-MM")}
            </p>
          </div>
          <div className="text-black flex justify-end gap-2">
            <span> Choosen</span>
            <select
              name="lang"
              id="lang-select"
              className="border border-solid border-black w-[200px] mb-10"
            >
              <option value="">--Choosen a day--</option>
              <option value="csharp">C#</option>
              <option value="cpp">C++</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="js">Javascript</option>
              <option value="dart">Dart</option>
            </select>
          </div>
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="m-auto flex justify-between">
              <div className="grid grid-cols-7 grid-rows-2 justify-between border border-solid border-gray-400">
                <SortableContext items={columnsId}>
                  {columns.map((col) => (
                    <ColumnContainer
                      key={col.id}
                      column={col}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      createTask={createTask}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      tasks={tasks.filter((task) => task.columnId === col.id)}
                    />
                  ))}
                </SortableContext>
              </div>
            </div>

            {createPortal(
              <DragOverlay>
                {activeColumn && (
                  <ColumnContainer
                    column={activeColumn}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter(
                      (task) => task.columnId === activeColumn.id
                    )}
                  />
                )}
                {activeTask && (
                  <TaskCard
                    task={activeTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                )}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
          <div className="text-black pl-20 flex gap-x-48">
            <button className="w-[200px] border border-solid border-black rounded-xl h-[40px] mt-5">
              SAVE
            </button>
            <div className="flex gap-32 mt-5">
              {/* Nút "Prev" (Trang trước) */}
              <svg
                onClick={() => setActiveDate(subMonths(activeDate, 1))}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="40"
                viewBox="0 0 6.016 10.015"
              >
                <path
                  id="shitayazirushi"
                  d="M5.23,7.21a.75.75,0,0,1,1.06.02L10,11.168,13.71,7.23a.75.75,0,1,1,1.08,1.04l-4.25,4.5a.75.75,0,0,1-1.08,0L5.21,8.27a.75.75,0,0,1,.02-1.06Z"
                  transform="translate(13 -5) rotate(90)"
                  fill="#6b7280"
                  fill-rule="evenodd"
                />
              </svg>

              {/* Nút "Next" (Trang sau) */}
              <svg
                onClick={() => setActiveDate(addMonths(activeDate, 1))}
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="40"
                viewBox="0 0 6.016 10.015"
              >
                <path
                  id="shitayazirushi"
                  d="M5.23,7.21a.75.75,0,0,1,1.06.02L10,11.168,13.71,7.23a.75.75,0,1,1,1.08,1.04l-4.25,4.5a.75.75,0,0,1-1.08,0L5.21,8.27a.75.75,0,0,1,.02-1.06Z"
                  transform="translate(-6.984 15.016) rotate(-90)"
                  fill="#6b7280"
                  fill-rule="evenodd"
                />
              </svg>
            </div>
            <button className="w-[200px] text-white border border-solid border-black rounded-xl h-[40px] mt-5 bg-black">
              SAVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
