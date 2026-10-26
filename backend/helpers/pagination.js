function paginate(items, page = 1, pageSize = 10) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const start = (safePage - 1) * safePageSize;
  const end = start + safePageSize;

  return {
    page: safePage,
    pageSize: safePageSize,
    total: items.length,
    data: items.slice(start, end),
  };
}

module.exports = {
  paginate,
};
