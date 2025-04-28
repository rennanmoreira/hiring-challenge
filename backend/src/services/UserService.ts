import { User } from "../models/User";
import { DatabaseContext } from "../config/database-context";
import { Repository, ILike, IsNull } from "typeorm";
import { InvalidDataError } from "../errors/InvalidDataError";
import { UserNotFoundError } from "../errors/UserNotFoundError";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export class UserService {
  private userRepository: Repository<User>;
  private readonly JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

  constructor() {
    this.userRepository = DatabaseContext.getInstance().getRepository(User);
  }

  // Método auxiliar para remover passwordHash
  private removePasswordHash(user: User): Omit<User, "passwordHash"> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, "passwordHash">;
  }

  // Método auxiliar para remover passwordHash de arrays
  private removePasswordHashFromArray(
    users: User[]
  ): Omit<User, "passwordHash">[] {
    return users.map((user) => this.removePasswordHash(user));
  }

  async create(data: Partial<User>) {
    // Validar dados
    if (!data.username || !data.email || !data.passwordHash) {
      throw new InvalidDataError("Username, email and password are required");
    }

    // Verificar se usuário já existe
    const existingUser = await this.userRepository.findOne({
      where: [{ username: data.username }, { email: data.email }],
    });

    if (existingUser) {
      throw new InvalidDataError("Username or email already exists");
    }

    // Criptografar senha se não estiver criptografada
    if (data.passwordHash && !data.passwordHash.startsWith("$2")) {
      data.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }

    const entity = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(entity);
    return this.removePasswordHash(savedUser);
  }

  async findAll() {
    const users = await this.userRepository.find({
      where: {
        deletedAt: IsNull(),
      },
    });
    return this.removePasswordHashFromArray(users);
  }

  async findById(id: string) {
    console.log("id: ", id);
    const user = await this.userRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    if (!user) return null;
    return this.removePasswordHash(user);
  }

  async findByNameOrEmail(search: string) {
    const users = await this.userRepository.find({
      where: [
        { name: ILike(`%${search}%`), deletedAt: IsNull() },
        { email: ILike(`%${search}%`), deletedAt: IsNull() },
        { username: ILike(`%${search}%`), deletedAt: IsNull() },
      ],
    });
    return this.removePasswordHashFromArray(users);
  }

  async findByStatus(isActive: boolean) {
    const users = await this.userRepository.find({
      where: {
        isActive,
        deletedAt: IsNull(),
      },
    });
    return this.removePasswordHashFromArray(users);
  }

  async update(id: string, data: Partial<User>) {
    const user = await this.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    // Verificar se username ou email já existem
    if (data.username && data.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: data.username, deletedAt: IsNull() },
      });
      if (existingUser) {
        throw new InvalidDataError("Username already exists");
      }
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: data.email, deletedAt: IsNull() },
      });
      if (existingUser) {
        throw new InvalidDataError("Email already exists");
      }
    }

    // Atualizar usuário
    Object.assign(user, data);
    const savedUser = await this.userRepository.save(user);
    return this.removePasswordHash(savedUser);
  }

  async delete(id: string) {
    const user = await this.findById(id);
    if (!user) {
      throw new UserNotFoundError();
    }

    return this.userRepository.softDelete(id);
  }

  async authenticate(username: string, password: string) {
    // Buscar usuário por username
    const user = await this.userRepository.findOne({
      where: {
        username,
        deletedAt: IsNull(),
      },
    });

    if (!user || !user.isActive) {
      throw new InvalidDataError("Invalid credentials or inactive user");
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidDataError("Invalid credentials");
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      this.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return { user: this.removePasswordHash(user), token };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Buscar usuário diretamente do repositório para ter acesso ao passwordHash
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new InvalidDataError("Current password is incorrect");
    }

    // Validar nova senha
    if (!newPassword || newPassword.length < 6) {
      throw new InvalidDataError("New password must be at least 6 characters");
    }

    // Atualizar senha
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
  }

  async updateStatus(userId: string, isActive: boolean) {
    // Buscar usuário diretamente do repositório para ter acesso ao passwordHash
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: IsNull(),
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    user.isActive = isActive;
    const savedUser = await this.userRepository.save(user);
    return this.removePasswordHash(savedUser);
  }
}
