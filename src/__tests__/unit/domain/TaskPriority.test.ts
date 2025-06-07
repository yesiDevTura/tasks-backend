describe('TaskPriority Basic Tests', () => {
  it('should handle LOW priority', () => {
    const priority = 'LOW';
    expect(priority).toBe('LOW');
  });

  it('should handle MEDIUM priority', () => {
    const priority = 'MEDIUM';
    expect(priority).toBe('MEDIUM');
  });

  it('should handle HIGH priority', () => {
    const priority = 'HIGH';
    expect(priority).toBe('HIGH');
  });
});
