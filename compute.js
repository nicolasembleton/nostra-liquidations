import { readFileSync, writeFileSync } from "node:fs";

const dataContent = readFileSync("./data.json").toString();
const dataJSON = JSON.parse(dataContent);

const tokensContent = readFileSync("./tokens.json").toString();
const tokensJSON = JSON.parse(tokensContent);

const summary = dataJSON["data"]["transactions"]["edges"].reduce(
  (cur, node) => {
    node = node.node;

    // Skip if there are no main calls
    if (!Array.isArray(node.main_calls)) return cur;
    const timestamp = node.timestamp;
    const txHash = node.transaction_hash;
    const initiatorAddress = node.initiator_address;

    if (!cur.initiators[initiatorAddress]) cur.initiators[initiatorAddress] = 0;
    cur.initiators[initiatorAddress]++;

    for (const mainCall of node.main_calls) {
      console.log(mainCall);

      if (mainCall.selector_identifier === "liquidate") {
        cur.liquidations++;

        const tx = {
          txHash,
          collateralToken: "",
          debtToken: "",
          low: 0,
          high: 0,
          timestamp,
          date: new Date(timestamp * 1000),
          initiatorAddress,
        };

        for (const decodedCallData of mainCall.calldata_decoded) {
          switch (decodedCallData.name) {
            case "collateral_token_address":
              tx.collateralToken = tokensJSON[decodedCallData.value];
              tx.collateralToken.address = decodedCallData.value;
              break;
            case "debt_to_cover":
              tx.low = Number(decodedCallData.value[0].value);
              tx.high = Number(decodedCallData.value[1].value);
              break;
            case "debt_token_address":
              tx.debtToken = tokensJSON[decodedCallData.value];
              tx.debtToken.address = decodedCallData.value;
              break;
          }
        }

        tx.lowScaledCollateral =
          tx.low / Math.pow(10, tx.collateralToken.decimals);
        tx.lowScaledDebt = tx.low / Math.pow(10, tx.debtToken.decimals);
        tx.highScaledCollateral =
          tx.high / Math.pow(10, tx.collateralToken.decimals);
        tx.highScaled = tx.high / Math.pow(10, tx.debtToken.decimals);

        cur.txs.push(tx);
        cur.totalLiquidated += tx.low;

        if (!cur.collateralTokens[tx.collateralToken.address])
          cur.collateralTokens[tx.collateralToken.address] = {
            count: 0,
            total: 0,
            name: tx.collateralToken.name,
            decimals: tx.collateralToken.decimals,
          };
        if (!cur.debtTokens[tx.debtToken.address])
          cur.debtTokens[tx.debtToken.address] = {
            count: 0,
            total: 0,
            name: tx.debtToken.name,
            decimals: tx.debtToken.decimals,
          };

        cur.collateralTokens[tx.collateralToken.address].count++;
        cur.collateralTokens[tx.collateralToken.address].total +=
          tx.low /
          Math.pow(
            10,
            cur.collateralTokens[tx.collateralToken.address].decimals,
          );
        cur.debtTokens[tx.debtToken.address].count++;
        cur.debtTokens[tx.debtToken.address].total +=
          tx.low / Math.pow(10, cur.debtTokens[tx.debtToken.address].decimals);
      }
    }

    return cur;
  },
  {
    liquidations: 0,
    totalLiquidated: 0,
    txs: [],
    collateralTokens: {},
    debtTokens: {},
    initiators: {},
  },
);

console.dir(summary);

writeFileSync("./analysis.json", JSON.stringify(summary, null, 2));
