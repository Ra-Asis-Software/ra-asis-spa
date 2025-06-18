import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import dayjs from 'dayjs';

export const getProgressData = async (req, res) => {
  try {
    const userId = req.user.id;

    const today = dayjs().endOf('day').toDate();

    // Function to calculate daily progress for N days
    const calculateDailyProgress = async (start, end) => {
      const data = [];

      for (let i = 0; i < 7; i++) {
        const dayStart = dayjs(start).add(i, 'day').startOf('day').toDate();
        const dayEnd = dayjs(start).add(i, 'day').endOf('day').toDate();

        const totalAssignments = await Assignment.countDocuments({
          deadLine: { $gte: dayStart, $lte: dayEnd },
          // dueDate: { $gte: dayStart, $lte: dayEnd },
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
          // dueDate: { $gte: monthStart, $lte: monthEnd },
          deadLine: { $gte: monthStart, $lte: monthEnd }
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

    const weekly = await calculateDailyProgress(dayjs().subtract(6, 'day'), today);
    const lastWeek = await calculateDailyProgress(dayjs().subtract(13, 'day'), dayjs().subtract(7, 'day'));

    const monthly = await calculateMonthlyProgress(0);  // current 4 months
    const lastMonth = await calculateMonthlyProgress(4);  // previous 4 months

    res.json({ weekly, lastWeek, monthly, lastMonth });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch progress data.' });
  }
};
