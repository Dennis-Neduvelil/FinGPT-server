import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  constructor(private config: ConfigService) {}
  private oauth2Client = new google.auth.OAuth2(
    this.config.get<string>('GOOGLE_CLIENT_ID'),
    this.config.get<string>('GOOGLE_CLIENT_SECRET'),
    'postmessage',
  );

  getAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
  }

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2('v2');
    const { data } = await oauth2.userinfo.get({ auth: this.oauth2Client });
    return { tokens, user: data };
  }
}
