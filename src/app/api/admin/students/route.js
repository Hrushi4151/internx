import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Application from '@/models/Application';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    await connectDB();

    // Get all students
    const students = await User.find({ role: 'student' })
      .select('name email createdAt')
      .lean();

    // Get application statistics for each student
    const applicationStats = await Application.aggregate([
      {
        $group: {
          _id: '$student',
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] }
          },
          rejected: {
            $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
          }
        }
      }
    ]);

    // Create a map of student ID to their stats
    const statsMap = applicationStats.reduce((acc, stat) => {
      acc[stat._id.toString()] = {
        total: stat.total,
        pending: stat.pending,
        accepted: stat.accepted,
        rejected: stat.rejected
      };
      return acc;
    }, {});

    // Combine student data with their stats
    const studentsWithStats = students.map(student => ({
      ...student,
      stats: statsMap[student._id.toString()] || {
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0
      }
    }));

    return successResponse(studentsWithStats);
  } catch (error) {
    console.error('Students fetch error:', error);
    return errorResponse('Failed to fetch students', 500);
  }
} 