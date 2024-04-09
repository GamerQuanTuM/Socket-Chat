

import prisma from "../src/lib/prismadb"
import bcrypt from "bcryptjs"

async function main() {
    // Hash passwords
    const hashedPassword1 = await bcrypt.hash('Shuvam@99', 10);
    const hashedPassword2 = await bcrypt.hash('Shuvam@99', 10);

    // Create two users
    const user1 = await prisma.user.create({
        data: {
            name: 'Shuvam Santra',
            email: 'shuvamsantra10@gmail.com',
            username: 'Shuvam Santra',
            password: hashedPassword1
        }
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Gamer Quantum',
            email: 'santrashuvam@gmail.com',
            username: 'Gamer Quantum',
            password: hashedPassword2
        }
    });

    // Create some chats between them
    await prisma.chat.createMany({
        data: [
            {
                message: 'Hello User2!',
                senderId: user1.id,
                receiverId: user2.id
            },
            {
                message: 'Hi User1!',
                senderId: user2.id,
                receiverId: user1.id
            },
            {
                message: 'How are you?',
                senderId: user1.id,
                receiverId: user2.id
            },
            {
                message: 'I\'m good, thanks!',
                senderId: user2.id,
                receiverId: user1.id
            }
        ]
    });

    console.log('Seed data populated successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
