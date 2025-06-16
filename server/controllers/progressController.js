import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import dayjs from 'dayjs';

export const getProgressData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Dummy date generator to replace with actual aggregation)
    const generateData = (days, startOffset = 0) => {
      return Array.from({ length: days }, (_, i) => {
        const date = dayjs().subtract(startOffset + (days - i - 1), 'day');
        return {
          name: date.format('ddd'),
          progress: Math.floor(Math.random() * 100),
        };
      });
    };

    const weekly = generateData(7);
    const lastWeek = generateData(7, 7);

    const monthly = ["Jan", "Feb", "Mar", "Apr"].map(month => ({
      name: month,
      progress: Math.floor(Math.random() * 100),
    }));

    const lastMonth = ["Sep", "Oct", "Nov", "Dec"].map(month => ({
      name: month,
      progress: Math.floor(Math.random() * 100),
    }));

    res.json({ weekly, lastWeek, monthly, lastMonth });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch progress data.' });
  }
};
