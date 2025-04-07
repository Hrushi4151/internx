import { connectDB } from '@/lib/db';
import Application from '@/models/Application';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    await connectDB();

    // For admin users, return all applications for the internship
    if (session.user.role === 'admin') {
      const applications = await Application.find({ 
        internship: params.id 
      })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

      return successResponse(applications);
    }

    // For students, only return their own application
    const application = await Application.findOne({ 
      internship: params.id,
      student: session.user.id 
    }).populate('student', 'name email');

    return successResponse(application ? [application] : []);
  } catch (error) {
    console.error('Error fetching internship applications:', error);
    return errorResponse('Failed to fetch applications', 500);
  }
} 