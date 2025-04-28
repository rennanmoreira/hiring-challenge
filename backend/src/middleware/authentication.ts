import * as express from "express";
import * as jwt from "jsonwebtoken";

export type ExpressRequestWithUser = express.Request & {
  user?: { id: string };
};

export async function expressAuthentication(
  request: ExpressRequestWithUser,
  securityName: string,
  _scopes?: string[]
): Promise<any> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return Promise.reject(new Error("No token provided"));
    }

    const jwtSecret = process.env.JWT_SECRET || "default_secret_key";
    return await new Promise((resolve, reject) => {
      jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
        if (err) {
          reject(new Error("Invalid token"));
        } else {
          request["user"] = decoded;
          resolve(decoded);
        }
      });
    });
  }

  return Promise.reject(new Error("Invalid security name"));
}
