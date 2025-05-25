async function fetchFactPrice() {
    const response = await fetch(
      "https://api.xeggex.com/api/v2/asset/getbyticker/fact"
    );
    const data = await response.json();
    return data.usdValue;
  }

  async function fetchDeadpoolEntries() {
    const response = await fetch(
      "https://sismargaret.fact0rn.io/api/public/deadpool/entries/unsolved"
    );
    return response.json();
  }

  function formatDateTime(millis) {
    if (!millis) return "";
    const date = new Date(millis);
    return date.toLocaleString();
  }

  $(document).ready(async function () {
    const priceUSD = await fetchFactPrice();
    const deadpoolData = await fetchDeadpoolEntries();

    const tableData = deadpoolData.content.map((entry) => [
      entry.n,
      entry.bits,
      entry.length,
      (entry.bounty * priceUSD).toFixed(2),
      formatDateTime(entry.millisSinceEpoch),
      entry.solution ? "Contested" : "Awaiting",
    ]);

    $("#ifaas_jobs").DataTable({
      data: tableData,
      columns: [
        {
            title: "Number",
            render: function (data, type, row, meta) {
            if (type === "display") {
                const truncated = data.length > 20 ? data.substr(0, 20) + "..." : data;
                return `<span class="truncate" title="${data}">${truncated}</span>`;
            }
            return data;
            },
        },
        { title: "Bits" },
        { title: "Digits" },
        {
            title: "Bounty (USD)",
            render: function (data, type, row, meta) {
            return `$${data}`;
            },
        },
        { title: "Start" },
        { title: "Status" },
        ],
      paging: true,
      searching: true,
      ordering: true,
      order: [[4, "desc"]],
    });
  });