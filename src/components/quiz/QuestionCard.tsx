import { View } from 'react-native';

import { AnswerOption } from '@/components/quiz/AnswerOption';
import { Typography } from '@/components/ui/Typography';
import type { AnswerLetter, Question } from '@/types/database';

type Props = {
  question: Question;
  questionNumber: number;
  selectedAnswer: AnswerLetter | null;
  isAnswered: boolean;
  onSelectAnswer: (letter: AnswerLetter) => void;
};

const LETTERS: AnswerLetter[] = ['A', 'B', 'C', 'D'];

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
}: Props) {
  const optionTexts: Record<AnswerLetter, string> = {
    A: question.option_a,
    B: question.option_b,
    C: question.option_c,
    D: question.option_d,
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Typography variant="caption" color="muted">
          Soru {questionNumber}
        </Typography>
        <Typography variant="body" weight="semibold">
          {question.question_text}
        </Typography>
      </View>

      <View className="gap-3">
        {LETTERS.map((letter) => (
          <AnswerOption
            key={letter}
            letter={letter}
            text={optionTexts[letter]}
            selected={selectedAnswer === letter}
            isAnswered={isAnswered}
            isCorrect={question.correct_answer === letter}
            onPress={() => onSelectAnswer(letter)}
          />
        ))}
      </View>
    </View>
  );
}
