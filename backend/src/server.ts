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

type SameSite = boolean | "lax" | "none" | "strict";

const sessConfig = {
  secret: process.env.SECRET_KEY!,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 20, secure: false, sameSite: false as SameSite },
  store: MongoStore.create({ mongoUrl: process.env.DATABASE_URL }),
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sessConfig.cookie.secure = true;
  sessConfig.cookie.sameSite = "none" as SameSite;
}

app.use(session(sessConfig));
app.use(cookieParser());

console.log(app.get("env"));

app.post("/login", async (req: Request, res: Response) => {
  const result = req.body;

  const acc = await prisma.acc.findFirst({
    where: { name: result.name, userId: result.userId },
  });

  if (!acc) return res.status(404).json({ message: "Account not found!" });

  req.session.regenerate((err) => {
    try {
      if (err) throw err;

      req.session.user = acc;

      req.session.save((err) => {
        if (err) throw err;
        console.log(req.session.user);
        return res.status(200).json(req.session.user);
      });
    } catch (error) {
      console.error(error);
    }
  });
});

function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const user = req.session.user;

  console.log(req.session);
  if (!user)
    return res.status(403).json({ message: "Session expired, please login!" });

  return next();
}

app.get("/part", isAuthenticated, async (req: Request, res: Response) => {
  const part = await prisma.participant.findMany();

  if (!part) {
    return res.status(404).json({ message: "Participant not found!" });
  }

  res.json(part).status(200);
});

app.post(
  "/selection/:id",
  isAuthenticated,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    if (!req.session.user)
      return res
        .status(403)
        .json({ message: "Session expired, please login!" });

    if (req.session.user.alreadyVote)
      return res
        .status(403)
        .json({ message: "You already vote the participants!" });

    const updateChoice = await prisma.acc.update({
      where: {
        id: req.session.user.id,
      },
      data: {
        alreadyVote: true,
        choice: {
          connect: {
            id,
          },
        },
      },
    });

    req.session.regenerate((err) => {
      try {
        if (err) throw err;

        req.session.user = updateChoice;

        req.session.save((err) => {
          if (err) throw err;
          return res
            .status(200)
            .json({ user: req.session.user, message: "Vote successful!" });
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
);

app.get("/acc", async (req: Request, res: Response) => {
  const acc = await prisma.acc.findMany();

  if (!acc) {
    return res.status(500).json({ message: "No Account in Database!" });
  }
  res.json(acc).status(200);
});

app.get("/allparts", async (req: Request, res: Response) => {
  const parts = await prisma.participant.findMany({
    include: {
      acc: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const partsWithAccCount = parts.map((part) => ({
    ...part,
    accCount: part.acc.length,
  }));

  res.json(partsWithAccCount);
});

app.get("/reset", async (req: Request, res: Response) => {
  const reset = await prisma.acc.updateMany({
    data: {
      alreadyVote: false,
      choiceId: null,
    },
  });
  res.json(reset);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server is listening on http://localhost:" + port);
});

export default app;
