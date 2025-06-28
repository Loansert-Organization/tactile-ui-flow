
-- Drop the existing countries table and recreate with the new structure
DROP TABLE IF EXISTS public.countries;

-- Create the new countries table with dual provider support
CREATE TABLE public.countries (
  code TEXT PRIMARY KEY,
  name TEXT,
  currency TEXT,
  -- Provider 1
  p1_name TEXT,
  p1_service TEXT,
  p1_send_money TEXT,
  p1_pay_bill TEXT,
  -- Provider 2
  p2_name TEXT,
  p2_service TEXT,
  p2_send_money TEXT,
  p2_pay_bill TEXT
);

-- Insert all the Sub-Saharan African countries data
INSERT INTO public.countries VALUES
('AO','Angola','AOA',
  'Unitel','Unitel Money','*400*1*1*[RECIPIENT]*[AMOUNT]#','*400*3*[BILLCODE]*[AMOUNT]#',
  'Movicel','Movicel Money','*200*1*1*[RECIPIENT]*[AMOUNT]#','*200*3*[BILLCODE]*[AMOUNT]#'),

('BJ','Benin','XOF',
  'MTN','MTN MoMo','*880*1*1*[RECIPIENT]*[AMOUNT]#','*880*5*[BILLCODE]*[AMOUNT]#',
  'Moov','Moov Money','*855*1*1*[RECIPIENT]*[AMOUNT]#','*855*5*[BILLCODE]*[AMOUNT]#'),

('BW','Botswana','BWP',
  'Orange','Orange Money','*145*1*1*[RECIPIENT]*[AMOUNT]#','*145*5*[BILLCODE]*[AMOUNT]#',
  'Mascom','MyZaka','*167*1*1*[RECIPIENT]*[AMOUNT]#','*167*5*[BILLCODE]*[AMOUNT]#'),

('BF','Burkina Faso','XOF',
  'Orange','Orange Money','*144*1*1*[RECIPIENT]*[AMOUNT]#','*144*5*[BILLCODE]*[AMOUNT]#',
  'Moov','Mobicash','*555*1*1*[RECIPIENT]*[AMOUNT]#','*555*5*[BILLCODE]*[AMOUNT]#'),

('BI','Burundi','BIF',
  'Lumitel','Lumicash','*163*1*1*[RECIPIENT]*[AMOUNT]#','*163*5*[BILLCODE]*[AMOUNT]#',
  'Econet','EcoCash','*151*1*1*[RECIPIENT]*[AMOUNT]#','*151*5*[BILLCODE]*[AMOUNT]#'),

('CM','Cameroon','XAF',
  'MTN','MTN MoMo','*126*1*1*[RECIPIENT]*[AMOUNT]#','*126*5*[BILLCODE]*[AMOUNT]#',
  'Orange','Orange Money','#150*1*1*[RECIPIENT]*[AMOUNT]#','#150*5*[BILLCODE]*[AMOUNT]#'),

('CD','DR Congo','CDF',
  'Vodacom','M-Pesa','*1222*1*1*[RECIPIENT]*[AMOUNT]#','*1222*4*[BILLCODE]*[AMOUNT]#',
  'Airtel','Airtel Money','*501*1*1*[RECIPIENT]*[AMOUNT]#','*501*5*[BILLCODE]*[AMOUNT]#'),

('CG','Congo','XAF',
  'Airtel','Airtel Money','*128*1*1*[RECIPIENT]*[AMOUNT]#','*128*5*[BILLCODE]*[AMOUNT]#',
  'MTN','MTN MoMo','*104*1*1*[RECIPIENT]*[AMOUNT]#','*104*5*[BILLCODE]*[AMOUNT]#'),

('CI','Cote d''Ivoire','XOF',
  'MTN','MoMo','*133*1*1*[RECIPIENT]*[AMOUNT]#','*133*5*[BILLCODE]*[AMOUNT]#',
  'Orange','Orange Money','#144*1*1*[RECIPIENT]*[AMOUNT]#','#144*5*[BILLCODE]*[AMOUNT]#'),

('DJ','Djibouti','DJF',
  NULL,NULL,NULL,NULL,
  NULL,NULL,NULL,NULL),

('ET','Ethiopia','ETB',
  'Ethio Telecom','telebirr','*127*1*1*[RECIPIENT]*[AMOUNT]#','*127*3*[BILLCODE]*[AMOUNT]#',
  'Safaricom','M-Pesa (Ethiopia)','*733*1*1*[RECIPIENT]*[AMOUNT]#','*733*3*[BILLCODE]*[AMOUNT]#'),

