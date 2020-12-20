#ifndef UTIL_H
#define UTIL_H
#include <vector>

namespace Util
{
    /// Generate pseudo-random numbers
    std::vector<int> random(int min, int max, int amount);
}

#endif