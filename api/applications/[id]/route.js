import { connectDB } from '@/lib/db';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const data = await req.json();
    await connectDB();

    const application = await Application.findById(params.id)
      .populate('internship')
      .populate('student');

    if (!application) {
      return errorResponse('Application not found', 404);
    }

    // Verify the admin owns this internship
    if (application.internship.postedBy.toString() !== session.user.id) {
      return errorResponse('Not authorized to update this application', 403);
    }

    // Update status
    application.status = data.status;
    await application.save();

    // Create notification for student
    const notification = new Notification({
      title: `Application ${data.status}`,
      message: `Your application for "${application.internship.title}" has been ${data.status}`,
      type: 'application',
      recipient: application.student._id,
    });
    await notification.save();

    return successResponse(application);
  } catch (error) {
    console.error('Application update error:', error);
    return errorResponse('Failed to update application', 500);
  }
}

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return errorResponse('Unauthorized', 401);
    }

    await connectDB();

    const application = await Application.findById(params.id)
      .populate('internship', 'title company location stipend duration')
      .populate('student', 'name email')
      .populate('timeline.updatedBy', 'name')
      .lean();

    if (!application) {
      return errorResponse('Application not found', 404);
    }

    // For students, ensure they can only access their own applications
    if (session.user.role === 'student' && application.student._id.toString() !== session.user.id) {
      return errorResponse('Unauthorized', 401);
    }

    // Format dates
    const formattedApplication = {
      ...application,
      createdAt: application.createdAt.toISOString(),
      timeline: application.timeline.map(item => ({
        ...item,
        updatedAt: item.updatedAt.toISOString()
      }))
    };

    return successResponse(formattedApplication);
  } catch (error) {
    console.error('Error fetching application:', error);
    return errorResponse('Failed to fetch application', 500);
  }
} 