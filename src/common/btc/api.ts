import axios from 'axios';

export const ApiBtc = axios.create({
  baseURL: 'https://www.mercadobitcoin.net/api/BTC/ticker/',
});
