import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";


const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState([]);
  const [completeTaskCount, setCompleteTaskCount] = useState([]);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const fetchTasks = async () => {
  try {
    const res = await api.get(`/tasks?filter=${dateQuery}`);
    console.log("Fetched tasks:", res.data);
    setTaskBuffer(Array.isArray(res.data.tasks) ? res.data.tasks : []);
    setActiveTaskCount(res.data.activeCount || 0);
    console.log("Fetch active count:", res.data.activeCount);
    setCompleteTaskCount(res.data.completeCount || 0);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    toast.error("Error fetching tasks.");
  }
};

  const handleTaskChanged = () => {
    fetchTasks();
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // biến
  const filteredTasks = (taskBuffer || []).filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );

  if (visibleTasks.length === 0) {
    handlePrev();
  }

  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);
  return (
    <div className="min-h-screen w-full bg-[#fff7ed] relative">
      {/* Peachy Sunrise Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(180deg, 
          rgba(255,247,237,1) 0%, 
          rgba(255,237,213,0.8) 25%, 
          rgba(254,215,170,0.6) 50%, 
          rgba(251,146,60,0.4) 75%, 
          rgba(249,115,22,0.3) 100%
        ),
        radial-gradient(circle at 20% 80%, rgba(255,255,255,0.6) 0%, transparent 40%),
        radial-gradient(circle at 80% 20%, rgba(254,215,170,0.5) 0%, transparent 50%),
        radial-gradient(circle at 60% 60%, rgba(252,165,165,0.3) 0%, transparent 45%)
      `,
        }}
      />
      <div className="container pt-8 mx-auto relative z-10 pb-16">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          <Header />
          <AddTask handleNewTaskAdded={handleTaskChanged} />
          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
          />

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
