import ccxt

class RSICalculator:
    def __init__(self):
        # We don't need API keys just to fetch public chart data
        self.exchange = ccxt.binance()

    def get_rsi(self, symbol, timeframe='15m', period=14):
        """
        Calcula o RSI (Relative Strength Index) matemático
        para buscar moedas que estão em sobrevenda extrema (Pânico).
        """
        try:
            # Baixa o histórico das últimas 100 velas
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=period + 100)
            if len(ohlcv) < period + 1:
                return None
            
            closes = [x[4] for x in ohlcv] # Pegar o preço de fechamento
            
            # Cálculos de ganhos e perdas
            gains = []
            losses = []
            for i in range(1, len(closes)):
                diff = closes[i] - closes[i-1]
                if diff > 0:
                    gains.append(diff)
                    losses.append(0)
                else:
                    gains.append(0)
                    losses.append(abs(diff))
                    
            # Média das primeiras 14 velas
            avg_gain = sum(gains[:period]) / period
            avg_loss = sum(losses[:period]) / period
            
            # Suavização de Wilder para o restante do histórico
            for i in range(period, len(gains)):
                avg_gain = (avg_gain * (period - 1) + gains[i]) / period
                avg_loss = (avg_loss * (period - 1) + losses[i]) / period
                
            if avg_loss == 0:
                return 100 # Se não há perda, força compradora máxima
            
            rs = avg_gain / avg_loss
            rsi = 100 - (100 / (1 + rs))
            
            return rsi
            
        except Exception as e:
            print(f"[RSI Error] Falha ao calcular {symbol}: {e}")
            return None

    def get_ema(self, symbol, timeframe='1h', period=200):
        try:
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=period + 50)
            if len(ohlcv) < period:
                return None
            closes = [x[4] for x in ohlcv]
            # SMA para o primeiro valor
            ema = sum(closes[:period]) / period
            multiplier = 2 / (period + 1)
            for price in closes[period:]:
                ema = (price - ema) * multiplier + ema
            return ema
        except Exception as e:
            print(f"[EMA Error] Falha ao calcular {symbol}: {e}")
            return None

    def get_atr(self, symbol, timeframe='5m', period=14):
        try:
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=period + 50)
            if len(ohlcv) < period + 1:
                return None
            
            trs = []
            for i in range(1, len(ohlcv)):
                high = ohlcv[i][2]
                low = ohlcv[i][3]
                prev_close = ohlcv[i-1][4]
                tr = max(high - low, abs(high - prev_close), abs(low - prev_close))
                trs.append(tr)
                
            atr = sum(trs[:period]) / period
            for tr in trs[period:]:
                atr = (atr * (period - 1) + tr) / period
            return atr
        except Exception as e:
            print(f"[ATR Error] Falha ao calcular {symbol}: {e}")
            return None

if __name__ == "__main__":
    calc = RSICalculator()
    rsi_btc = calc.get_rsi('BTC/USDT', '15m')
    print(f"RSI atual do Bitcoin (15 min): {rsi_btc:.2f}")
