import { connectDB } from '@/lib/db';
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
    const applications = await Application.find({
      'internship.postedBy': session.user.id,
    })
      .sort({ createdAt: -1 })
      .populate('student', 'name email')
      .populate('internship', 'title company');

    return successResponse(applications);
  } catch (error) {
    console.error('Admin applications fetch error:', error);
    return errorResponse('Failed to fetch applications', 500);
  }
} 