import { writeFileSync } from "node:fs";

const output = await fetch("https://api.starkscancdn.com/graphql", {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; rv:109.0) Gecko/20100101 Firefox/115.0",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.5",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "cross-site",
    "Content-Type": "application/json",
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  },
  body: '{"query":"query TransactionsTablePaginationFragment(\\n  $after: String\\n  $first: Int!\\n  $input: TransactionsInput!\\n) {\\n  ...TransactionsTablePaginationFragment_transactions_2DAjA4\\n}\\n\\nfragment TransactionsTableExpandedItemFragment_transaction on Transaction {\\n  entry_point_selector_name\\n  calldata_decoded\\n  entry_point_selector\\n  calldata\\n  initiator_address\\n  initiator_identifier\\n  main_calls {\\n    selector\\n    selector_name\\n    calldata_decoded\\n    selector_identifier\\n    calldata\\n    contract_address\\n    contract_identifier\\n    id\\n  }\\n}\\n\\nfragment TransactionsTablePaginationFragment_transactions_2DAjA4 on Query {\\n  transactions(first: $first, after: $after, input: $input) {\\n    edges {\\n      node {\\n        id\\n        ...TransactionsTableRowFragment_transaction\\n        __typename\\n      }\\n      cursor\\n    }\\n    pageInfo {\\n      endCursor\\n      hasNextPage\\n    }\\n  }\\n}\\n\\nfragment TransactionsTableRowFragment_transaction on Transaction {\\n  id\\n  transaction_hash\\n  block_number\\n  transaction_status\\n  transaction_type\\n  timestamp\\n  initiator_address\\n  initiator_identifier\\n  initiator {\\n    is_social_verified\\n    id\\n  }\\n  main_calls {\\n    selector_identifier\\n    id\\n  }\\n  ...TransactionsTableExpandedItemFragment_transaction\\n}\\n","variables":{"after":"MTcwODE4NDU3ODAwMDAxODAwMDAwMA==","first":1130,"input":{"initiator_address":"0x06c364fa52256aa61cfa0c8a38e34f24cd87ae84e4e6ae14064cb2df9f0dc6fb","max_block_number":null,"max_timestamp":null,"min_block_number":null,"min_timestamp":null,"order_by":"desc","sort_by":"timestamp","transaction_types":null}}}',
  method: "POST",
  mode: "cors",
});

writeFileSync("./data.json", JSON.stringify(output));
