

export const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        // process.env.CLIENT_URL!,
    ],
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    credentials: true,
};

export const COOKIE_TOKEN = "cookie";

