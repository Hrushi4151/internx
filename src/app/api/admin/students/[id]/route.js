import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    await connectDB();
    const student = await User.findOne({ 
      _id: params.id,
      role: 'student'
    }).select('name email createdAt');

    if (!student) {
      return errorResponse('Student not found', 404);
    }

    return successResponse(student);
  } catch (error) {
    console.error('Student fetch error:', error);
    return errorResponse('Failed to fetch student', 500);
  }
} 