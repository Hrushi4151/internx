import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/db';
import Application from '@/models/Application';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const formData = await request.formData();
    const internshipId = formData.get('internshipId');
    const resume = formData.get('resume');

    if (!internshipId || !resume) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has already applied
    const existingApplication = await Application.findOne({
      internship: internshipId,
      student: session.user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied for this internship' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!resume.type.includes('pdf')) {
      return NextResponse.json(
        { message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (resume.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Convert resume file to base64 string
    const arrayBuffer = await resume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = buffer.toString('base64');

    // Create new application with base64 encoded resume
    const application = await Application.create({
      internship: internshipId,
      student: session.user.id,
      resume: {
        filename: resume.name,
        contentType: resume.type,
        data: base64String
      },
      status: 'pending',
      timeline: [{
        round: 1,
        status: 'pending',
        updatedBy: session.user.id,
        updatedAt: new Date()
      }]
    });

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        application: {
          ...application.toObject(),
          resume: {
            filename: application.resume.filename,
            contentType: application.resume.contentType
          } // Don't send base64 data back in response
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { message: 'Failed to submit application' },
      { status: 500 }
    );
  }
} 