('GM','Gambia','GMD',
  'Africell','Afrimoney','*777*1*1*[RECIPIENT]*[AMOUNT]#','*777*5*[BILLCODE]*[AMOUNT]#',
  'QCell','QMoney','*323*1*1*[RECIPIENT]*[AMOUNT]#','*323*5*[BILLCODE]*[AMOUNT]#'),

('GA','Gabon','XAF',
  'Airtel','Airtel Money','*150*1*1*[RECIPIENT]*[AMOUNT]#','*150*5*[BILLCODE]*[AMOUNT]#',
  'Moov','Mobicash','*555*1*1*[RECIPIENT]*[AMOUNT]#','*555*5*[BILLCODE]*[AMOUNT]#'),

('GH','Ghana','GHS',
  'MTN','MTN MoMo','*170*1*1*[RECIPIENT]*[AMOUNT]#','*170*2*[BILLCODE]*[AMOUNT]#',
  'Vodafone (aka Telecel)','Vodafone Cash','*110*1*1*[RECIPIENT]*[AMOUNT]#','*110*5*[BILLCODE]*[AMOUNT]#'),

('GN','Guinea','GNF',
  'Orange','Orange Money','#144*1*1*[RECIPIENT]*[AMOUNT]#','#144*5*[BILLCODE]*[AMOUNT]#',
  'MTN','MTN MoMo','*160*1*1*[RECIPIENT]*[AMOUNT]#','*160*5*[BILLCODE]*[AMOUNT]#'),

('GW','Guinea-Bissau','XOF',
  'Orange','Orange Money','#144*1*1*[RECIPIENT]*[AMOUNT]#','#144*5*[BILLCODE]*[AMOUNT]#',
  NULL,NULL,NULL,NULL),

('LS','Lesotho','LSL',
  'Vodacom','M-Pesa','*111*1*1*[RECIPIENT]*[AMOUNT]#','*111*4*[BILLCODE]*[AMOUNT]#',
  'Econet','EcoCash','*100*1*1*[RECIPIENT]*[AMOUNT]#','*100*3*[BILLCODE]*[AMOUNT]#'),

('LR','Liberia','LRD',
  'Orange','Orange Money','*144*1*1*[RECIPIENT]*[AMOUNT]#','*144*5*[BILLCODE]*[AMOUNT]#',
  'Lonestar MTN','MTN MoMo','*156*1*1*[RECIPIENT]*[AMOUNT]#','*156*5*[BILLCODE]*[AMOUNT]#'),

('MG','Madagascar','MGA',
  'Telma','MVola','#111*1*1*[RECIPIENT]*[AMOUNT]#','#111*5*[BILLCODE]*[AMOUNT]#',
  'Airtel','Airtel Money','*211*1*1*[RECIPIENT]*[AMOUNT]#','*211*5*[BILLCODE]*[AMOUNT]#'),

('MW','Malawi','MWK',
  'Airtel','Airtel Money','*211*1*1*[RECIPIENT]*[AMOUNT]#','*211*5*[BILLCODE]*[AMOUNT]#',
  'TNM','Mpamba','*444*1*1*[RECIPIENT]*[AMOUNT]#','*444*5*[BILLCODE]*[AMOUNT]#'),

('ML','Mali','XOF',
  'Orange','Orange Money','#144*1*1*[RECIPIENT]*[AMOUNT]#','#144*5*[BILLCODE]*[AMOUNT]#',
  'Moov','Moov Money','*555*1*1*[RECIPIENT]*[AMOUNT]#','*555*5*[BILLCODE]*[AMOUNT]#'),

('MU','Mauritius','MUR',
  'Orange','Orange Money','*140*1*1*[RECIPIENT]*[AMOUNT]#','*140*5*[BILLCODE]*[AMOUNT]#',
  'Emtel','Emtel Money','*999*1*1*[RECIPIENT]*[AMOUNT]#','*999*5*[BILLCODE]*[AMOUNT]#'),

('MZ','Mozambique','MZN',
  'Vodacom','M-Pesa','*150*01*1*[RECIPIENT]*[AMOUNT]#','*150*01*4*[BILLCODE]*[AMOUNT]#',
  'Movitel','e-Mola','*898*1*1*[RECIPIENT]*[AMOUNT]#','*898*5*[BILLCODE]*[AMOUNT]#'),

