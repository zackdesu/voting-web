require("dotenv").config();

import express, { Express, NextFunction, Request, Response } from "express";
import { prisma } from "../libs/prisma";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

const port: number = 3000;
const app: Express = express();

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    "https://voting-web-mu.vercel.app",
    "http://localhost:5173",
  ];
  const origin = req.headers.origin;

  if (origin) {
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  }
  // res.setHeader(
  //   "Access-Control-Allow-Origin",
  //   "http://localhost:5173, https://voting-web-mu.vercel.app"
  // );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 20 },
    store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
  })
);
app.use(cookieParser());

app.post("/login", async (req: Request, res: Response) => {
  const result = req.body;

  const acc = await prisma.acc.findFirst({
    where: { name: result.name },
  });

  if (!acc) return res.status(404).json({ message: "Account not found!" });

  req.session.regenerate((err) => {
    try {
      if (err) throw err;

      req.session.user = acc;

      req.session.save((err) => {
        if (err) throw err;
        return res.status(200).json(req.session.user);
      });
    } catch (error) {
      console.error(error);
    }
  });
});

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const user = req.session.user;

  if (!user) return res.status(403).json({ message: "Not authenticated" });

  console.log(user);

  return next();
}

app.get("/part", isAuthenticated, async (req: Request, res: Response) => {
  const part = await prisma.participant.findMany();

  if (!part) {
    return res.status(404).json({ message: "Participant not found!" });
  }

  res.json(part).status(200);
});

app.get("/checkAuth", async (req: Request, res: Response) => {
  const session = await prisma.sessions.findMany();

  session.forEach((e) => {
    console.log(JSON.parse(e.session));
  });

  return res.json({ session, authenticated: true }).status(200);
});

app.get("/acc", async (req: Request, res: Response) => {
  const acc = await prisma.acc.findMany();

  if (!acc) {
    return res.status(500).json({ message: "No Account in Database!" });
  }
  res.json(acc).status(200);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server is listening on http://localhost:" + port);
});

export default app;
