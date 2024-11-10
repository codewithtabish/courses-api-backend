/** @format */

// utils/doSomeHeavyTask.ts

// Helper function to perform a CPU-intensive task (Fibonacci calculation)
const calculateFibonacci = (n: number): number => {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
};

// Main heavy task function
export const doSomeHeavyTask = async () => {
  return new Promise((resolve, reject) => {
    // Simulate a longer delay between 3 to 10 seconds
    const delay = Math.floor(Math.random() * 7000) + 3000;

    setTimeout(() => {
      try {
        // Add a heavy CPU-bound task (Fibonacci calculation)
        const fibNumber = calculateFibonacci(35); // Higher number makes it heavier

        // Randomly throw an error or send different responses
        const random = Math.random();
        if (random < 0.3) {
          reject(new Error('Something went wrong during processing!'));
        } else if (random < 0.6) {
          resolve({
            message: 'Processed successfully!',
            status: 'success',
            data: fibNumber,
          });
        } else {
          resolve({
            message: 'Partial success!',
            status: 'partial',
            data: fibNumber,
          });
        }
      } catch (error) {
        reject(new Error('Heavy computation failed!'));
      }
    }, delay);
  });
};
