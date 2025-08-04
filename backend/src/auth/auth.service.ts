import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

interface DiscordUser {
  discordId: string;
  username: string;
  avatar?: string;
  email?: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateDiscordUser(discordUser: DiscordUser): Promise<UserDocument> {
    let user = await this.userModel.findOne({ discordId: discordUser.discordId });

    if (!user) {
      user = new this.userModel({
        discordId: discordUser.discordId,
        username: discordUser.username,
        avatar: discordUser.avatar,
        email: discordUser.email,
        lastLogin: new Date(),
      });
      await user.save();
    } else {
      user.lastLogin = new Date();
      user.username = discordUser.username;
      user.avatar = discordUser.avatar;
      if (discordUser.email) {
        user.email = discordUser.email;
      }
      await user.save();
    }

    return user;
  }

  async findUserById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async generateJwtToken(user: UserDocument): Promise<string> {
    const payload = { username: user.username, sub: user._id };
    return this.jwtService.sign(payload);
  }
}
