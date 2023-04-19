import type { IComment } from '../domain/IComment';

export const ratingCalculator = (comments: IComment[]): number => {
  let totalScore = 0;
  comments.forEach((comment) => (totalScore += comment.score));
  return totalScore / comments.length;
};
