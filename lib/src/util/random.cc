#include <random>
#include <vector>
#include "random.h"

using std::vector;

namespace Util
{

vector<int> random(int min, int max, int amount)
{
    // Obtain a random number from the hardware
    std::random_device rd;
    
    // Seed a 'Mersenne Twister pseudo-random generator'
    std::mt19937 gen(rd());
    
    // Define the range
    std::uniform_int_distribution<> distr(min, max);
    
    // Generate the numbers
    vector<int> numbers(amount, 0);
    for (int i = 0; i < amount; i++)
    {
        numbers[i] = distr(gen);
    }

    return numbers;
}

template <typename T>
vector<T> sample(vector<T> &input, int k)
{
    vector<T> output;
    vector<int> numbers = random(0, input.size(), k);

    for (int &number : numbers)
    {
        output.push_back(input[number]);
    }

    return output;
}

}
