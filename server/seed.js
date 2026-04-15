const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all existing users to start fresh
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create default admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@iems.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Default admin created:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);

    // Create a sample faculty
    const faculty = await User.create({
      name: 'Dr. Faculty',
      email: 'faculty@iems.com',
      password: 'faculty123',
      role: 'faculty',
    });

    console.log('✅ Sample faculty created:');
    console.log(`   Email: ${faculty.email}`);
    console.log(`   Password: faculty123`);

    // Create a sample student
    const student = await User.create({
      name: 'John Student',
      email: 'student@iems.com',
      password: 'student123',
      role: 'student',
    });

    console.log('✅ Sample student created:');
    console.log(`   Email: ${student.email}`);
    console.log(`   Password: student123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedAdmin();
