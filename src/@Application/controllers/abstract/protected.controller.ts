import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@authentication/guards/jwt.guard';

export abstract class ProtectedController {}
