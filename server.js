import { Prisma, PrismaClient } from "@prisma/client";
import multer from "multer";
import express from "express";
import bcrypt from "bcrypt";
import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
import crypto from "crypto";
import cors from "cors";

dotenv.config();

const randomImageName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export const prisma = new PrismaClient();
export const app = express();
app.use(cors());

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3SecretAccesskey = process.env.S3_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretAccesskey,
  },
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Successfully running" });
});

/*
|----------------------------|
|------File Operations-------|
|----------------------------|
*/

//@CREATE A FILE
app.post(`/api/file`, upload.single("file"), async (req, res) => {
  const { userId } = req.body;
  console.log("userId", userId);
  console.log("file", req.file);
  const title = req.file.originalname;
  console.log("title", req.file.originalname);
  const fileName = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  const file = await prisma.file.create({
    data: {
      title,
      userId: parseInt(userId),
      fileName,
    },
  });

  res.send(file);
});

//@UPDATE THE FILE
app.put(`/api/file/:ID`, upload.single("file"), async (req, res) => {
  const { ID } = req.params;
  const id = parseInt(ID);
  const { userId, description } = req.body;
  console.log("body", req.body);
  const file = await prisma.file.findUnique({
    where: { id, userId: parseInt(userId) },
  });
  if (!file) {
    res.status(404).send("File not found");
  }
  const fileName = randomImageName();
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };
  const command = new PutObjectCommand(params);

  await s3.send(command);

  const updatedFile = await prisma.file.update({
    where: { id, userId: parseInt(userId) },
    data: {
      description,
      userId: parseInt(userId),
      fileName,
    },
  });

  res.send({ message: "Successfully updated" });
});

//@DELETE THE FILE
app.delete(`/api/file/:ID`, async (req, res) => {
  const { userId } = req.body;
  const { ID } = req.params;
  const id = parseInt(ID);
  const file = await prisma.file.findUnique({ where: { id, userId } });
  if (!file) {
    res.status(404).send("File not found");
  }

  const params = {
    Bucket: bucketName,
    Key: file.fileName,
  };
  const command = new DeleteObjectCommand(params);
  await s3.send(command);
  await prisma.file.delete({ where: { id } });
  res.json({ message: "Successfully deleted" });
});

//@GET ALL FILES
app.get("/api/admin/files", async (req, res) => {
  const files = await prisma.file.findMany();
  for (const file of files) {
    const getObjectParams = {
      Bucket: bucketName,
      Key: file.fileName,
    };
    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    file.url = url;
  }
  res.send(files);
});

//@GET ALL USER FILES
app.get("/api/files", async (req, res) => {
  const { user } = req.query;
  try {
    const files = await prisma.file.findMany({
      where: {
        userId: parseInt(user),
      },
    });
    for (const file of files) {
      const getObjectParams = {
        Bucket: bucketName,
        Key: file.fileName,
      };
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      file.url = url;
    }
    res.json(files);
  } catch (error) {
    res.json({ message: "Failed to fetch files" });
  }
});

//@GET SINGLE FILE
app.get(`/api/file/:id`, async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  const file = await prisma.file.findUnique({
    where: { id: parseInt(id), userId: parseInt(userId) },
  });
  if (!file) {
    res.send({ message: "File not found!" });
  }
  res.json(file);
});

/*
|----------------------------|
|------User Operations-------|
|----------------------------|
*/

// Function to hash a password
async function hashPassword(password) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    throw error;
  }
}

//@GET ALL USERS
app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

//@CREATE A USER
app.post(`/api/register`, async (req, res) => {
  const { name, email, password, firstName, lastName } = req.body;

  const hashedPassword = await hashPassword(password);

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

//@LOGIN USER
app.post(`/api/login`, async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    const match = await bcrypt.compare(password, user.password);

    if (match) {
      res.send({ userId: user.id, userName: user.firstName });
    } else {
      res.status(500).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: "Invalid credentials" });
    console.log(error);
  }
});

//@DELETE A USER
app.delete(`/api/user`, async (req, res) => {
  const { userId } = req.body;
  await prisma.user.delete({
    where: {
      id: parseInt(userId),
    },
  });
  res.json({ message: "Successfully deleted" });
});

const server = app.listen(8080, () =>
  console.log(`🚀 Server ready at: http://localhost:8080`)
);
