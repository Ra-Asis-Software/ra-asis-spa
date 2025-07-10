import asyncHandler from 'express-async-handler';
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import dayjs from 'dayjs';

export const getProgressData = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const today = dayjs().endOf('day').toDate();

  // Function to calculate daily progress for 7 days
  const calculateDailyProgress = async (start) => {
    const data = [];

    for (let i = 0; i < 7; i++) {
      const dayStart = dayjs(start).add(i, 'day').startOf('day').toDate();
      const dayEnd = dayjs(start).add(i, 'day').endOf('day').toDate();

      const totalAssignments = await Assignment.countDocuments({
        deadLine: { $gte: dayStart, $lte: dayEnd },
      });

      const submitted = await Submission.countDocuments({
        student: userId,
        submittedAt: { $gte: dayStart, $lte: dayEnd },
      });

      const progress = totalAssignments === 0 ? 0 : (submitted / totalAssignments) * 100;

      data.push({
        name: dayjs(dayStart).format('ddd'),
        progress: Math.round(progress),
      });
    }

    return data;
  };

  // Function to calculate monthly progress for 4 months
  const calculateMonthlyProgress = async (offset = 0) => {
    const data = [];

    for (let i = 3; i >= 0; i--) {
      const month = dayjs().subtract(i + offset, 'month');
      const monthStart = month.startOf('month').toDate();
      const monthEnd = month.endOf('month').toDate();

      const totalAssignments = await Assignment.countDocuments({
        deadLine: { $gte: monthStart, $lte: monthEnd },
      });

      const submitted = await Submission.countDocuments({
        student: userId,
        submittedAt: { $gte: monthStart, $lte: monthEnd },
      });

      const progress = totalAssignments === 0 ? 0 : (submitted / totalAssignments) * 100;

      data.push({
        name: month.format('MMM'),
        progress: Math.round(progress),
      });
    }

    return data;
  };

  const weekly = await calculateDailyProgress(dayjs().subtract(6, 'day'));
  const lastWeek = await calculateDailyProgress(dayjs().subtract(13, 'day'));
  const monthly = await calculateMonthlyProgress(0);      // Current 4 months
  const lastMonth = await calculateMonthlyProgress(4);    // Previous 4 months

  res.json({ weekly, lastWeek, monthly, lastMonth });
});
