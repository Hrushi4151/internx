import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();
    const userData = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'Email already registered' }),
        { status: 400 }
      );
    }

    // Validate password
    if (userData.password.length < 6) {
      return new Response(
        JSON.stringify({ message: 'Password must be at least 6 characters long' }),
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    // Create user
    const user = new User(userData);
    await user.save();

    return new Response(
      JSON.stringify({ message: 'Registration successful' }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(
      JSON.stringify({ message: 'An error occurred during registration' }),
      { status: 500 }
    );
  }
} 