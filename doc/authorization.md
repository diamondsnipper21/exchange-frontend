### Simple Authorization

The `CCAuthorization` class builds a simple action-permission matrix (see example below) based on current user's OR general restrictions coming from `cce-api-market-settings` or `project-settings` table.
Note that these restrictions are only applied at front-end level, for now.

Example of action-permission matrix:
```
{
  'buy': {
    'market': true,
    'limit': false,
    'stop': false
    },
  'sell': {
    'market': true,
    'limit': true,
    'stop': true
  },
}
```


Example of restrictions:
- Only one seller for HBRS token
- Only enable market buy orders
- Disable users listing tokens to sell for now
```json5
{
  "marketType": "btc",
  "projectId": "60dc05dc-9ab4-40c8-b224-b7ca59c4fc4b",
  "currencies": {
    "hbrs": {
      "restrictTrade": {
        "buy": {
          "order": [
            "market"
          ]
        },
        "sell": {
          "userUid": [
            "fefefefe-fefe-fefe-fefe-fefefefe",
          ]
        }
      }
    }
  }
}
```
