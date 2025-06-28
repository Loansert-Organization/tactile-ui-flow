
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Target, Users, Calendar, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGate } from '@/components/auth/AuthGate';

interface BasketData {
  name: string;
  description: string;
  goalAmount: string;
  duration: string;
  privacy: 'public' | 'private';
}

const BasketWizard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<BasketData>({
    name: '',
    description: '',
    goalAmount: '',
    duration: '30',
    privacy: 'public'
  });

  const updateData = (field: keyof BasketData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const handleCreate = async () => {
    // TODO: Implement basket creation
    console.log('Creating basket:', data);
    navigate('/baskets/mine');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('wizard.basicInfo')}</h1>
              <p className="text-lg text-muted-foreground">{t('wizard.basicInfoDesc')}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold">
                  {t('basket.basketName')}
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => updateData('name', e.target.value)}
                  placeholder={t('wizard.namePlaceholder')}
                  className="text-lg py-4 px-4 h-14"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  {t('basket.description')}
                </Label>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={(e) => updateData('description', e.target.value)}
                  placeholder={t('wizard.descriptionPlaceholder')}
                  className="w-full min-h-24 px-4 py-4 text-lg border border-input rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('wizard.setGoal')}</h1>
              <p className="text-lg text-muted-foreground">{t('wizard.setGoalDesc')}</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goalAmount" className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {t('basket.goalAmount')}
                </Label>
                <Input
                  id="goalAmount"
                  type="number"
                  value={data.goalAmount}
                  onChange={(e) => updateData('goalAmount', e.target.value)}
                  placeholder="100000"
                  className="text-2xl py-4 px-4 h-16 text-center font-semibold"
                />
                <p className="text-sm text-muted-foreground text-center">RWF</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t('wizard.duration')}
                </Label>
                <select
                  id="duration"
                  value={data.duration}
                  onChange={(e) => updateData('duration', e.target.value)}
                  className="w-full px-4 py-4 text-lg border border-input rounded-lg bg-background h-14"
                >
                  <option value="7">7 {t('wizard.days')}</option>
                  <option value="14">14 {t('wizard.days')}</option>
                  <option value="30">30 {t('wizard.days')}</option>
                  <option value="60">60 {t('wizard.days')}</option>
                  <option value="90">90 {t('wizard.days')}</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('wizard.privacy')}</h1>
              <p className="text-lg text-muted-foreground">{t('wizard.privacyDesc')}</p>
            </div>

            <div className="space-y-4">
              <Card 
                className={`cursor-pointer transition-all border-2 ${data.privacy === 'public' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                onClick={() => updateData('privacy', 'public')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Users className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">{t('wizard.publicBasket')}</h3>
                      <p className="text-muted-foreground">{t('wizard.publicDesc')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all border-2 ${data.privacy === 'private' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                onClick={() => updateData('privacy', 'private')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold">{t('wizard.privateBasket')}</h3>
                      <p className="text-muted-foreground">{t('wizard.privateDesc')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl">{t('wizard.summary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="font-semibold">{t('basket.basketName')}:</span>
                  <p className="text-lg">{data.name}</p>
                </div>
                <div>
                  <span className="font-semibold">{t('basket.goalAmount')}:</span>
                  <p className="text-lg">{parseInt(data.goalAmount).toLocaleString()} RWF</p>
                </div>
                <div>
                  <span className="font-semibold">{t('wizard.duration')}:</span>
                  <p className="text-lg">{data.duration} {t('wizard.days')}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return data.name.trim() && data.description.trim();
      case 2: return data.goalAmount && parseInt(data.goalAmount) > 0;
      case 3: return data.privacy;
      default: return false;
    }
  };

  return (
    <AuthGate feature={t('wizard.createBasket')}>
      <div className="min-h-screen bg-background">
        {/* Progress Bar */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b">
          <div className="container max-w-lg mx-auto p-4">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <span className="text-lg font-semibold">{step}/3</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-lg mx-auto p-4 pb-24">
          {renderStep()}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
          <div className="container max-w-lg mx-auto">
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="w-full h-14 text-lg font-semibold"
              >
                {t('common.next')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            ) : (
              <Button
                onClick={handleCreate}
                disabled={!canProceed()}
                className="w-full h-14 text-lg font-semibold"
              >
                {t('wizard.createBasket')}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AuthGate>
  );
};

export default BasketWizard;
