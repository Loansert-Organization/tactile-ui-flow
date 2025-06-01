
export interface BasketData {
  name: string;
  description: string;
  goal: string;
  frequency: string;
  duration: string;
  privacy: 'private'; // Always private for user-created baskets
  anonymity: 'anonymous' | 'named';
  contributionType: 'recurring' | 'one-off';
  profileImage: string | null;
}

export interface StepProps {
  basketData: BasketData;
  updateBasketData?: (field: keyof BasketData, value: string) => void;
  onBack: () => void;
  onNext?: () => void;
  handlePress: (e: React.MouseEvent) => void;
}
