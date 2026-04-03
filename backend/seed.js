import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const users = [
  { name: 'Alex Chen',     username: 'alexchen',   email: 'alex@demo.com',   password: 'demo1234', bio: 'Full-stack dev 🚀' },
  { name: 'Sara Malik',    username: 'saramalik',  email: 'sara@demo.com',   password: 'demo1234', bio: 'UI/UX Designer ✨' },
  { name: 'Dev Kumar',     username: 'devkumar',   email: 'dev@demo.com',    password: 'demo1234', bio: 'Open source lover 💻' },
  { name: 'Priya Sharma',  username: 'priyasharma',email: 'priya@demo.com',  password: 'demo1234', bio: 'React enthusiast 🌐' },
  { name: 'James Wilson',  username: 'jameswilson',email: 'james@demo.com',  password: 'demo1234', bio: 'Backend engineer ⚙️' },
];

const postTemplates = [
  {
    text: '🚀 Just shipped my first full-stack app using React + Node.js + MongoDB! The feeling of seeing it live is unreal. #WebDev #ReactJS #NodeJS',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
  },
  {
    text: '✨ UI tip of the day: White space is not empty space — it\'s breathing room for your design. Less is always more. #UIDesign #DesignTips',
    image: '',
  },
  {
    text: '💡 Just learned about MongoDB aggregation pipelines and my mind is blown. You can do so much without writing complex backend logic! #MongoDB #Database',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
  },
  {
    text: 'Working late on a new open source project 🌙 Sometimes the best ideas come after midnight. Who else codes better at night? #OpenSource #DevLife',
    image: '',
  },
  {
    text: '🎯 3 things that made me a better developer:\n1. Reading other people\'s code\n2. Breaking things on purpose\n3. Writing documentation first\n\n#JavaScript #Programming #Tips',
    image: '',
  },
  {
    text: 'Beautiful sunset from my home office today 🌅 Remote work has its perks! #RemoteWork #WorkFromHome',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  },
  {
    text: '⚡ Performance tip: Always debounce your search inputs. A 300ms delay can save hundreds of unnecessary API calls. #WebPerformance #ReactJS',
    image: '',
  },
  {
    text: 'Just hit 100 GitHub stars on my project! 🌟 Never thought anyone would use something I built for fun. Thank you all! #OpenSource #GitHub #Grateful',
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
  },
  {
    text: 'Hot take: CSS is actually fun once you stop fighting it and start working with it 😄 #CSS #WebDev #FrontEnd',
    image: '',
  },
  {
    text: '📸 My desk setup after the upgrade. Dual monitors changed everything for productivity! #DeskSetup #Developer #Productivity',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80',
  },
  {
    text: 'Reminder: It\'s okay to not know everything. Google is a tool, not a cheat code. Every senior dev uses it daily. #DevLife #Programming',
    image: '',
  },
  {
    text: '🎨 Just redesigned my portfolio from scratch. Clean, minimal, fast. Sometimes starting over is the best refactor. #Portfolio #Design #WebDev',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
  },
];

const comments = [
  'This is amazing! 🔥',
  'Great work, keep it up!',
  'Totally agree with this 💯',
  'This helped me so much, thanks!',
  'Saved this for later 📌',
  'Couldn\'t agree more!',
  'This is exactly what I needed today',
  'Love this perspective ✨',
  'Following for more content like this!',
  'Sharing this with my team right now',
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing seed data
    await User.deleteMany({ email: { $regex: '@demo.com' } });
    console.log('🗑  Cleared old seed users');

    // Create users (password hashing handled by pre-save hook)
    const createdUsers = await User.insertMany(
      await Promise.all(users.map(async u => ({
        ...u,
        password: await bcrypt.hash(u.password, 12),
      })))
    );
    console.log(`👥 Created ${createdUsers.length} seed users`);

    // Delete posts by seed users
    const seedUserIds = createdUsers.map(u => u._id);
    await Post.deleteMany({ 'author.userId': { $in: seedUserIds } });

    // Create posts
    const postsToCreate = postTemplates.map((template, i) => {
      const author = createdUsers[i % createdUsers.length];
      const otherUsers = createdUsers.filter(u => u._id !== author._id);

      // Add some likes
      const likeCount = Math.floor(Math.random() * 8) + 1;
      const likes = otherUsers.slice(0, likeCount).map(u => ({
        userId: u._id,
        username: u.username,
      }));

      // Add some comments
      const commentCount = Math.floor(Math.random() * 4) + 1;
      const postComments = otherUsers.slice(0, commentCount).map((u, ci) => ({
        userId: u._id,
        username: u.username,
        name: u.name,
        avatar: '',
        text: comments[(i + ci) % comments.length],
        createdAt: new Date(Date.now() - Math.random() * 86400000),
      }));

      return {
        author: {
          userId: author._id,
          name: author.name,
          username: author.username,
          avatar: '',
        },
        text: template.text,
        image: template.image,
        likes,
        comments: postComments,
        createdAt: new Date(Date.now() - (postTemplates.length - i) * 3600000 * 2),
      };
    });

    await Post.insertMany(postsToCreate);
    console.log(`📝 Created ${postsToCreate.length} seed posts`);
    console.log('\n✅ Seed complete! Demo accounts:');
    users.forEach(u => console.log(`   ${u.email} / ${u.password}`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
