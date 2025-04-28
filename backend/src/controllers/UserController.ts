import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Route,
  Path,
  Tags,
  Put,
  Query,
  Response,
  Security,
  Request,
} from "tsoa";
import { User } from "../models/User";
import { UserService } from "../services/UserService";
import { InvalidDataError } from "../errors/InvalidDataError";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import { ExpressRequestWithUser } from "../middleware/authentication";

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  user: Omit<User, "passwordHash">;
  token: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Route("users")
@Tags("User")
export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  @Get()
  @Security("jwt")
  public async getUsers(
    @Query() search?: string,
    @Query() isActive?: boolean
  ): Promise<Omit<User, "passwordHash">[]> {
    if (search) {
      return this.userService.findByNameOrEmail(search);
    }

    if (isActive !== undefined) {
      return this.userService.findByStatus(isActive);
    }

    return this.userService.findAll();
  }

  @Get("me")
  @Security("jwt")
  public async getCurrentUser(
    @Request() request: ExpressRequestWithUser
  ): Promise<Omit<User, "passwordHash">> {
    try {
      // O ID do usuário é obtido do token JWT pelo middleware de autenticação
      const userId = request["user"]?.id;
      if (!userId) {
        throw new UserNotFoundError("User not found");
      }
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UserNotFoundError();
      }

      return user;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        this.setStatus(UserNotFoundError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Get("{userId}")
  @Security("jwt")
  public async getUser(
    @Path() userId: string
  ): Promise<Omit<User, "passwordHash">> {
    try {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }
      return user;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        this.setStatus(UserNotFoundError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Post()
  @Security("jwt")
  public async createUser(
    @Body()
    requestBody: Pick<User, "username" | "email" | "passwordHash" | "name">
  ): Promise<Omit<User, "passwordHash">> {
    try {
      return await this.userService.create(requestBody);
    } catch (error) {
      if (error instanceof InvalidDataError) {
        this.setStatus(InvalidDataError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Post("login")
  @Response<InvalidDataError>(401, "Invalid credentials")
  public async login(
    @Body() requestBody: LoginRequest
  ): Promise<LoginResponse> {
    try {
      return await this.userService.authenticate(
        requestBody.username,
        requestBody.password
      );
    } catch (error) {
      this.setStatus(401);
      throw new InvalidDataError("Invalid credentials");
    }
  }

  @Put("{userId}")
  @Security("jwt")
  public async updateUser(
    @Path() userId: string,
    @Body()
    requestBody: Partial<Pick<User, "username" | "email" | "name" | "isActive">>
  ): Promise<Omit<User, "passwordHash">> {
    try {
      return await this.userService.update(userId, requestBody);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        this.setStatus(UserNotFoundError.httpStatusCode);
        throw error;
      }
      if (error instanceof InvalidDataError) {
        this.setStatus(InvalidDataError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Put("{userId}/password")
  @Security("jwt")
  @Response<UserNotFoundError>(404, "User not found")
  @Response<InvalidDataError>(400, "Invalid password")
  public async changePassword(
    @Path() userId: string,
    @Body() requestBody: ChangePasswordRequest
  ): Promise<void> {
    try {
      await this.userService.changePassword(
        userId,
        requestBody.currentPassword,
        requestBody.newPassword
      );
      this.setStatus(204);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        this.setStatus(UserNotFoundError.httpStatusCode);
        throw error;
      }
      if (error instanceof InvalidDataError) {
        this.setStatus(InvalidDataError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Put("{userId}/status")
  @Security("jwt")
  @Response<UserNotFoundError>(404, "User not found")
  public async toggleUserStatus(
    @Path() userId: string,
    @Body() requestBody: { isActive: boolean }
  ): Promise<Omit<User, "passwordHash">> {
    try {
      return await this.userService.updateStatus(userId, requestBody.isActive);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        this.setStatus(UserNotFoundError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }

  @Delete("{userId}")
  @Security("jwt")
  public async deleteUser(@Path() userId: string): Promise<void> {
    try {
      await this.userService.delete(userId);
      this.setStatus(204);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        this.setStatus(UserNotFoundError.httpStatusCode);
        throw error;
      }
      throw error;
    }
  }
}