('NA','Namibia','NAD',
  'MTC','M-Money (O''Pay)','*140*1*1*[RECIPIENT]*[AMOUNT]#','*140*4*[BILLCODE]*[AMOUNT]#',
  NULL,NULL,NULL,NULL),

('NE','Niger','XOF',
  'Airtel','Airtel Money','*322*1*1*[RECIPIENT]*[AMOUNT]#','*322*5*[BILLCODE]*[AMOUNT]#',
  'Moov','Moov Money','*555*1*1*[RECIPIENT]*[AMOUNT]#','*555*5*[BILLCODE]*[AMOUNT]#'),

('RW','Rwanda','RWF',
  'MTN','MoMo','*182*1*1*[RECIPIENT]*[AMOUNT]#','*182*8*1*[BILLCODE]*[AMOUNT]#',
  'Airtel','Airtel Money','*500*1*1*[RECIPIENT]*[AMOUNT]#','*500*3*[BILLCODE]*[AMOUNT]#'),

('ST','Sao Tome & Principe','STN',
  NULL,NULL,NULL,NULL,
  NULL,NULL,NULL,NULL),

('SN','Senegal','XOF',
  'Orange','Orange Money','#144*1*1*[RECIPIENT]*[AMOUNT]#','#144*5*[BILLCODE]*[AMOUNT]#',
  'Free','Free Money (Kalpe)','#150*1*1*[RECIPIENT]*[AMOUNT]#','#150*5*[BILLCODE]*[AMOUNT]#'),

('SC','Seychelles','SCR',
  'Airtel','Airtel Money','*202*1*1*[RECIPIENT]*[AMOUNT]#','*202*5*[BILLCODE]*[AMOUNT]#',
  NULL,NULL,NULL,NULL),

('SL','Sierra Leone','SLE',
  'Orange','Orange Money','*144*1*1*[RECIPIENT]*[AMOUNT]#','*144*5*[BILLCODE]*[AMOUNT]#',
  'Africell','AfriMoney','*161*1*1*[RECIPIENT]*[AMOUNT]#','*161*5*[BILLCODE]*[AMOUNT]#'),

('SO','Somalia','SOS',
  'Hormuud','EVC Plus','*770*1*1*[RECIPIENT]*[AMOUNT]#','*770*5*[BILLCODE]*[AMOUNT]#',
  'Telesom','ZAAD','*888*1*1*[RECIPIENT]*[AMOUNT]#','*888*5*[BILLCODE]*[AMOUNT]#'),

('SD','Sudan','SDG',
  'MTN','Mobile Cash','*170*1*1*[RECIPIENT]*[AMOUNT]#','*170*4*[BILLCODE]*[AMOUNT]#',
  'Zain','Hassa','*200*1*1*[RECIPIENT]*[AMOUNT]#','*200*4*[BILLCODE]*[AMOUNT]#'),

('SS','South Sudan','SSP',
  'Zain','m-GURUSH','*355*1*1*[RECIPIENT]*[AMOUNT]#','*355*5*[BILLCODE]*[AMOUNT]#',
  NULL,NULL,NULL,NULL),

('TZ','Tanzania','TZS',
  'Vodacom','M-Pesa','*150*00*1*1*[RECIPIENT]*[AMOUNT]#','*150*00*4*[BILLCODE]*[AMOUNT]#',
  'Airtel','Airtel Money','*150*60*1*1*[RECIPIENT]*[AMOUNT]#','*150*60*4*[BILLCODE]*[AMOUNT]#'),

('TG','Togo','XOF',
  'Togocom','T-Money','*145*1*1*[RECIPIENT]*[AMOUNT]#','*145*5*[BILLCODE]*[AMOUNT]#',
  'Moov','Flooz','*155*1*1*[RECIPIENT]*[AMOUNT]#','*155*5*[BILLCODE]*[AMOUNT]#'),

('ZM','Zambia','ZMW',
  'MTN','MTN MoMo','*115*1*1*[RECIPIENT]*[AMOUNT]#','*115*5*[BILLCODE]*[AMOUNT]#',
  'Airtel','Airtel Money','*778*1*1*[RECIPIENT]*[AMOUNT]#','*778*5*[BILLCODE]*[AMOUNT]#'),

('ZW','Zimbabwe','ZWL',
  'Econet','EcoCash','*151*1*1*[RECIPIENT]*[AMOUNT]#','*151*5*[BILLCODE]*[AMOUNT]#',
  'NetOne','OneMoney','*111*1*1*[RECIPIENT]*[AMOUNT]#','*111*5*[BILLCODE]*[AMOUNT]#');
