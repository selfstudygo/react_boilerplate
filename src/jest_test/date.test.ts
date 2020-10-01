describe('Date', () => {
  const now = Date.now();
  it('should have same number', () => {
    const newNow = Date.now();
    expect(newNow).toEqual(now);
  });
});
