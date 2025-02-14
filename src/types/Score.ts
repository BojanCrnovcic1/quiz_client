import { User } from "./User";

export interface Score {
    scoreId?: number;
    userId?: number;
    user?: User;
    totalScore: number;
    createdAt?: Date;
}