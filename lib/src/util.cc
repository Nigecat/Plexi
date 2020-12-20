#include <random>
#include <vector>
#include "util.h"

namespace Util
{

std::vector<int> random(int min, int max, int amount)
{
    // Obtain a random number from the hardware
    std::random_device rd;
    
    // Seed a 'Mersenne Twister pseudo-random generator'
    std::mt19937 gen(rd());
    
    // Define the range
    std::uniform_int_distribution<> distr(min, max);
    
    // Generate the numbers
    std::vector<int> numbers(amount, 0);
    for (int i = 0; i < amount; i++)
    {
        numbers[i] = distr(gen);
    }

    return numbers;
}

}
