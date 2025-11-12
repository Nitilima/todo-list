import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    isActive: boolean;
  };
}

export interface JWTPayload {
  userId: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export type PrismaTaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type PrismaTaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
