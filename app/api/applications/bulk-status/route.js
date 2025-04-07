import { connectDB } from '@/lib/db';
import Application from '@/models/Application';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Notification from '@/models/Notification';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const { studentIds, status, feedback, internshipId } = await req.json();
    await connectDB();

    // Update all selected applications
    const updatePromises = studentIds.map(async (studentId) => {
      const application = await Application.findOne({
        student: studentId,
        internship: internshipId,
      });

      if (!application) return null;

      // Calculate new round number based on status
      let newRound = application.currentRound;
      if (status === 'screening' || status === 'interview') {
        newRound += 1;
      }

      // Update application status and round
      application.status = status;
      application.currentRound = newRound;

      // Add timeline entry
      application.timeline.push({
        round: newRound,
        status,
        feedback,
        updatedBy: session.user.id,
        updatedAt: new Date(),
      });

      await application.save();

      // Create notification for student
      await Notification.create({
        user: studentId,
        title: 'Application Status Update',
        message: `Your application for ${application.internship.title} has been ${status}. ${
          feedback ? `Feedback: ${feedback}` : ''
        }`,
        type: 'application_update',
      });

      return application;
    });

    await Promise.all(updatePromises);

    return successResponse({ message: 'Applications updated successfully' });
  } catch (error) {
    console.error('Bulk status update error:', error);
    return errorResponse('Failed to update applications', 500);
  }
} 