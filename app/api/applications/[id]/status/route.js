import { connectDB } from '@/lib/db';
import Application from '@/models/Application';
import Notification from '@/models/Notification';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const { status, feedback, round } = await req.json();
    await connectDB();

    const application = await Application.findById(params.id)
      .populate('student', 'name email')
      .populate('internship', 'title');

    if (!application) {
      return errorResponse('Application not found', 404);
    }

    // Update application status
    application.status = status;
    
    // Update round if provided
    if (round) {
      application.currentRound = round;
    }

    // Add to timeline
    application.timeline.push({
      round: round || application.currentRound,
      status,
      feedback,
      updatedBy: session.user.id,
      updatedAt: new Date()
    });

    await application.save();

    // Create notification for the student
    const notificationTitle = `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`;
    let notificationMessage = `Your application for "${application.internship.title}" has been ${status}`;
    
    if (status === 'screening' || status === 'interview') {
      notificationMessage = `Your application for "${application.internship.title}" has moved to ${status} round`;
    }

    if (feedback) {
      notificationMessage += `. Feedback: ${feedback}`;
    }

    await Notification.create({
      title: notificationTitle,
      message: notificationMessage,
      type: 'application',
      recipient: application.student._id,
      applicationId: application._id
    });

    return successResponse(application);
  } catch (error) {
    console.error('Application status update error:', error);
    return errorResponse('Failed to update application status', 500);
  }
} 