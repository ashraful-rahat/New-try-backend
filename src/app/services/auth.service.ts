import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt';
import { AuthResponse, LoginDTO, RegisterDTO } from '../interfaces/auth.interface';
import { AdminModel } from '../models/Admin.model';

export class AuthService {
  // Register a new user
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const { email, password } = data;

    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) throw new Error('User already exists');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine role: first user = admin
    const isFirstUser = (await AdminModel.countDocuments()) === 0;
    const role = isFirstUser ? 'admin' : 'member';

    const user = await AdminModel.create({ email, password: hashedPassword, role });

    const token = generateToken(user._id.toString(), user.email, user.role);

    return {
      message: 'Registration successful',
      admin: { id: user._id.toString(), email: user.email, role: user.role },
      token,
    };
  }

  // Login user
  async login(data: LoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await AdminModel.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error('Invalid credentials');

    const token = generateToken(user._id.toString(), user.email, user.role);

    return {
      message: 'Login successful',
      admin: { id: user._id.toString(), email: user.email, role: user.role },
      token,
    };
  }
}
