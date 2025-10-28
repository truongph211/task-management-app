import Task from "../models/Task.js";

import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export const getAllTasks = async (req, res) => {
  const { filter = "today" } = req.query;
  const now = new Date();

  const startDateMap = {
    today: startOfDay(now),
    week: startOfWeek(now, { weekStartsOn: 1 }), // Monday
    month: startOfMonth(now),
    all: null,
  };
  const startDate = startDateMap[filter] ?? startDateMap.today;

  const query = startDate ? { createdAt: { $gte: startDate } } : {};

  try {
    const result = await Task.aggregate([
      { $match: query },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
          completeCount: [
            { $match: { status: "complete" } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const tasks = result[0].tasks;
    const activeCount = result[0].activeCount[0]?.count || 0;
    const completeCount = result[0].completeCount[0]?.count || 0;

    res.status(200).json({ tasks, activeCount, completeCount });
  } catch (error) {
    console.error("Error occurred while fetching tasks", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title });

    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error occurred while creating task", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, status, completedAt } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        status,
        completedAt,
      },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error occurred while updating task", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(deleteTask);
  } catch (error) {
    console.error("Error occurred while deleting task", error);
    res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
