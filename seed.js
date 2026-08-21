require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/user.model');
const Category = require('./models/category.model');
const Event = require('./models/event.model');
const Registration = require('./models/registration.model');
const Message = require('./models/message.model');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for seeding...');

    // مسح قاعدة البيانات بالكامل للتأكد من عدم وجود تكرار
    await mongoose.connection.dropDatabase();
    console.log('Old database cleared successfully.');

    // 1. إنشاء حساب Admin وحساب Attendee
    const hashedPassword = await bcrypt.hash('123456', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventpulse.com',
      password: hashedPassword,
      role: 'admin'
    });

    const attendee = await User.create({
      name: 'Sara Ahmed',
      email: 'sara@gmail.com',
      password: hashedPassword,
      role: 'attendee'
    });

    // 2. إنشاء تصنيفات (Categories)
    const categories = await Category.insertMany([
      { name: 'Tech', description: 'Technology and Software Conferences' },
      { name: 'Music', description: 'Live Concerts and Festivals' },
      { name: 'Sports', description: 'Sports Tournaments and Matches' }
    ]);

    // 3. إنشاء فعاليات (Events)
    await Event.insertMany([
      {
        title: 'Node.js Summit 2026',
        description: 'A comprehensive backend conference for Node.js developers.',
        category: categories[0]._id,
        date: new Date('2026-10-15'),
        city: 'Cairo',
        venue: 'Greek Campus',
        capacity: 100,
        organizer: admin._id
      },
      {
        title: 'Summer Music Fest',
        description: 'Enjoy live performances from top Indie bands.',
        category: categories[1]._id,
        date: new Date('2026-09-01'),
        city: 'Alexandria',
        venue: 'Alexandria Stadium',
        capacity: 50,
        organizer: admin._id
      }
    ]);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();