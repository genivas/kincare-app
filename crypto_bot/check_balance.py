from trading_engine import TradingEngine
import json

e = TradingEngine()
balance = e.exchange.fetch_balance()
info = balance['info']

assets = info.get('assets', [])
for asset in assets:
    if asset['asset'] == 'USDT':
        print(f"USDT Wallet Balance: {asset.get('walletBalance')}")
        print(f"USDT Available Balance: {asset.get('availableBalance')}")
        print(f"USDT Margin Balance: {asset.get('marginBalance')}")
