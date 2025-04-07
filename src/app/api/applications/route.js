import { connectDB } from '@/lib/db';
import Application from '@/models/Application';
import Internship from '@/models/Internship';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { uploadFile } from '@/lib/upload';
import Notification from '@/models/Notification';
import { uploadConfig } from '@/config/upload';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    await connectDB();
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('internship', 'title company')
      .sort({ createdAt: -1 });

    return successResponse(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return errorResponse('Failed to fetch applications', 500);
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'student') {
      return errorResponse('Unauthorized', 401);
    }

    const formData = await req.formData();
    const internshipId = formData.get('internshipId');
    const resumeFile = formData.get('resume');

    if (!internshipId || !resumeFile) {
      return errorResponse('Missing required fields', 400);
    }

    await connectDB();

    // Check if internship exists and is still open
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return errorResponse('Internship not found', 404);
    }

    // Check if internship deadline has passed
    const deadline = new Date(internship.deadline);
    const now = new Date();
    if (now > deadline) {
      return errorResponse('Internship application deadline has passed', 400);
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      student: session.user.id,
      internship: internshipId,
    });

    if (existingApplication) {
      return errorResponse('You have already applied for this internship', 400);
    }

    // Process resume file
    if (!resumeFile.type.includes('pdf')) {
      return errorResponse('Only PDF files are allowed', 400);
    }

    if (resumeFile.size > 5 * 1024 * 1024) { // 5MB
      return errorResponse('File size must be less than 5MB', 400);
    }

    // Upload file to storage service
    const fileUrl = await uploadFile(resumeFile, {
      folder: 'resumes',
      allowedTypes: ['application/pdf'],
      maxSize: 5 * 1024 * 1024 // 5MB
    });

    // Create new application
    const application = await Application.create({
      student: session.user.id,
      internship: internshipId,
      resume: {
        url: fileUrl,
        filename: resumeFile.name
      },
      timeline: [{
        round: 1,
        status: 'pending',
        updatedBy: session.user.id,
        updatedAt: new Date()
      }]
    });

    // Create notification for admin
    await Notification.create({
      title: 'New Application',
      message: `A new application has been submitted for "${internship.title}"`,
      type: 'application',
      recipient: internship.postedBy,
      applicationId: application._id
    });

    return successResponse(application);
  } catch (error) {
    console.error('Application submission error:', error);
    return errorResponse('Failed to submit application', 500);
  }
} 