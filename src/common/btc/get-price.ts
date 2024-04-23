import { ApiBtc } from './api';
import { BtcPriceResponse } from './interfaces/btc-price-response';

export const getBtcPrice = async () => {
  const { data } = await ApiBtc.get('/');
  return data.ticker as BtcPriceResponse;
};
