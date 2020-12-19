#ifndef UTIL_RANDOM_H
#define UTIL_RANDOM_H
#include <vector>

namespace Util
{

    /// Generate pseudo-random numbers
    std::vector<int> random(int min, int max, int amount);

    /// Return a k length vector with unique elements chosen at random from the input vector
    template <typename T>
    std::vector<T> sample(std::vector<T> &input, int k);

}

#endif